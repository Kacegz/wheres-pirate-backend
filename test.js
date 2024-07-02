const index = require("./routes/index");
const Character = require("./models/Character");
const User = require("./models/User");
const request = require("supertest");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const session = require("express-session");
require("dotenv").config();

const initializeMongoServer = require("./mongoConfigTesting");
const mongoose = require("mongoose");
const store = new session.MemoryStore();
const app = express();
app.use(
  session({
    secret: process.env.secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 60 * 1000, //30 minutes
    },
    store,
  })
);
app.use(cors({ origin: process.env.cors, credentials: true }));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", index);
beforeAll((done) => {
  initializeMongoServer();
  new Character({ name: "test1", x: 30, y: 30, found: false }).save();
  new User({ nickname: "testUser", time: 30 }).save();
  done();
});
afterAll((done) => {
  mongoose.disconnect();
  done();
});
describe("Characters routes", function () {
  test("GET /characters", async () => {
    const response = await request(app)
      .get("/characters")
      .expect("Content-Type", /json/)
      .expect(200);
    expect(response.body).toEqual(["test1"]);
  });
  test("POST /check valid data", async () => {
    const response = await request(app)
      .post("/check")
      .type("form")
      .send({ name: "test1", x: 30, y: 30, found: false });
    expect(response.body).toBeTruthy();
  });
  test("POST /check invalid data", async () => {
    const response = await request(app)
      .post("/check")
      .type("form")
      .send({ name: "test1", x: 10, y: 50, found: false });
    expect(response.body).toEqual({ found: false });
  });
  test("POST /checkwin valid data", async () => {
    const response = await request(app)
      .post("/checkWin")
      .send([{ name: "test1", x: 30, y: 30, found: false }]);
    expect(response.body).toBeTruthy();
  });
  test("POST /checkwin invalid data", async () => {
    const response = await request(app).post("/checkWin").send([]);
    expect(response.body).toBeFalsy();
  });
});
describe("User routes", function () {
  test("GET /start", async () => {
    const response = await request(app)
      .get("/start")
      .expect("Content-Type", /json/)
      .expect(200);
    expect(response.body).toBeTruthy();
  });
  test("GET /stop", async () => {
    const response = await request(app)
      .get("/stop")
      .expect("Content-Type", /json/)
      .expect(200);
  });
  test("POST /save", async () => {
    const response = await request(app)
      .post("/save")
      .type("form")
      .send([{ username: "yeah" }])
      .expect(200);
    expect(response.body).toBeTruthy();
  });
  test("POST /save too short", async () => {
    const response = await request(app)
      .post("/save")
      .type("form")
      .send([{ username: "" }])
      .expect(200);
    expect(response.body).toEqual({ error: "Nickname must not be empty" });
  });
  test("GET /top", async () => {
    const response = await request(app)
      .get("/top")
      .expect("Content-Type", /json/)
      .expect(200);
    expect(response.body).toHaveLength(1);
  });
});
