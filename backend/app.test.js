import request from "supertest";
import app from "./index.js";
import mongoose from 'mongoose';
import { mongodbURL } from './config.js';

describe('Backend Integration and Database Connection Tests', () => {
  
  // Establish a connection to MongoDB before running the tests
  beforeAll(async () => {
    await mongoose.connect(mongodbURL, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  // Close the connection after all tests are done
  afterAll(async () => {
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
    expect(response.body.owner.email).toBe("johndoe@example.com");
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
    const bookingRequest = {
      carId: "674df0d60fbd550782624fdb", 
      userId: "674deff10fbd550782624fd5" 
    };

    const response = await request(app)
      .post("/owner/requestBooking")
      .send(bookingRequest);
    
      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("Booking request sent.");
      expect(response.body).toHaveProperty("ownerDetails");
      expect(response.body.ownerDetails).toHaveProperty("name");
      expect(response.body.ownerDetails).toHaveProperty("email");
      expect(response.body.ownerDetails).toHaveProperty("phone");
  });

  // Test for car owner receiving a notification
  test('Should successfully retrieve car owner notifications', async () => {
    const response = await request(app)
      .get("/owner/notifications/674deff10fbd550782624fd5") 
      .send();
    
    expect(response.statusCode).toBe(200);
    expect(response.body[0]).toHaveProperty("car");
    expect(response.body[0].car.brand).toBe("Volvo");
  });

  // Test for car owner accepting a booking request
  test('Should successfully accept a booking request', async () => {
    const response = await request(app)
      .put("/owner/notification/674dffa32610ca3a7ff77247") 
      .send({ status: "Accepted" });
    
    expect(response.statusCode).toBe(200);
  });

  // Test for car owner rejecting a booking request
  test('Should successfully reject a booking request', async () => {
    const response = await request(app)
      .put("/owner/notification/674dffa32610ca3a7ff77247") 
      .send({ status: "Rejected" });
    
    expect(response.statusCode).toBe(200);
  });

   // Test for car owner deleting a notification
   test('Should successfully delete a notification', async () => {
    const response = await request(app)
      .delete("/owner/notification/674dffa32610ca3a7ff77247") 
      .send();
    
    expect(response.statusCode).toBe(200);
  });

});
