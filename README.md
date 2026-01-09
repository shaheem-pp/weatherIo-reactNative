# Weatherio - Beautiful Weather App 🌤️

A modern, beautifully designed weather application built with React Native and Expo that provides real-time weather information using OpenWeatherMap API.

## Features ✨

- **Real-time Location Access**: Automatically fetches your current location
- **City Search**: Search any city with smart dropdown suggestions of 20 popular cities worldwide
- **Current Weather**: Displays temperature, conditions, humidity, wind speed, pressure, and visibility
- **Beautiful UI/UX**: 
  - Dynamic gradients that change based on weather conditions
  - Glass-morphism cards with depth and shadows
  - Smooth entrance animations with spring physics
  - Staggered card animations for professional feel
- **Smooth Animations**: 
  - Pulsing and rotating loading screen
  - Fade-in effects on content
  - Shake animation on errors
  - Animated dropdown suggestions
- **Pull to Refresh**: Easy refresh functionality for both location and searched cities
- **Error Handling**: Graceful error messages with animated retry options
- **Secure API Key**: Environment variable configuration for API key security
- **Integer Wind Speed**: Clean whole number display in km/h (e.g., "19 km/h" not "18.7 km/h")

## Tech Stack 🛠️

- **React Native** with Expo
- **TypeScript** for type safety
- **Expo Location** for geolocation
- **Axios** for API calls       # Main weather display with animations
│   │   ├── SearchBar.tsx         # Search with dropdown suggestions
│   │   ├── LoadingScreen.tsx     # Animated loading state
│   │   ├── ErrorScreen.tsx       # Animated error handling
│   │   └── index.ts
│   ├── screens/           # Screen components
│   │   └── HomeScreen.tsx        # Main app screen
│   ├── services/          # API services
│   │   └── weatherService.ts     # OpenWeatherMap API calls
│   ├── hooks/             # Custom React hooks
│   │   ├── useLocation.ts        # Location access hook
│   │   ├── useWeather.ts         # Weather fetching hook
│   │   └── index.ts
│   ├── utils/             # Utility functions
│   │   ├── dateFormatter.ts      # Date/time formatting
│   │   ├── weatherUtils.ts       # Weather data formatting
│   │   └── index.ts
│   ├── theme/             # Theme configuration
│   │   ├── colors.ts             # Color palette & gradients
│   │   ├── typography.ts         # Font sizes & weights
│   │   ├── spacing.ts            # Spacing system
│   │   ├── borderRadius.ts       # Border radius values
│   │   └── index.ts
│   ├── types/             # TypeScript types
│   │   └── weather.ts            # Weather data interfaces
│   └── constants/         # App constants
│       ├── config.ts             # API configuration
│       └── cities.ts             # Popular cities lister.ts
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
├── .env                  # Environment variables (not in git)
├── .env.example          # Environment template
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
**Note:** New API keys may take 2-4 hours to activate after registration.

4. Start the development server:
```bash
npm start
```

5
3. Run on your platform:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app for physical device

## API Configuration 🔑

The app uses OpenWeatherMap's **free tier** Current Weather API:
- Endpoint: `https://api.openweathermap.org/data/2.5/weather`
- No credit card required
- 1,000 API calls per day limit

**Environment Variables:**
- API key is stored in `.env` file (not tracked by git)
- Configuration is loaded from `src/constants/config.ts`
- Use `.env.example` as a template for setting up

**Test API Connection:**
```bash
curl "https://api.openweathermap.org/data/2.5/weather?lat=40.7128&lon=-74.0060&appid=YOUR_API_KEY&units=metric&lang=en"
```

## Features in Detail 📱

### Current Weather Display
- Location name and country
- Current temperature with feels-like
- Weather condition with dynamic icon
- High/Low temperature display with visual indicators and labels
- "Feels like" temperature with thermometer icon
- Humidity percentage
- Wind speed (integer km/h) with cardinal direction (N, NE, E, etc.)
- Atmospheric pressure (hPa)
- Visibility distance (km)

### City Search Features
- **Native Modal Picker**: Full-screen bottom sheet dropdown (feels native on iOS & Android)
- **150+ Cities**: Comprehensive list from OpenWeatherMap CSV
- **Real-Time Search**: Instant filtering as you type
- **Smart Filtering**: Searches both city names and countries
- **Clear Button**: Easy return to current location weather
- **Native Animations**: Smooth slide-up modal with backdrop
- **Empty States**: Beautiful feedback when no cities match
- **Results Counter**: Shows number of matching cities
- **Touch Optimized**: Large, accessible touch targets

### Modern UI Design with Animations
- **Glass-morphism cards** with layered shadows and borders
- **Entrance Animations**: Cards fade in and slide up with spring physics
- **Staggered Loading**: Detail cards appear progressively (100-400ms delays)
- **Pulsing Loader**: Cloud icon pulses and rotates during loading
- **Shake on Error**: Error icon shakes to grab attention
- **Grid layout** for weather metrics
- **Dynamic gradients** that change with weather conditions
- **Text shadows** for perfect readability on gradients
- **Smooth transitions** throughout the app

### Dynamic Themes
The app dynamically changes its gradient background based on weather conditions:
- Clear sky: Vibrant blue gradient
- Cloudy: Soft gray gradient  
- Rainy: Deep blue gradient
- Thunderstorm: Dark dramatic gradient
- Snowy: Light icy blue gradient
- Misty: Silver-gray gradient

### Animation Details
- **WeatherCard**: Fade + slide + scale with spring physics (600ms)
- **DetailCards**: Staggered appearance for visual hierarchy
- **LoadingScreen**: 1-second pulse cycle + 4-second rotation
- **ErrorScreen**: 400ms shake sequence + 600ms fade-in
- **SearchBar**: 200ms fade for dropdown suggestions
- **All animations**: Use native driver for 60fps performance

## Code Quality 💎

- **TypeScript**: Full type safety throughout the app with const assertions
- **Modular Architecture**: Clean separation of concerns
- **Custom Hooks**: Reusable logic for location and weather
- **Commented Code**: Comprehensive JSDoc comments
- **Consistent Styling**: Centralized theme system with colors, typography, spacing
- **Error Handling**: Robust error management with user-friendly messages
- **Performance**: Native driver animations, efficient re-renders
- **Secure Configuration**: Environment variables for sensitive data
- **Popular Cities**: Curated list of 20 major cities for quick access

## Contributing 🤝

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
