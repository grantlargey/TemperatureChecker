# TemperatureChecker

## About
TemperatureChecker is a small Express API that returns the current temperature for a given U.S. ZIP code in either Fahrenheit or Celsius.

Endpoint:

```text
GET /locations/{zip-code}
```

Optional query parameter:

```text
?scale=Fahrenheit
?scale=Celsius
```

If `scale` is omitted, the API defaults to `Fahrenheit`.

## Repository Structure

| Path | Role |
| --- | --- |
| `src/app.js` | Creates the Express app and registers routes. |
| `src/server.js` | Loads environment variables and starts the server on port `8080`. |
| `src/controller/locationController.js` | Validates requests and formats API responses. |
| `src/service/weatherService.js` | Calls the OpenWeather API and returns the current temperature. |
| `test/locationController.test.js` | Tests the HTTP endpoint behavior. |
| `test/weatherService.test.js` | Tests the weather service behavior. |
| `.env.example` | Shows the required environment variable. |

### Configuration

In order for the applications and tests to run, an `OPENWEATHER_API_KEY` environment variable must be provided. The expected configuration is documented in `.env.example`, and the actual `.env` file is excluded from source control.

### API Key Setup

To generate an OpenWeather API key:

1. Create a free account at [OpenWeather](https://home.openweathermap.org/users/sign_up).
2. Verify your email address.
3. Sign in and copy your key from the [API keys page](https://home.openweathermap.org/api_keys).
4. Add it to your `.env` file:

```text
OPENWEATHER_API_KEY=your_api_key_here
```

## Run Locally

Dependencies:

- Node.js 18+
- npm
- A valid OpenWeather API key

Setup:

```bash
npm install
```

Create a `.env` file using `.env.example`, then add your API key:

```text
OPENWEATHER_API_KEY=your_api_key_here
```

Start the server:

```bash
npm start
```

After `npm install` and `npm start`, the API is available at `http://localhost:8080`.

Example requests:

```text
http://localhost:8080/locations/24060
http://localhost:8080/locations/24060?scale=Celsius
```

## Run Tests

Dependencies:

- Node.js 18+
- npm
- A valid `OPENWEATHER_API_KEY`
- Internet access
- Port `8080` available

Run the test suite with:

```bash
npm test
```

This test suite is integration-oriented. It starts the local Express app and makes real requests to OpenWeather. Results depend on local environment setup and network availability. 

## Error Responses

The API returns JSON errors for invalid input or upstream failures.

Possible cases include:
- `400 Bad Request` for an invalid ZIP code or invalid `scale`
- `500 Internal Server Error` if the weather provider cannot be reached or returns an unexpected response

## Design Strategy

The project uses a modular structure so each responsibility stays isolated and easy to follow. `app.js` handles route registration, the controller handles request validation and HTTP responses, and the weather service owns the external API call and unit selection logic. Input is validated before making an external request, so invalid ZIP codes and invalid scales fail fast. Incorrect zipcodes with proper 5-digit numeric formats are sent to the API, but they fail because the API returns a 404 status for non-existent zipcodes. 

### Weather Provider Choice

I chose openweathermap.org because it provided a convenient endpoint for getting the temperature using only the zipcode, and also because the service is free and easy to acquire an API key for. 

### References and AI Use

Referenced:

- `docs.npmjs.com`
- `git-scm.com`
- `mochajs.org`
- `chaijs.com`
- `nodejs.org`

API:

- `openweathermap.org`

AI:

- VS Code Copilot was used for explanations and occasional autocomplete assistance.
- Codex was used for debugging feedback and README drafting.

## Appendix: Codex Interaction Log

Included below for full transparency regarding AI-assisted debugging and documentation support. I also used Codex to review the final file structure and assist me in the generation of this README; however, I provided the prompt below: see '### 5. README Creation'. All final code and documentation were reviewed and edited manually before submission.

### 1. Route Debugging

Prompt:

```text
Why am I getting a 404 error for this on google?
http://localhost:8080/23323
```

Response Summary:

- Identified that the server route is `GET /locations/:zipcode`, so the correct URL is `http://localhost:8080/locations/23323`.
- Clarified that `localhost:8080` must be opened directly in the browser address bar while the local server is running, not searched through Google.
- Noted a separate bug in the weather parsing logic that would affect the response after the route issue was fixed.

### 2. Weather Fetch Response Structure

Prompts:

```text
Explain what you mean about the weather fetch function accessing temperature.temp incorrectly
```

```text
How do I determine the exact json format that is being returned? can I add console.log(weatherData)?
```

Logged response excerpt reviewed during debugging:

```text
{
  coord: { lon: -76.3397, lat: 36.7634 },
  weather: [ { id: 800, main: 'Clear', description: 'clear sky', icon: '01n' } ],
  base: 'stations',
  main: {
    temp: 285.64,
    feels_like: 284.77,
    temp_min: 284.81,
    temp_max: 286.49,
    pressure: 1014,
    humidity: 70,
    sea_level: 1014,
    grnd_level: 1015
  },
  visibility: 10000,
  wind: { speed: 11.83, deg: 210, gust: 15.43 },
  clouds: { all: 0 },
  dt: 1773454685,
  sys: {
    type: 2,
    id: 2001381,
    country: 'US',
    sunrise: 1773400761,
    sunset: 1773443428
  },
  timezone: -14400,
  id: 0,
  name: 'Chesapeake',
  cod: 200
}
```

Response Summary:

- Explained that the OpenWeather response stores the temperature at `main.temp`, not `temp` at the top level.
- Recommended logging `weatherData` or `JSON.stringify(weatherData, null, 2)` during development to inspect the returned JSON shape.
- Confirmed the correct property access after reviewing the logged API response.

### 3. Test Script Validation

Prompt:

```text
Does this work? "test": "mocha test/locationController.test.js test/weatherService.test.js"?
```

Response Summary:

- Confirmed that the script is valid and that Mocha accepts multiple explicit test file paths.
- Noted that the command is easy to understand but would need manual updates if additional test files are added later.

### 4. Test Portability

Prompt:

```text
Will my tests work on the recruiter's computers provided they follow the instructions of providing a valid apiKey and ensuring they have internet connection and access to port 8080?
```

Response Summary:

- Explained that the tests are likely to work when the machine uses Node.js 18+, has a valid `OPENWEATHER_API_KEY`, has internet access, and has port `8080` free.
- Noted that the suite is not completely reviewer-proof because it depends on a live external API and a fixed local port.

### 5. README Creation

Prompt:

```text
Make me a README that is minimal and professional:
-Overview: About
An API application that returns the current temperature for a given ZIP code in either Fahrenheit or Celsius.

- Repo structure / file roles

- How to run && dependencies

- How to run tests && dependencies

- Justification for design strategy

- The following outside sources: Referenced: docs.npmjs.com, git-scm.com, mochajs.org, chaijs.com, nodejs.com API: openweathermap.org AI: VSCode copilot extension enabled: used for explanations, as well as its autofill code at times, Codex: Used for feedback, debugging, and the generation of a README. Also include the following log of my specific chats with Codex:

See Appendix 1-4
```

Response Summary:

```text
First README draft prior to my edits
```
