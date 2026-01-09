# Visual Component Tree

```
App.tsx
└── SafeAreaProvider
    └── HomeScreen
        └── LinearGradient (Weather-based theme)
            └── SafeAreaView
                ├── Header
                │   ├── TouchableOpacity (Location Icon)
                │   └── TouchableOpacity (Menu Icon)
                │
                └── ScrollView (with RefreshControl)
                    ├── CurrentWeatherCard
                    │   ├── Text (City Name)
                    │   ├── WeatherIcon (Large - 150px)
                    │   ├── View (Temperature Container)
                    │   │   ├── Text (Temperature - 96px)
                    │   │   └── Text (Description)
                    │   └── GlassCard (Details)
                    │       ├── View (Feels Like Row)
                    │       ├── View (Separator)
                    │       └── View (High/Low Row)
                    │
                    ├── HourlyForecast
                    │   ├── Text (Section Title)
                    │   └── ScrollView (Horizontal)
                    │       └── [8× GlassCard]
                    │           ├── Text (Time)
                    │           ├── WeatherIcon (40px)
                    │           ├── Text (Temperature)
                    │           └── Text (Precipitation %)
                    │
                    ├── DailyForecast
                    │   ├── Text (Section Title)
                    │   └── GlassCard
                    │       └── [5× View (Day Row)]
                    │           ├── Text (Day Name)
                    │           ├── View (Weather Info)
                    │           │   ├── WeatherIcon (32px)
                    │           │   └── View (Precipitation)
                    │           │       ├── Ionicons (Water)
                    │           │       └── Text (%)
                    │           └── View (Temp Range)
                    │               ├── Text (Max)
                    │               └── Text (Min)
                    │
                    ├── WeatherDetails
                    │   ├── Text (Section Title)
                    │   └── View (Grid)
                    │       └── [6× GlassCard (Detail Item)]
                    │           ├── View (Header)
                    │           │   ├── Ionicons
                    │           │   └── Text (Label)
                    │           └── View (Content)
                    │               ├── Text (Value)
                    │               └── Text (Unit)
                    │
                    ├── View (Sun Times Container)
                    │   ├── View (Sunrise Card)
                    │   │   ├── Ionicons (Sun)
                    │   │   └── View
                    │   │       ├── Text (Label)
                    │   │       └── Text (Time)
                    │   └── View (Sunset Card)
                    │       ├── Ionicons (Moon)
                    │       └── View
                    │           ├── Text (Label)
                    │           └── Text (Time)
                    │
                    └── View (Footer)
                        ├── Text (Last Updated)
                        └── Text (Attribution)
```

## State-Based Rendering

```
App State
├── Loading (locationLoading || weatherLoading)
│   └── LoadingScreen
│       └── LinearGradient
│           └── View
│               ├── ActivityIndicator
│               └── Text (Loading message)
│
├── Error (locationError || weatherError)
│   └── ErrorScreen
│       └── LinearGradient
│           └── View
│               ├── Ionicons (Cloud Offline)
│               ├── Text (Error Title)
│               ├── Text (Error Message)
│               └── TouchableOpacity (Retry Button)
│                   ├── Ionicons (Refresh)
│                   └── Text (Button Text)
│
└── Success (currentWeather && forecast)
    └── HomeScreen (see tree above)
```

## Data Flow

```
User Opens App
    ↓
App.tsx
    ↓
[Loads Fonts]
    ↓
HomeScreen Mounts
    ↓
useLocation Hook
    ├─→ Request Location Permission
    ├─→ Get Device Coordinates
    └─→ Return {coordinates, loading, error}
        ↓
useWeather Hook
    ├─→ Receive coordinates
    ├─→ Call weatherService.getWeatherData()
    │   ├─→ getCurrentWeather(coordinates)
    │   └─→ getForecast(coordinates)
    └─→ Return {currentWeather, forecast, loading, error, refetch}
        ↓
Process Data
    ├─→ getHourlyForecast() → First 8 items
    ├─→ groupForecastByDay() → 5 days
    └─→ getWeatherTheme() → Theme colors
        ↓
Render Components
    ├─→ CurrentWeatherCard
    ├─→ HourlyForecast
    ├─→ DailyForecast
    ├─→ WeatherDetails
    └─→ Additional Info
```

