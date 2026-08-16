import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, addMonths, subMonths, isSameMonth, isSameDay, isPast, isToday, parseISO } from 'date-fns'

const STORAGE_KEY = 'workout-tracker-data'

const getInitialData = () => {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return {}
    }
  }
  return {}
}

const saveData = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

const getStatus = (dateStr, data) => {
  return data[dateStr] || 'none'
}

const STATUS_COLORS = {
  done: '#22c55e',
  missed: '#ef4444',
  recovered: '#eab308',
  rest: '#06b6d4',
  none: 'transparent'
}

const STATUS_LABELS = {
  done: 'Workout Done',
  missed: 'Missed',
  recovered: 'Additional Recovery',
  rest: 'Rest Day',
  none: 'Empty',
  unlog: 'Unlog Data'
}

export function WorkoutTracker() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [workoutData, setWorkoutData] = useState({})
  const [selectedDate, setSelectedDate] = useState(null)
  const [showDayOptions, setShowDayOptions] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState(null)

  useEffect(() => {
    setWorkoutData(getInitialData())
  }, [])

  const handleDayOptionSelect = useCallback((status) => {
    if (!selectedDate || !status) return
    const dateStr = format(selectedDate, 'yyyy-MM-dd')
    setWorkoutData(prev => {
      const newData = { ...prev }
      if (status === 'none') {
        delete newData[dateStr]
      } else {
        newData[dateStr] = status
      }
      saveData(newData)
      return newData
    })
    setShowDayOptions(false)
    setSelectedStatus(null)
  }, [selectedDate])

  const handleDateClick = useCallback((date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const clickedDate = new Date(date)
    clickedDate.setHours(0, 0, 0, 0)

    if (clickedDate > today) return

    setSelectedDate(date)
    setShowDayOptions(true)
  }, [workoutData])

  const handleStatusSelect = useCallback((status) => {
    setSelectedStatus(status)
    handleDayOptionSelect(status)
  }, [handleDayOptionSelect])

  const goToPrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))
  const goToNextMonth = () => {
    const nextMonth = addMonths(currentMonth, 1)
    const now = new Date()
    if (nextMonth.getFullYear() > now.getFullYear() || 
        (nextMonth.getFullYear() === now.getFullYear() && nextMonth.getMonth() > now.getMonth())) {
      return
    }
    setCurrentMonth(nextMonth)
  }

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const stats = {
    done: Object.values(workoutData).filter(s => s === 'done').length,
    missed: Object.values(workoutData).filter(s => s === 'missed').length,
    recovered: Object.values(workoutData).filter(s => s === 'recovered').length,
    rest: Object.values(workoutData).filter(s => s === 'rest').length,
  }

  const statusOptions = [
    { value: 'done', label: 'Workout Completed', color: '#22c55e', icon: '✓' },
    { value: 'rest', label: 'Rest Day', color: '#06b6d4', icon: '↯' },
    { value: 'recovered', label: 'Additional Recovery', color: '#eab308', icon: '↻' },
    { value: 'missed', label: 'Missed', color: '#ef4444', icon: '✕' },
    { value: 'unlog', label: 'Unlog Data', color: '#6b7280', icon: '🗑️' },
  ]

  return (
    <div className="workout-tracker">
      <motion.div 
        className="tracker-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.button
          className="nav-btn"
          onClick={goToPrevMonth}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Previous month"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </motion.button>
        
        <motion.h2
          key={format(currentMonth, 'yyyy-MM')}
          className="month-title"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {format(currentMonth, 'MMMM yyyy')}
        </motion.h2>
        
        <motion.button
          className="nav-btn"
          onClick={goToNextMonth}
          disabled={currentMonth.getMonth() === new Date().getMonth() && currentMonth.getFullYear() === new Date().getFullYear()}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Next month"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </motion.button>
      </motion.div>

      <motion.div
        className="stats-bar"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="stat-item">
          <span className="stat-value" style={{ color: '#22c55e' }}>{stats.done}</span>
          <span className="stat-label">Done</span>
        </div>
        <div className="stat-item">
          <span className="stat-value" style={{ color: '#06b6d4' }}>{stats.rest}</span>
          <span className="stat-label">Rest</span>
        </div>
        <div className="stat-item">
          <span className="stat-value" style={{ color: '#eab308' }}>{stats.recovered}</span>
          <span className="stat-label">Recovered</span>
        </div>
        <div className="stat-item">
          <span className="stat-value" style={{ color: '#ef4444' }}>{stats.missed}</span>
          <span className="stat-label">Missed</span>
        </div>
      </motion.div>

      <div className="calendar-container">
        <div className="calendar">
          <div className="weekdays">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} className="weekday">{day}</div>
            ))}
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={format(currentMonth, 'yyyy-MM')}
              className="days-grid"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {days.map((day, index) => {
                const dateStr = format(day, 'yyyy-MM-dd')
                const status = getStatus(dateStr, workoutData)
                const isCurrentMonth = isSameMonth(day, currentMonth)
                const isTodayDate = isToday(day)
                const isFuture = day > today
                const isSelected = selectedDate && isSameDay(day, selectedDate)

                return (
                  <motion.button
                    key={dateStr}
                    className={`day-cell ${!isCurrentMonth ? 'other-month' : ''} ${isTodayDate ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                    onClick={() => !isFuture && handleDateClick(day)}
                    disabled={isFuture}
                    whileHover={!isFuture ? { scale: 1.1 } : {}}
                    whileTap={!isFuture ? { scale: 0.9 } : {}}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, delay: index * 0.01 }}
                    style={{
                      backgroundColor: status !== 'none' ? STATUS_COLORS[status] : 'transparent',
                      borderColor: isTodayDate ? '#aa3bff' : 'transparent'
                    }}
                    title={`${format(day, 'MMM d, yyyy')}: ${STATUS_LABELS[status]}`}
                  >
                    <span className="day-number">{format(day, 'd')}</span>
                    {status !== 'none' && (
                      <motion.span
                        className="status-indicator"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      >
                        {status === 'done' && '✓'}
                        {status === 'missed' && '✕'}
                        {status === 'recovered' && '↻'}
                        {status === 'rest' && '↯'}
                      </motion.span>
                    )}
                  </motion.button>
                )
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {showDayOptions && selectedDate && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDayOptions(false)}
          >
            <motion.div
              className="modal"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.h3
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Select Day Type
              </motion.h3>
              <p>
                What happened on <strong>{format(selectedDate, 'MMMM d, yyyy')}</strong>?
              </p>
              <div className="day-options">
                {statusOptions.map(option => (
                  <motion.div
                    key={option.value}
                    className="day-option"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    onClick={() => handleStatusSelect(option.value)}
                  >
                    <span className="option-color"
                      style={{ backgroundColor: option.color }}
                    ></span>
                    <span className="option-label">{option.label}</span>
                  </motion.div>
                ))}
              </div>
              <div className="modal-actions" style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
                <motion.button
                  className="btn-cancel"
                  onClick={() => setShowDayOptions(false)}
                  whileHover={{ backgroundColor: '#f3f4f6' }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="legend"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#22c55e' }}></span>
          <span>Workout Done</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#06b6d4' }}></span>
          <span>Rest Day</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#eab308' }}></span>
          <span>Additional Recovery</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#ef4444' }}></span>
          <span>Missed</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#6b7280' }}></span>
          <span>Unlog Data</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: 'transparent', border: '1px dashed #ccc' }}></span>
          <span>Empty</span>
        </div>
      </motion.div>
    </div>
  )
}