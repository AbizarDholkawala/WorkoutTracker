# Workout Habit Tracker 🏋️‍♂️

A beautiful, interactive, and responsive calendar-based web application to track your workout habits, log daily activities, and visualize your progress over time. 

Built with a modern web design philosophy, utilizing smooth animations and a premium, clean user interface.

## 🚀 Live Demo
You can view the live app deployed on Vercel:
👉 **[wt-workout-tracker.vercel.app](https://wt-workout-tracker.vercel.app)**

---

## ✨ Features

- **Interactive Calendar Grid**: Easily view the entire month's calendar layout. Non-current month days are subtly greyed out for a clean, focused display.
- **Log Daily Status**: Click on any past or current day to record its status:
  - ✅ **Workout Completed** (Green)
  - ↯ **Rest Day** (Cyan)
  - ↻ **Additional Recovery** (Yellow)
  - ✕ **Missed** (Red)
  - 🗑️ **Unlog Data** (Clears the logged status)
- **Automatic Stat Counter**: Instantly tracks and displays total counts for workouts completed, rest days taken, recoveries recorded, and missed sessions.
- **Local Storage Persistence**: Your progress is saved automatically on your local browser session, so no data is lost when you close the tab.
- **Smooth Navigation**: Navigate between previous and next months. Future months are automatically disabled to prevent logging ahead of time.
- **Fluid UI Animations**: Interactive scaling hover effects, bouncy spring-based status indicators, and smooth month transitions powered by Framer Motion.
- **Smooth Scroll Integration**: Uses Lenis smooth scrolling for a premium, native-feeling scroll experience.
- **Fully Responsive**: Highly optimized for all screens—from small mobile devices to desktop monitors.

---

## 🛠️ Tech Stack

- **Core**: [React](https://react.dev/) + [Vite](https://vite.dev/) (fast, modern dev environment)
- **Styling**: Custom Vanilla CSS (clean, responsive grid and flexbox structures, supporting system-based Dark Mode automatically)
- **Animations**: [Framer Motion](https://www.framer.com/motion/) (spring physical animations and page transitions)
- **Date Utilities**: [date-fns](https://date-fns.org/) (lightweight date manipulation and formatting helper)
- **Smooth Scrolling**: [Lenis](https://lenis.darkroom.engineering/) (modern smooth scrolling framework)

---

## ⚙️ Getting Started Locally

Follow these steps to run the Workout Habit Tracker on your machine:

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed.

### 1. Clone the repository
```bash
git clone <repository-url>
cd <repository-folder>
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the development server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### 4. Build for production
```bash
npm run build
```
This will compile the production bundle into the `dist` directory.

---

## 📄 License
This project is open-source and available under the MIT License.
