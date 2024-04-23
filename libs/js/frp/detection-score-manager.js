class DetectionScoreManager {
    constructor(sampleSize, threshold, recentWindow, maxBadScoresInWindow, fontSizeConfig) {
        this.sampleSize = sampleSize;
        this.threshold = threshold;
        this.scores = [];
        this.highestScore = 0;
        this.recentWindow = recentWindow;
        this.maxBadScoresInWindow = maxBadScoresInWindow;
        this.countdownActive = false;
        this.countdownId = null;
        this.fontSizeConfig = fontSizeConfig; // Store the font size configuration
  
    }

    /* Returns true if the score was added as a new high score */
    addDetection(score, isMultiple) {
        const effectiveScore = (!isMultiple && score > 0) ? score : 0;
        this.scores.push(effectiveScore);

        // Check if we need to shift the oldest score out
        if (this.scores.length > this.sampleSize) {
            this.scores.shift();
        }

        // Update highest score and return whether it was a new high
        if (effectiveScore > 0) {
            return this.updateHighestScore(effectiveScore);
        }
        return false;
    }

    evaluateScores() {
        const recentScores = this.scores.slice(-this.recentWindow);
        const badScores = recentScores.filter(score => score < this.threshold).length;
        return badScores <= this.maxBadScoresInWindow;
    }

    updateHighestScore(score) {
        if (score > this.highestScore) {
            this.highestScore = score;
            return true; // Indicates a new highest score was found
        }
        return false; // No new high score
    } 

    getHighestScore() {
        return this.highestScore;
    }

    hasEnoughSamples() {
        return this.scores.length >= this.sampleSize;
    }

    startCountdown(duration, displayElement) {
        if (!this.countdownActive) {
            displayElement.style.display = 'block';
            displayElement.style.fontSize = this.fontSizeConfig.countdown;
            let timeLeft = duration;
            this.countdownId = setInterval(() => {
                displayElement.textContent = timeLeft;
                if (timeLeft < 1) {
                    clearInterval(this.countdownId);
                    this.countdownActive = false;
                    displayElement.style.display = 'none';
                    displayElement.textContent = '';
                }
                timeLeft -= 1;
            }, 1000);
            this.countdownActive = true;
        }
    }

    resetCountdown() {
        console.log("resetCountdown called");
        if (this.countdownActive) {
            clearInterval(this.countdownId);
            this.countdownActive = false;
            const display = document.querySelector('#animation-container');
            display.style.display = 'none';
            display.textContent = '';
        }
    }
    
    resetAll() {
        // console.log("resetAll called");
        this.scores = [];
        this.highestScore = 0;
        this.resetCountdown();
    }

    displaySuccessMessage(displayElement) {
        console.log("Displaying success message.");
        displayElement.style.display = 'block';
        displayElement.style.fontSize = this.fontSizeConfig.success;
        const percentageScore = (this.getHighestScore() * 100).toFixed(1);
        displayElement.textContent = 'Score: ' + percentageScore + '%';
    
        // Additional logging to debug
        // setTimeout(() => {
        //     console.log("Check display status after 5 seconds:", displayElement.style.display, displayElement.textContent);
        // }, 5000);
    }
    
}


export { DetectionScoreManager };  