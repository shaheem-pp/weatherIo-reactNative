# Weatherio

Weatherio is a React Native (Expo) weather app that shows current conditions, an 8‑hour forecast, and a 5‑day forecast using the OpenWeatherMap API. It supports GPS weather by default and a city search modal for browsing weather anywhere.

- Platform: Expo (iOS / Android / Web)
- Language: TypeScript
- API: OpenWeatherMap (Current Weather + 5‑day / 3‑hour forecast + Geocoding)

## Sections

- Overview
- Quickstart
- Configuration
- City search
- Architecture
- Docs

<details open>
<summary><strong>Overview</strong></summary>

### Features

- Current weather: temperature, feels like, min/max, condition and icon
- Hourly forecast: next 8 slots (3‑hourly data)
- Daily forecast: grouped to 5 days, with precipitation probability when relevant
- Details grid: humidity, pressure, wind (rounded km/h + direction), visibility, cloudiness
- Dynamic UI: weather-based gradients and glassmorphism cards
- Pull to refresh
- Loading + error states with retry

</details>

<details>
<summary><strong>Quickstart</strong></summary>

### Prerequisites

- Node.js (recommended: 18+)
- npm
- Expo Go app (device) or iOS Simulator / Android Emulator

### Setup

1) Install dependencies:

```bash
npm install
```

2) Configure env vars:

```bash
cp .env.example .env
```

Set your key in `.env`:

```
EXPO_PUBLIC_WEATHER_API_KEY=your_openweathermap_key
```

3) Run:

```bash
npm start
```

### Useful scripts

- `npm run ios`
- `npm run android`
- `npm run web`

</details>

<details>
<summary><strong>Configuration</strong></summary>

### Environment variables

- `EXPO_PUBLIC_WEATHER_API_KEY`: required (used for weather + geocoding)

### API configuration

See `src/constants/config.ts` for:

- base URLs and endpoints
- `units` (metric/imperial)
- `lang`
- forecast item count

</details>

<details>
<summary><strong>City search</strong></summary>

- Open the modal from the top-right search icon on the home screen.
- Type at least 2 characters to search.
- Results come from a bundled world cities dataset (ranked), with an OpenWeatherMap geocoding fallback when no local matches are found.
- Tap the left icon (navigation) to return to your GPS location after selecting a city.

</details>

<details>
<summary><strong>Architecture</strong></summary>

### High-level layout

```
src/
  components/   UI building blocks (cards, forecasts, modal)
  screens/      Home screen composition
  hooks/        useLocation + useWeather
  services/     OpenWeatherMap API client
  theme/        colors/typography/spacing tokens
  utils/        formatting + forecast grouping
  types/        API response types
```

### Data flow

- `useLocation` gets GPS coordinates.
- `useWeather` fetches current weather + forecast in parallel via `src/services/weatherService.ts`.
- Forecast is transformed via `getHourlyForecast` and `groupForecastByDay` in `src/utils/weatherUtils.ts`.

</details>

<details>
<summary><strong>Docs</strong></summary>

- `QUICKSTART.md` (setup and troubleshooting)
- `CITY_SEARCH_GUIDE.md` (city search behavior and UX)
- `COMPONENT_DOCS.md` (component APIs)
- `COMPONENT_TREE.md` (component tree and data flow diagrams)
- `DESIGN_SUMMARY.md` (design decisions and system)
- `PROJECT_SUMMARY.md` (project overview)

</details>

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

**Remember:** Never commit your `.env` file with real API keys!
- **Modular Architecture**: Clean separation of concerns
- **Custom Hooks**: Reusable logic for location and weather
- **Commented Code**: Comprehensive JSDoc comments
- **Consistent Styling**: Centralized theme system
- **Error Handling**: Robust error management

## License

MIT

## Author

Built with ❤️ using React Native and Expo
