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

});
