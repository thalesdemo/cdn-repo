/* animation.js */

export function startCountdown(duration, display) {
    var timer = duration, seconds;
    setInterval(function () {
        seconds = parseInt(timer % 60, 10);
        display.textContent = seconds;

        if (--timer < 0) {
            display.textContent = ''; // Clear countdown when done
            clearInterval(this); // Stop the countdown interval
        }
    }, 1000);
}