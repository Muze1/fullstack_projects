const clockElement = document.getElementById('clock')
const dateElement = document.getElementById('date')
const weatherElement = document.getElementById('weather')
const toggleButton = document.getElementById('temp-toggle')
// Create variables for calling the relevant elements.
// By calling the elements once at startup and storing the references, you avoid querying the DOM every time you need to update the clock (which is every second). Fundamental performance optimisation.

// Live clock widget
function updateClock() {
    const now = new Date() // Create a Date object with current time

    const hours = now.getHours().toString().padStart(2, '0')
    const minutes = now.getMinutes().toString().padStart(2, '0')
    const seconds = now.getSeconds().toString().padStart(2, '0')

    clockElement.textContent = `${hours}:${minutes}:${seconds}`
}