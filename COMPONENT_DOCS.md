# Component Structure & API Documentation

## 📦 Components Overview

### Core Components

#### 1. **LoadingScreen**
```typescript
interface LoadingScreenProps {
  message?: string;
}
```
- Displays animated loading state with gradient background
- Customizable message
- Used during app initialization and data fetching

#### 2. **ErrorScreen**
```typescript
interface ErrorScreenProps {
  message: string;
  onRetry?: () => void;
}
```
- User-friendly error display
- Retry button with callback
- Maintains visual consistency with gradient background

#### 3. **GlassCard**
```typescript
interface GlassCardProps {
  children: React.ReactNode;
  intensity?: number;
  style?: ViewStyle;
  tint?: 'light' | 'dark' | 'default';
}
```
- Reusable glassmorphism container
- Configurable blur intensity
- Custom styling support
- Used throughout the app for card elements

#### 4. **WeatherIcon**
```typescript
interface WeatherIconProps {
  iconCode: string;
  size?: number;
  style?: any;
}
```
- Displays weather condition icons from OpenWeatherMap
- Configurable size
- Automatically fetches appropriate resolution

#### 5. **CurrentWeatherCard**
```typescript
interface CurrentWeatherCardProps {
  weather: CurrentWeather;
  textColor?: string;
}
```
- Primary weather display
- Shows:
  - Location name
  - Large temperature
  - Weather icon
  - Weather description
  - Feels like temperature
  - High/low temperatures

#### 6. **HourlyForecast**
```typescript
interface HourlyForecastProps {
  forecast: ForecastItem[];
  textColor?: string;
}
```
- Horizontal scrollable forecast
- Displays next 8 hours
- Shows:
  - Time ("Now" for current hour)
  - Weather icon
  - Temperature
  - Precipitation probability (if >20%)

#### 7. **DailyForecast**
```typescript
interface DailyForecastProps {
  forecast: ForecastDay[];
  textColor?: string;
}
```
- 5-day forecast display
- Shows:
  - Day name ("Today" for current day)
  - Weather icon
  - Precipitation probability
  - Min/max temperatures

#### 8. **WeatherDetails**
```typescript
interface WeatherDetailsProps {
  weather: CurrentWeather;
  textColor?: string;
}
```
- Grid layout of weather metrics
- Displays:
  - Humidity (%)
  - Pressure (hPa)
  - Wind (speed + direction)
  - Visibility (km)
  - Cloudiness (%)
  - Feels like temperature

---

## 🎣 Custom Hooks

### 1. **useLocation**
```typescript
const useLocation: () => {
  coordinates: Coordinates | null;
  loading: boolean;
  error: string | null;
}
```
- Requests and manages device location
- Handles permissions
- Returns coordinates, loading, and error states

### 2. **useWeather**
```typescript
const useWeather: (coordinates: Coordinates | null) => {
  currentWeather: CurrentWeather | null;
  forecast: ForecastResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}
```
- Fetches weather data for given coordinates
- Manages loading and error states
- Provides refetch function for manual refresh
- Automatically refetches when coordinates change

---

## 🌐 API Services

### weatherService.ts

#### getCurrentWeather
```typescript
const getCurrentWeather: (coordinates: Coordinates) => Promise<CurrentWeather>
```
- Fetches current weather for coordinates
- Uses OpenWeatherMap Current Weather API

#### getCurrentWeatherByCity
```typescript
const getCurrentWeatherByCity: (cityName: string) => Promise<CurrentWeather>
```
- Fetches current weather by city name
- Handles city not found errors

#### getForecast
```typescript
const getForecast: (coordinates: Coordinates) => Promise<ForecastResponse>
```
- Fetches 5-day/3-hour forecast
- Returns 40 forecast items (5 days × 8 per day)

#### getWeatherData
```typescript
const getWeatherData: (coordinates: Coordinates) => Promise<{
  currentWeather: CurrentWeather;
  forecast: ForecastResponse;
}>
```
- Fetches both current weather and forecast in parallel
- Optimized with Promise.all

---

## 🛠️ Utility Functions

### weatherUtils.ts

```typescript
// Icon URL generation
getWeatherIconUrl(iconCode: string, size?: '2x' | '4x'): string

// Time calculations
isNightTime(currentTime: number, sunrise: number, sunset: number): boolean

// Forecast processing
groupForecastByDay(forecastList: ForecastItem[]): ForecastDay[]
getHourlyForecast(forecastList: ForecastItem[], count?: number): ForecastItem[]

// Wind calculations
getWindDirection(degrees: number): string
msToKmh(ms: number): number
msToMph(ms: number): number

// Formatting
formatVisibility(meters: number): string
formatWeatherDescription(description: string): string
getFeelsLikeDescription(actual: number, feelsLike: number): string
```

