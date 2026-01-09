# Quick Start Guide

## 🚀 Get Up and Running in 5 Minutes

### Step 1: Prerequisites Check
Ensure you have:
- [ ] Node.js installed (v14+)
- [ ] npm or yarn
- [ ] Expo CLI (`npm install -g expo-cli`)
- [ ] Expo Go app on your phone (iOS/Android)

### Step 2: Get OpenWeatherMap API Key
1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Navigate to "API keys" section
4. Copy your API key

### Step 3: Set Up Environment
1. Create a `.env` file in the project root:
```bash
touch .env
```

2. Add your API key to `.env`:
```
EXPO_PUBLIC_WEATHER_API_KEY=your_actual_api_key_here
```

### Step 4: Install Dependencies
```bash
npm install
```

### Step 5: Start the App
```bash
npm start
```

This will open Expo DevTools in your browser.

### Step 6: Run on Your Device

**Option A: Physical Device**
1. Open Expo Go app on your phone
2. Scan the QR code from the terminal or browser
3. Wait for the app to load

**Option B: iOS Simulator** (Mac only)
```bash
Press 'i' in the terminal
```

**Option C: Android Emulator**
```bash
Press 'a' in the terminal
```

### Step 7: Allow Location Access
When the app launches, it will request location permission. Click "Allow" to see weather for your current location.

---

## 🎉 You're All Set!

The app should now display:
- Your current location's weather
- Temperature and conditions
- Hourly forecast (next 8 hours)
- 5-day forecast
- Detailed weather metrics
- Beautiful weather-based background

---

## 🔧 Troubleshooting

### "Unable to resolve module @expo-google-fonts/sora"
```bash
npm install @expo-google-fonts/sora
```

### "API key not found" or Weather data not loading
- Check your `.env` file exists in the project root
- Verify the API key is correct
- Restart the Expo server (`r` in terminal or close and `npm start` again)

### Location not working
- Ensure you've granted location permissions
- Check your device's location services are enabled
- Try on a real device (simulators sometimes have issues)

### App crashes on startup
```bash
# Clear cache and reinstall
npm start -- --clear
```

### Fonts not loading
```bash
# Reinstall expo-font
npm install expo-font @expo-google-fonts/sora
```

---

## 📱 Testing Different Screens

### Loading State
The loading screen appears automatically when:
- Fetching location
- Fetching weather data
- Fonts are loading

### Error State
To test error handling:
- Turn off your internet connection
- Or temporarily remove your API key from `.env`
- The app will show an error screen with a retry button

### Refresh
- Pull down on the main screen to refresh weather data
- This fetches the latest data from the API

---

## 🎨 Customization

### Change Temperature Units
Edit [src/constants/config.ts](src/constants/config.ts):
```typescript
UNITS: "imperial"  // For Fahrenheit
// or
UNITS: "metric"    // For Celsius (default)
```

### Change Language
Edit [src/constants/config.ts](src/constants/config.ts):
```typescript
LANG: "es"  // Spanish
LANG: "fr"  // French
// etc.
```

### Modify Theme Colors
Edit [src/theme/colors.ts](src/theme/colors.ts) to customize the color schemes for different weather conditions.

---

## 📚 Next Steps

1. **Explore the Code**: Check out [COMPONENT_DOCS.md](COMPONENT_DOCS.md) for detailed component documentation
2. **Understand the Design**: Read [DESIGN_SUMMARY.md](DESIGN_SUMMARY.md) for UX insights
3. **Add Features**: The codebase is modular and easy to extend
4. **Customize**: Make it your own by tweaking colors, fonts, or layouts

---

## 🐛 Found an Issue?

If you encounter any problems:
1. Check the troubleshooting section above
2. Review error messages in the terminal
3. Check Expo logs in the browser DevTools
4. Verify all dependencies are installed correctly

---

## 💡 Pro Tips

1. **Hot Reload**: Save files while the app is running - changes appear instantly
2. **Debug Menu**: Shake your device (or Cmd+D on iOS / Cmd+M on Android) to open the developer menu
3. **Console Logs**: View in Expo DevTools browser window
4. **Reload**: Press 'r' in the terminal to reload the app
5. **Clear Cache**: If things get weird, run `npm start -- --clear`

---

## 🎯 What's Included

✅ Current weather display
✅ Hourly forecast (8 hours)
✅ 5-day daily forecast
✅ Detailed weather metrics (humidity, wind, pressure, etc.)
✅ Dynamic weather-based themes
✅ Glassmorphism UI design
✅ Smooth animations
✅ Pull-to-refresh
✅ Error handling
✅ Loading states
✅ Location services
✅ TypeScript support

---

Enjoy your beautiful new weather app! 🌤️
