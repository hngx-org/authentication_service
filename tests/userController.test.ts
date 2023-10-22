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

describe("User API Endpoints", () => {
  it("should return bad requets error on signup user", async () => {
    const newUser = {
      firstName: "Johb",
      lastName: "Doe",
      email: "",
      password: "123",
    };
    const response = await request(app).post("/api/auth/signup").send(newUser);
    expect(response.status).toBe(422);
    expect(response.body.message).toEqual("email is not allowed to be empty");
  });

  it("should create a new user", async () => {
    const newUser = {
      firstName: "John",
      lastName: "Doe",
      email: "johndoe@example.com",
      password: "password123",
    };
    const response = await request(app).post("/api/auth/signup").send(newUser);
    expect(response.status).toBe(200);
    expect(response.body.message).toEqual(
      "User created successfully. Please check your email to verify your account"
    );
    expect(response.body).toHaveProperty("user");
    expect(response.body.user).toBeInstanceOf(Object);
  });

  it("should send forgot password email", async () => {
    const newUser = {
      email: "johndoe@example.com",
    };
    const response = await request(app)
      .post("/api/auth/forgot-password")
      .send(newUser);
    expect(response.status).toBe(403);
    expect(response.body.message).toEqual("Account not verified not found");
    expect(response.body).toHaveProperty("statusCode");
    expect(response.body).toHaveProperty("status");
  });

  it("should login  a user", async () => {
    const newUser = {
      email: "johndoe@example.com",
      password: "password123",
    };
    const response = await request(app).post("/api/auth/login").send(newUser);
    expect(response.status).toBe(401);
    expect(response.body.message).toEqual("Email not verified");
    expect(response.body).toHaveProperty("statusCode");
    expect(response.body).toHaveProperty("status");
  });

  it("should change user email", async () => {
    const response = await request(app).patch(
      "/api/auth/change-email/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImdhaXlhb2JlZDk0QGdtYWlsLmNvbSIsImlkIjoiNGMzZTJiYTgtMThlMi00YmIzLTk0ZWQtOTBlNjUwOTkxZDhhIiwiaWF0IjoxNjk3NTQ3OTA1LCJleHAiOjE2OTc1NTE1MDV9.Wsh0-ZzRWt6V7jN91D7Qloy5wlqU2GSCbbfxac53OLY"
    );
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("statusCode");
    expect(response.body).toHaveProperty("status");
  });

  it("should change email", async () => {
    const newUser = {
      email: "johndoe@example.com",
    };
    const response = await request(app)
      .post("/api/auth/change-email")
      .send(newUser);
    expect(response.status).toBe(404);
    expect(response.body.status).toEqual("error");
  });

  it("should init change email process", async () => {
    const newUser = {
      email: "johndoe@example.com",
    };
    const response = await request(app)
      .post("/api/auth/check-email")
      .send(newUser);
    expect(response.status).toBe(409);
    expect(response.body.message).toEqual("Email already in use");
    expect(response.body.status).toEqual("error");
  });

  it("should resend email notification", async () => {
    const newUser = {
      email: "johndoe@example.com",
    };
    const response = await request(app)
      .post("/api/auth/verify/resend")
      .send(newUser);
    expect(response.status).toBe(200);
    expect(response.body.message).toEqual(
      "Email verification code resent successfully"
    );
  });

  // it("should resend email", async () => {
  //   const response = await request(app).patch("/api/auth/verify/resend");
  //   expect(response.status).toBe(404);
  // });

  it("should change password", async () => {
    const newUser = {
      currentPassword: "pass124",
      newPassword: "pass124",
    };
    const response = await request(app)
      .put("/api/auth/change-password")
      .set("authentication", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX")
      .send(newUser);
    expect(response.status).toBe(401);
    expect(response.body.message).toEqual("You must be logged in");
  });

  it("should send reset password link", async () => {
    const newUser = {
      newPassword: "pass124",
    };
    const response = await request(app)
      .put("/api/auth/reset-password/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX")
      .send(newUser);
    expect(response.status).toBe(422);
    expect(response.body.message).toEqual("token is required");
    expect(response.body.status).toEqual("error");
  });

  it("should verfy 2FA", async () => {
    const newUser = {
      code: "2355",
    };
    const response = await request(app)
      .put("/api/auth/2fa/verify-code")
      .send(newUser);
    expect(response.status).toBe(404);
  });

  it("should enable 2FA", async () => {
    const newUser = {
      code: "2355",
    };
    const response = await request(app)
      .post("/api/auth/2fa/enable")
      .set("authentication", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX")
      .send(newUser);
    expect(response.status).toBe(401);
    expect(response.body.message).toEqual("You must be logged in");
  });

  it("should nsend able 2FA", async () => {
    const response = await request(app)
      .post("/api/auth/2fa/send-code")
      .set("authentication", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX");
    expect(response.status).toBe(401);
  });

  it("should fetch all users", async () => {
    const response = await request(app).get("/api/auth/users");
    expect(response.status).toBe(200);
    expect(response.body.message).toEqual("Fetched successfully");
    expect(response.body.data).toBeInstanceOf(Object);
  });

  it("should fetch user by id", async () => {
    const response = await request(app).get(
      "/api/auth/users/0ec4945-895a-45ae-b040-dde5b5ce9240"
    );
    expect(response.status).toBe(500);
    // expect(response.body.message).toEqual("Fetched successfully");
  });

  it("should delete user by id", async () => {
    const response = await request(app).delete(
      "/api/auth/users/0ec4945-895a-45ae-b040-dde5b5ce9240"
    );
    expect(response.status).toBe(500);
  });

  // it("should fetch all roles", async () => {
  //   const response = await request(app).get("/api/auth/roles/roles");
  //   expect(response.status).toBe(404);
  // });

  // Add more test cases as needed
});
