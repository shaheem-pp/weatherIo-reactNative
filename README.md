# Weatherio - Beautiful Weather App 🌤️

A modern, beautifully designed weather application built with React Native and Expo that provides current weather and 16-day forecast using OpenWeatherMap API.

## Features ✨

- **Real-time Location Access**: Automatically fetches your current location
- **Current Weather**: Displays temperature, conditions, humidity, wind speed, and more
- **5-Day Forecast**: Extended weather forecast with detailed information
- **Beautiful UI**: Dynamic gradients that change based on weather conditions
- **Smooth Animations**: Elegant loading states and transitions
- **Pull to Refresh**: Easy refresh functionality
- **Error Handling**: Graceful error messages with retry options

## Tech Stack 🛠️

- **React Native** with Expo
- **TypeScript** for type safety
- **Expo Location** for geolocation
- **Axios** for API calls
- **Expo Linear Gradient** for beautiful gradients
- **@expo/vector-icons** for icons

## Project Structure 📁

```
weatherio/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── WeatherCard.tsx
│   │   ├── ForecastCard.tsx
│   │   ├── LoadingScreen.tsx
│   │   ├── ErrorScreen.tsx
│   │   └── index.ts
│   ├── screens/           # Screen components
│   │   └── HomeScreen.tsx
│   ├── services/          # API services
│   │   └── weatherService.ts
│   ├── hooks/             # Custom React hooks
│   │   ├── useLocation.ts
│   │   ├── useWeather.ts
│   │   └── index.ts
│   ├── utils/             # Utility functions
│   │   ├── dateFormatter.ts
│   │   ├── weatherUtils.ts
│   │   └── index.ts
│   ├── theme/             # Theme configuration
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   ├── spacing.ts
│   │   └── index.ts
│   ├── types/             # TypeScript type definitions
│   │   └── weather.ts
│   └── constants/         # App constants
│       └── config.ts
├── App.tsx               # App entry point
├── app.json              # Expo configuration
└── package.json          # Dependencies
```

## Getting Started 🚀

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS) or Android Emulator (for Android)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

3. Add your OpenWeatherMap API key to `.env`:
```
EXPO_PUBLIC_WEATHER_API_KEY=your_actual_api_key_here
```
Get your free API key from [OpenWeatherMap](https://openweathermap.org/api)

4. Start the development server:
```bash
npm start
```

3. Run on your platform:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app for physical device

## API Configuration 🔑

The app uses OpenWeatherMap API with the following endpoints:
- Current Weather: `https://api.openweathermap.org/data/2.5/weather`
- 5-Day Forecast: `https://api.openweathermap.org/data/2.5/forecast`

API Key is configured in `src/constants/config.ts`

## Features in Detail 📱

### Current Weather Display
- Location name and country
- Current temperature with feels-like
- Weather condition with icon
- Min/Max temperature
- Humidity percentage
- Wind speed and direction
- Atmospheric pressure

### 5-Day Forecast
- Daily high and low temperatures
- Weather conditions
- Precipitation probability
- Scrollable horizontal list

### Dynamic Themes
The app dynamically changes its gradient background based on weather conditions:
- Clear sky: Blue gradient
- Cloudy: Gray gradient
- Rainy: Dark blue gradient
- Thunderstorm: Dark gradient
- Snowy: Light blue gradient
- Misty: Silver gradient

## Code Quality 💎

- **TypeScript**: Full type safety throughout the app
- **Modular Architecture**: Clean separation of concerns
- **Custom Hooks**: Reusable logic for location and weather
- **Commented Code**: Comprehensive JSDoc comments
- **Consistent Styling**: Centralized theme system
- **Error Handling**: Robust error management

## License

MIT

## Author

Built with ❤️ using React Native and Expo
