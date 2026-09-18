import request from "supertest";
import app from "./index.js";
import mongoose from 'mongoose';
import { mongodbURL } from './config.js';
import { Car } from './models/carModel.js';
import { Owner } from './models/ownerModel.js';
import { Notification } from './models/notificationModel.js';

describe('Backend Integration and Database Connection Tests', () => {
  let token;
  let ownerId;
  let carId;
  let notificationId;

  beforeAll(async () => {
    await mongoose.connect(mongodbURL);
  });

  afterAll(async () => {
    await Notification.deleteMany({ car: carId });
    if (carId) await Car.findByIdAndDelete(carId);
    await Owner.deleteMany({ email: "johndoe@example.com" });
    await mongoose.disconnect();
  });

  // Test MongoDB connection
  test('Should connect to MongoDB successfully using Mongoose', () => {
    expect(mongoose.connection.readyState).toBe(1);  // 1 means connected
  });

  // Test GET request to root endpoint
  test('Should return a good HTTP response code for GET /', async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
  });

  // Integration test for user registration
  test('Should successfully register a new owner', async () => {
    const newOwner = {
      fname: "John",
      lname: "Doe",
      email: "johndoe@example.com",
      phone: "1234567890",
      password: "password123"
    };

    const response = await request(app)
      .post("/owner/")
      .send(newOwner);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("owner");
    expect(response.body.owner).toHaveProperty("_id");
    expect(response.body.owner.email).toBe("johndoe@example.com");
    expect(response.body.owner.password).toBeUndefined();
    ownerId = response.body.owner._id;
  });

  // Integration test for successful login
  test('Should successfully log in with valid credentials', async () => {
    const loginData = {
      email: "johndoe@example.com",
      password: "password123"
    };

    const response = await request(app)
      .post("/owner/login")
      .send(loginData);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("owner");
    expect(response.body).toHaveProperty("token");
    expect(response.body.owner.email).toBe("johndoe@example.com");
    token = response.body.token;
  });

  // Integration test for invalid login
  test('Should not log in with invalid credentials', async () => {
    const invalidLoginData = {
      email: "johndoe@example.com",
      password: "wrongpassword"
    };

    const response = await request(app)
      .post("/owner/login")
      .send(invalidLoginData);

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("Invalid password");
  });

  // Test for booking a car
  test('Should successfully create a booking request', async () => {
    const car = await Car.create({
      brand: "Volvo",
      model: "XC90",
      year: 2022,
      price: 80,
      mileage: 15000,
      engineSize: 2.0,
      fuelConsumption: 8,
      image: "placeholder.jpg",
      owner: ownerId,
    });
    carId = car._id.toString();

    const response = await request(app)
      .post("/owner/requestBooking")
      .send({ carId });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("Booking request sent.");
    expect(response.body).toHaveProperty("ownerDetails");
    expect(response.body.ownerDetails).toHaveProperty("name");
    expect(response.body.ownerDetails).toHaveProperty("email");
    expect(response.body.ownerDetails).toHaveProperty("phone");
  });

  // Notifications now require the owner's own token
  test('Should reject notifications access without a token', async () => {
    const response = await request(app).get(`/owner/notifications/${ownerId}`);
    expect(response.statusCode).toBe(401);
  });

  // Test for car owner receiving a notification
  test('Should successfully retrieve car owner notifications', async () => {
    const response = await request(app)
      .get(`/owner/notifications/${ownerId}`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body[0]).toHaveProperty("car");
    expect(response.body[0].car.brand).toBe("Volvo");
    notificationId = response.body[0]._id;
  });

  // Test for car owner accepting a booking request
  test('Should successfully accept a booking request', async () => {
    const response = await request(app)
      .put(`/owner/notification/${notificationId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: "Accepted" });

    expect(response.statusCode).toBe(200);
  });

  // Test for car owner rejecting a booking request
  test('Should successfully reject a booking request', async () => {
    const response = await request(app)
      .put(`/owner/notification/${notificationId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: "Rejected" });

    expect(response.statusCode).toBe(200);
  });

   // Test for car owner deleting a notification
   test('Should successfully delete a notification', async () => {
    const response = await request(app)
      .delete(`/owner/notification/${notificationId}`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.statusCode).toBe(200);
  });

});
