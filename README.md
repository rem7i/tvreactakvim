# Takvimi i Namazit - Prayer Times App

A beautiful React web application for displaying Islamic prayer times in Albanian, designed specifically for mosque TV displays.

## Features

### 🕌 Mosque Configuration Form
- **Imam Name**: Display the imam's name
- **Mosque Name**: Show the mosque's name
- **Location**: Display the mosque's location
- **Iqamah Toggle**: Option to show Iqamah times (future feature)

### ⏰ Prayer Times Display
- **Six Daily Prayers**: Imsaku, L. e Diellit, Dreka, Ikindia, Akshami, Jacia
- **Current Prayer Highlighting**: Active prayer time is highlighted in orange
- **Prayer Icons**: Moon icons for night prayers, sun icons for day prayers
- **Real-time Clock**: Large digital clock display

### 📖 Islamic Content
- **Albanian Quranic Verses**: Rotating display of verses and wisdom quotes
- **Countdown Timer**: Shows time remaining until next prayer
- **Content Rotation**: Alternates between quotes and countdown every 15 seconds

### 🎨 Beautiful Design
- **Mosque Background**: Stunning Blue Mosque imagery
- **Responsive Layout**: Optimized for TV displays and various screen sizes
- **Albanian Language**: Full Albanian language support
- **Professional Styling**: Modern UI with backdrop blur effects

## Albanian Prayer Names

- **Imsaku** - Fajr (Dawn prayer)
- **L. e Diellit** - Sunrise
- **Dreka** - Dhuhr (Noon prayer)
- **Ikindia** - Asr (Afternoon prayer)
- **Akshami** - Maghrib (Sunset prayer)
- **Jacia** - Isha (Night prayer)

## Technology Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality UI components
- **Lucide Icons** - Beautiful prayer time icons

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd prayer-times-app
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start development server**
   ```bash
   pnpm run dev
   ```

4. **Build for production**
   ```bash
   pnpm run build
   ```

## CSV Prayer Times Data

The app supports loading prayer times from CSV files. Place your CSV file in `src/data/prayer-times.csv` with the following format:

```csv
Date,Imsaku,Sunrise,Dreka,Ikindia,Akshami,Jacia
2025-07-10,02:47,04:59,12:44,16:47,20:22,22:24
2025-07-11,02:48,05:00,12:44,16:47,20:21,22:23
```

## Customization

### Adding More Quotes
Edit `src/utils/prayerData.js` to add more Albanian Islamic quotes:

```javascript
export const albanianQuotes = [
  {
    text: "Your Albanian quote here...",
    source: "Source reference"
  }
]
```

### Changing Prayer Times
Update the `prayerTimes` object in `src/App.jsx` or implement CSV loading functionality.

### Background Image
Replace `src/assets/mosque-bg.jpg` with your preferred mosque image.

## TV Display Optimization

- **Full Screen Mode**: Press F11 for full screen display
- **Auto-refresh**: The app automatically updates every second
- **No User Interaction Required**: Perfect for unattended TV displays
- **High Contrast**: Text is clearly visible against the background

## Browser Compatibility

- Chrome/Chromium (Recommended)
- Firefox
- Safari
- Edge

## Deployment

The app can be deployed to any static hosting service:

- Vercel
- Netlify
- GitHub Pages
- Firebase Hosting

## Support

For support or customization requests, please contact the development team.

---

**Developed for Islamic communities with ❤️**

