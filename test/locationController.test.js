import "dotenv/config";
import * as chai from "chai";
import chaiHttp, { request } from "chai-http";
import app from '../src/app.js';

const chaiWithHttp = chai.use(chaiHttp);
const { expect } = chaiWithHttp;

describe("getLocation()", function () {
    let server;

    before(function () {
        server = app.listen(8080);
    });

    after(function () {
        server.close();
    });

    it("should return 400 for invalid zipcode digits", async function () {
        const res = await chaiWithHttp.request.execute(server).keepOpen().get("/locations/abcde");
        expect(res).to.have.status(400);
        expect(res.body).to.have.property("error");
    });

    it("should return 400 for invalid zipcode length", async function () {
        const res = await request.execute(`http://localhost:8080`).get("/locations/240601");
        expect(res).to.have.status(400);
        expect(res.body).to.have.property("error");
    });

    it("should return 404 for zipcode DNE", async function () {
        const res = await request.execute(`http://localhost:8080`).get("/locations/00000");
        expect(res).to.have.status(404);
        expect(res.body).to.have.property("error");
    });

    it("should return 400 for invalid scale", async function () {
        const res = await request.execute(`http://localhost:8080`).get("/locations/24060?scale=chyuh");
        expect(res).to.have.status(400);
        expect(res.body).to.have.property("error");
    });

    it("should return 200 and correct json response for valid zipcode", async function () {
        const res = await request.execute(`http://localhost:8080`).get("/locations/24060");
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("temperature").that.is.a("number");
        expect(res.body.scale).to.equal("Fahrenheit");
    });

    it("should return 200 and correct json response for valid zipcode and scale=Fahrenheit", async function () {
        const res = await request.execute(`http://localhost:8080`).get("/locations/24060?scale=Fahrenheit");
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("temperature").that.is.a("number");
        expect(res.body.scale).to.equal("Fahrenheit");
    });

    it("should return 200 and correct json response for valid zipcode and scale=Celsius", async function () {
        const res = await request.execute(`http://localhost:8080`).get("/locations/24060?scale=Celsius");
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("temperature").that.is.a("number");
        expect(res.body.scale).to.equal("Celsius");
    });

});
