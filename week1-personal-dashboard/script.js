const clockElement = document.getElementById('clock')
const dateElement = document.getElementById('date')
const weatherElement = document.getElementById('weather')
const toggleButton = document.getElementById('temp-toggle')
// document.getElementById() - finds elements by their 'id' attribute
// Store in variables to avoid repeated DOM queries (optimise performance)

// Live clock widget
function updateClock() {
    const now = new Date() // Create an object with current date/time

    const hours = now.getHours().toString().padStart(2, '0')
    const minutes = now.getMinutes().toString().padStart(2, '0')
    const seconds = now.getSeconds().toString().padStart(2, '0')
    // .getHours/Minutes/Seconds() - Extract Hours/Minutes/Seconds time components
    // .padStart() - Ensures 2-digit format. E.g. "09" instead of just "9"

    clockElement.textContent = `${hours}:${minutes}:${seconds}`
    // Template literal - build a formatted string (string with variable components in its structure)
}

updateClock()
setInterval(updateClock, 1000) // Calls function every 1000ms (1s)