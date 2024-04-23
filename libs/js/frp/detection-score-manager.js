class DetectionScoreManager {
    constructor(sampleSize, threshold, recentWindow, maxBadScoresInWindow) {
        this.sampleSize = sampleSize;
        this.threshold = threshold;
        this.scores = [];
        this.highestScore = 0;
        this.recentWindow = recentWindow;
        this.maxBadScoresInWindow = maxBadScoresInWindow;
        this.countdownActive = false;
        this.countdownId = null;
    }

    addDetection(score, isMultiple) {
        const effectiveScore = (!isMultiple && score > 0) ? score : 0;
        this.scores.push(effectiveScore);
        if (effectiveScore > 0) {
            this.updateHighestScore(effectiveScore);
        }
        if (this.scores.length > this.sampleSize) {
            this.scores.shift();
        }
    }

    evaluateScores() {
        const recentScores = this.scores.slice(-this.recentWindow);
        const badScores = recentScores.filter(score => score < this.threshold).length;
        return badScores <= this.maxBadScoresInWindow;
    }

    resetAll() {
        this.scores = [];
        this.highestScore = 0;
        this.resetCountdown();
    }

    updateHighestScore(score) {
        if (score > this.highestScore) {
            this.highestScore = score;
        }
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
            let timeLeft = duration;
            this.countdownId = setInterval(() => {
                displayElement.textContent = timeLeft;
                if (timeLeft <= 0) {
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
        if (this.countdownActive) {
            clearInterval(this.countdownId);
            this.countdownActive = false;
            const display = document.querySelector('#animation-container');
            display.style.display = 'none';
            display.textContent = '';
        }
    }
}


export { DetectionScoreManager };  