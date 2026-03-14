import { fetchTemperature } from "../service/weatherService.js";

export async function getLocation(req, res) {
    const { zipcode } = req.params;
    const scale = req.query.scale || "Fahrenheit";

    // Reject invalid input before making the API request.
    if (!Number.isFinite(+zipcode) || zipcode.length !== 5) {
        return res.status(400).json({
            error: "Invalid zipcode. Zipcode must be a registered 5 digit number.",
        });
    }
    if (scale !== "Fahrenheit" && scale !== "Celsius") {
        return res.status(400).json({
            error: "Invalid scale. Scale must be either 'Fahrenheit' or 'Celsius'.",
        });
    }

    // Attempt to fetch the temperature from the weather service. If the API request fails, 
    // print the error to console and return its status code and message to the client.
    try {
        const temperature = await fetchTemperature(zipcode, scale);
        return res.status(200).json({
            "temperature": temperature,
            "scale": scale
        });
    } catch (error) {
        console.error(`Error fetching weather data for zipcode ${zipcode}:`, error);

        return res.status(error.statusCode || 500).json({
            error: error.message || "Internal server error.",
        });
    }
}