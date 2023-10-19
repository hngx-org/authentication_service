// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import app from "../index";
import sequelize from "../config/db.config";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const request = require("supertest");

beforeAll(async () => {
  try {
    await sequelize.sync({ force: true });
  } catch (error) {
    console.error("Database sync error:", error);
  }
});

afterAll(async () => {
  try {
    // Close the database connection
    await sequelize.close();
    console.log("Database connection closed successfully.");
  } catch (error) {
    console.error("Teardown error:", error);
  }
});

it("should fetch all roles", async () => {
  const response = await request(app).get("/api/roles");
  expect(response.status).toBe(200);
  expect(response.body.message).toEqual("Fetched successfully");
  expect(response.body.data).toBeInstanceOf(Object);
});

it("should fetch all permissions", async () => {
  const response = await request(app).get("/api/roles/permissions");
  expect(response.status).toBe(200);
  expect(response.body.message).toEqual("Fetched successfully");
  expect(response.body.data).toBeInstanceOf(Object);
});

