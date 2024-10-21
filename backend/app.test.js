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

});