### dateFormatter.ts

```typescript
formatTime(timestamp: number): string              // "3:45 PM"
formatDate(timestamp: number): string              // "Mon, Jan 8"
formatDayOfWeek(timestamp: number): string         // "Mon"
formatDateTime(timestamp: number): string          // "Mon, Jan 8, 3:45 PM"
getRelativeTime(timestamp: number): string         // "2 hours ago"
```

---

## 🎨 Theme System

### colors.ts

```typescript
// Weather themes with gradients
colors.clearDay
colors.clearNight
colors.cloudy
colors.rainy
colors.stormy
colors.snowy

// Helper functions
getWeatherTheme(weatherMain: string, isNight: boolean)
getTemperatureColor(temp: number)
```

### typography.ts

```typescript
// Font families
typography.fonts.regular
typography.fonts.medium
typography.fonts.semiBold
typography.fonts.bold

// Predefined text styles
textStyles.display
textStyles.h1 - textStyles.h6
textStyles.body
textStyles.caption
textStyles.label
textStyles.button
```

### spacing.ts

```typescript
// Spacing scale
spacing.xs to spacing['7xl']

// Border radius
borderRadius.sm to borderRadius.full

// Shadows
shadows.sm to shadows.xl
```

---

## 📊 Type Definitions

### CurrentWeather
```typescript
interface CurrentWeather {
  coord: { lon: number; lat: number };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  clouds: { all: number };
  dt: number;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  name: string;
}
```

### ForecastItem
```typescript
interface ForecastItem {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  clouds: { all: number };
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  visibility: number;
  pop: number;  // Probability of precipitation
  dt_txt: string;
}
```

### ForecastDay
```typescript
interface ForecastDay {
  date: string;
  dt: number;
  temp_min: number;
  temp_max: number;
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  pop: number;
}
```

---

## 🎯 Usage Examples

### Basic Weather Display
```typescript
import { useLocation, useWeather } from './src/hooks';
import { CurrentWeatherCard } from './src/components';

const MyWeatherScreen = () => {
  const { coordinates } = useLocation();
  const { currentWeather, loading, error } = useWeather(coordinates);

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen message={error} />;
  if (!currentWeather) return null;

  return <CurrentWeatherCard weather={currentWeather} />;
};
```

### Custom Themed Card
```typescript
import { GlassCard } from './src/components';
import { getWeatherTheme } from './src/theme';

const MyCard = ({ weather }) => {
  const theme = getWeatherTheme(weather.weather[0].main, false);
  
  return (
    <GlassCard intensity={30}>
      <Text style={{ color: theme.text }}>Custom Content</Text>
    </GlassCard>
  );
};
```

### Processing Forecast Data
```typescript
import { groupForecastByDay, getHourlyForecast } from './src/utils';

const MyForecast = ({ forecast }) => {
  const hourly = getHourlyForecast(forecast.list, 8);
  const daily = groupForecastByDay(forecast.list).slice(0, 5);
  
  return (
    <>
      <HourlyForecast forecast={hourly} />
      <DailyForecast forecast={daily} />
    </>
  );
};
```

---

## 📱 Screen Structure

### HomeScreen Flow
```
1. Check location loading state
   ├─ Show LoadingScreen with "Getting your location..."
   
2. Check weather loading state
   ├─ Show LoadingScreen with "Loading weather data..."
   
3. Check for errors
   ├─ Show ErrorScreen with retry button
   
4. Display weather data
   ├─ Header (location & menu icons)
   ├─ ScrollView with RefreshControl
   │   ├─ CurrentWeatherCard
   │   ├─ HourlyForecast (8 hours)
   │   ├─ DailyForecast (5 days)
   │   ├─ WeatherDetails (6 metrics)
   │   ├─ Sun Times (sunrise/sunset)
   │   └─ Footer (last updated, attribution)
   └─ Dynamic gradient background based on weather
```

---

## 🔧 Configuration

### config.ts
```typescript
API_CONFIG {
  BASE_URL: "https://api.openweathermap.org/data/2.5"
  API_KEY: process.env.EXPO_PUBLIC_WEATHER_API_KEY
  UNITS: "metric"
  LANG: "en"
}

APP_CONFIG {
  FORECAST_ITEMS: 40
  LOCATION_UPDATE_INTERVAL: 600000  // 10 minutes
}
```

---

## 🎨 Styling Philosophy

1. **Consistent Spacing**: All spacing uses theme values
2. **Responsive Text**: Text styles from theme
3. **Dynamic Colors**: Colors passed as props from theme
4. **Modular Styles**: StyleSheet.create for each component
5. **Reusable Patterns**: Common patterns extracted to theme

---

This structure ensures:
- ✅ Maintainability
- ✅ Scalability
- ✅ Type safety
- ✅ Reusability
- ✅ Consistency
