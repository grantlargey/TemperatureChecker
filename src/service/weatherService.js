export async function fetchTemperature(zipcode, scale) {
    const apiKey = process.env.OPENWEATHER_API_KEY;

    //  OpenWeather expects imperial/metric for its units parameter so this operator
    //  determines and sets the units parameter before making the API request.
    const units = scale === "Fahrenheit" ? "imperial" : "metric";

    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?zip=${zipcode}&units=${units}&appid=${apiKey}`,
    );

    if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
    }

    // OpenWeather returns a "main" object that stores the temperature as "temp". 
    const weatherData = await response.json();
    return weatherData.main.temp;
}