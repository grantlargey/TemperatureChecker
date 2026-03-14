import "dotenv/config";
import app from "./app.js";

const PORT = 8080;

// If an OpenWeather API key is not set as an environment variable, the server 
// will start but weather requests will fail until the key is configured.
if (!process.env.OPENWEATHER_API_KEY) {
    console.warn("OPENWEATHER_API_KEY is not set. Weather requests will fail until it is configured.");
}

app.listen(PORT, () => {
    console.log(`Server has started on: ${PORT}`);
});