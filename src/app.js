import express from "express";
import { getLocation } from "./controller/locationController.js";

const app = express();

app.get("/locations/:zipcode", getLocation);

export default app;