import { LenisProvider } from './components/LenisProvider'
import { WorkoutTracker } from './components/WorkoutTracker'

function App() {
  return (
    <LenisProvider>
      <div className="app">
        <header className="app-header">
          <h1>Workout Habit Tracker</h1>
          <p>Build Consistency, One Day at a Time</p>
        </header>
        <main>
          <WorkoutTracker />
        </main>
        <footer className="app-footer">
          <p className="motivational-quote">
            If you feel like <span className="quit-word">QUITTING</span>, <span className="remember-word">REMEMBER</span> why you <span className="started-word">STARTED</span>
          </p>
          <p className="made-by">
            Made with ❤️ by <a href="https://www.abizarisadev.workers.dev" target="_blank" rel="noopener noreferrer" className="author-link">Knight Shade</a>
          </p>
        </footer>
      </div>
    </LenisProvider>
  )
}

export default App