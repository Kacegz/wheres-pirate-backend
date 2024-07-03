"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const index = require("./routes/index");
const Character = require("./models/Character");
const User = require("./models/User");
const request = require("supertest");
const express = require("express");
const session = require("express-session");
require("dotenv").config();
const initializeMongoServer = require("./mongoConfigTesting");
const mongoose = require("mongoose");
const store = new session.MemoryStore();
const app = express();
app.use(session({
    secret: process.env.secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 30 * 60 * 1000, //30 minutes
    },
    store,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
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
    test("GET /characters", () => __awaiter(this, void 0, void 0, function* () {
        const response = yield request(app)
            .get("/characters")
            .expect("Content-Type", /json/)
            .expect(200);
        expect(response.body).toEqual(["test1"]);
    }));
    test("POST /check valid data", () => __awaiter(this, void 0, void 0, function* () {
        const response = yield request(app)
            .post("/check")
            .type("form")
            .send({ name: "test1", x: 30, y: 30, found: false });
        expect(response.body).toBeTruthy();
    }));
    test("POST /check invalid data", () => __awaiter(this, void 0, void 0, function* () {
        const response = yield request(app)
            .post("/check")
            .type("form")
            .send({ name: "test1", x: 10, y: 50, found: false });
        expect(response.body).toEqual({ found: false });
    }));
    test("POST /checkwin valid data", () => __awaiter(this, void 0, void 0, function* () {
        const response = yield request(app)
            .post("/checkWin")
            .send([{ name: "test1", x: 30, y: 30, found: false }]);
        expect(response.body).toBeTruthy();
    }));
    test("POST /checkwin invalid data", () => __awaiter(this, void 0, void 0, function* () {
        const response = yield request(app).post("/checkWin").send([]);
        expect(response.body).toBeFalsy();
    }));
});
describe("User routes", function () {
    test("GET /start", () => __awaiter(this, void 0, void 0, function* () {
        const response = yield request(app)
            .get("/start")
            .expect("Content-Type", /json/)
            .expect(200);
        expect(response.body).toBeTruthy();
    }));
    test("GET /stop", () => __awaiter(this, void 0, void 0, function* () {
        const response = yield request(app)
            .get("/stop")
            .expect("Content-Type", /json/)
            .expect(200);
    }));
    test("POST /save", () => __awaiter(this, void 0, void 0, function* () {
        const response = yield request(app)
            .post("/save")
            .type("form")
            .send([{ username: "yeah" }])
            .expect(200);
        expect(response.body).toBeTruthy();
    }));
    test("POST /save too short", () => __awaiter(this, void 0, void 0, function* () {
        const response = yield request(app)
            .post("/save")
            .type("form")
            .send([{ username: "" }])
            .expect(200);
        expect(response.body).toEqual({ error: "Nickname must not be empty" });
    }));
    test("GET /top", () => __awaiter(this, void 0, void 0, function* () {
        const response = yield request(app)
            .get("/top")
            .expect("Content-Type", /json/)
            .expect(200);
        expect(response.body).toHaveLength(1);
    }));
});
