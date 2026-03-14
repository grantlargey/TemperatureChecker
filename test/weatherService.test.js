import "dotenv/config";
import assert from "node:assert/strict";
import * as chai from "chai";
import { fetchTemperature } from "../src/service/weatherService.js";

const { expect } = chai;

describe("fetchTemperature()", function () {
    const originalApiKey = process.env.OPENWEATHER_API_KEY;

    afterEach(function () {
        if (originalApiKey === undefined) {
            delete process.env.OPENWEATHER_API_KEY;
        } else {
            process.env.OPENWEATHER_API_KEY = originalApiKey;
        }
    });

    it("should throw an error for missing apiKey", async function () {
        delete process.env.OPENWEATHER_API_KEY;

        await assert.rejects(
            fetchTemperature("24060", "Fahrenheit"),
            { message: "API request failed with status 401" },
        );
    });

    it("should throw an error for invalid apiKey", async function () {
        process.env.OPENWEATHER_API_KEY = "bad-api-key";

        await assert.rejects(
            fetchTemperature("24060", "Fahrenheit"),
            { message: "API request failed with status 401" },
        );
    });

    it("should throw an error for zipcode not found", async function () {
        await assert.rejects(
            fetchTemperature("00000", "Fahrenheit"),
            { message: "API request failed with status 404" },
        );
    });

    it("should return temperature for valid apiKey and zipcode", async function () {
        const temperature = await fetchTemperature("24060", "Celsius");
        expect(temperature).to.be.a("number");
    });
});