## Theme Application Flow

```
Weather Data Received
    ↓
Extract weather.weather[0].main
    ↓
Check if Night Time
    ├─→ Compare currentTime with sunrise/sunset
    └─→ isNight = boolean
        ↓
getWeatherTheme(weatherMain, isNight)
    ├─→ Match weather condition
    │   ├─→ Clear + Day → clearDay theme
    │   ├─→ Clear + Night → clearNight theme
    │   ├─→ Clouds → cloudy theme
    │   ├─→ Rain/Drizzle → rainy theme
    │   ├─→ Thunder/Storm → stormy theme
    │   └─→ Snow → snowy theme
    └─→ Return theme object
        ├─→ primary
        ├─→ secondary
        ├─→ gradient [color1, color2, color3]
        ├─→ text
        ├─→ textSecondary
        ├─→ card
        └─→ cardBorder
            ↓
Apply to LinearGradient
    ├─→ colors={theme.gradient}
    └─→ All text uses theme.text
        ↓
Components Render with Theme
```

## Component Prop Flow

```
HomeScreen
    │
    ├─→ CurrentWeatherCard
    │   └── Props: { weather: CurrentWeather, textColor: theme.text }
    │
    ├─→ HourlyForecast
    │   └── Props: { forecast: ForecastItem[], textColor: theme.text }
    │       └─→ Maps to WeatherIcon
    │           └── Props: { iconCode: string, size: number }
    │
    ├─→ DailyForecast
    │   └── Props: { forecast: ForecastDay[], textColor: theme.text }
    │       └─→ Maps to WeatherIcon
    │           └── Props: { iconCode: string, size: number }
    │
    └─→ WeatherDetails
        └── Props: { weather: CurrentWeather, textColor: theme.text }
            └─→ Maps to DetailItem
                └── Props: { icon, label, value, unit, textColor }
```

## Hook Dependencies

```
useLocation
    ├─→ useState (internal state)
    ├─→ useEffect (on mount)
    │   └─→ requestForegroundPermissionsAsync()
    │       └─→ getCurrentPositionAsync()
    └─→ Returns: { coordinates, loading, error }
        ↓
useWeather(coordinates)
    ├─→ useState (internal state)
    ├─→ useEffect [coordinates?.latitude, coordinates?.longitude]
    │   └─→ getWeatherData(coordinates)
    │       ├─→ getCurrentWeather()
    │       └─→ getForecast()
    └─→ Returns: { currentWeather, forecast, loading, error, refetch }
```

## Style Composition

```
Component Styles
    ├─→ Imported from theme
    │   ├─→ colors
    │   ├─→ typography (fonts, sizes, styles)
    │   ├─→ spacing (margins, padding, gaps)
    │   ├─→ borderRadius
    │   └─→ shadows
    │
    ├─→ Local StyleSheet.create()
    │   └─→ Uses theme values
    │
    └─→ Applied to components
        ├─→ Base styles from StyleSheet
        ├─→ Dynamic colors from theme prop
        └─→ Conditional styles based on state
```

This visual representation helps understand:
1. **Component Hierarchy**: How components nest
2. **Data Flow**: How data moves through the app
3. **State Management**: Loading/error/success states
4. **Theme Application**: How themes are applied dynamically
5. **Prop Drilling**: How props flow down
6. **Hook Connections**: How hooks interact

---

## Quick Reference

### Main Containers
- **App.tsx**: Root component
- **HomeScreen**: Main screen container
- **LinearGradient**: Dynamic background

### Display Components
- **CurrentWeatherCard**: Hero weather display
- **HourlyForecast**: Next 8 hours
- **DailyForecast**: Next 5 days
- **WeatherDetails**: 6 weather metrics

### Utility Components
- **LoadingScreen**: Loading state
- **ErrorScreen**: Error state
- **GlassCard**: Reusable card container
- **WeatherIcon**: Weather condition icon

### Data Hooks
- **useLocation**: Device location
- **useWeather**: Weather data

### Services
- **weatherService**: API calls
- **weatherUtils**: Data processing
- **dateFormatter**: Time formatting
