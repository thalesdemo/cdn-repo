class DetectionScoreManager {
    constructor(sampleSize, threshold) {
        this.sampleSize = sampleSize;
        this.threshold = threshold;
        this.scores = [];
        this.personActive = false;
        this.multipleDetections = [];
        this.highestScore = 0;  // Track the highest score during an active detection.
    }

    addScore(score) {
        if (this.scores.length >= this.sampleSize) {
            this.scores.shift();
        }
        this.scores.push(score);
    }

    evaluateScores() {
        const badScores = this.scores.filter(score => score < this.threshold).length;
        return badScores <= (this.sampleSize - this.threshold * this.sampleSize);
    }

    checkMultipleDetections(count) {
        this.multipleDetections.push(count > 1);
        if (this.multipleDetections.length > this.sampleSize) {
            this.multipleDetections.shift();
        }
        return this.multipleDetections.filter(Boolean).length < this.sampleSize;  // Check if multiple detections happen less frequently.
    }

    resetScores() {
        this.scores = [];
        this.personActive = false;
        this.multipleDetections = [];
        this.highestScore = 0;
    }

    activatePersonDetection() {
        this.personActive = true;
    }

    deactivatePersonDetection() {
        this.personActive = false;
        const display = document.querySelector('#animation-container');
        display.style.display = 'none';  // Hide the countdown display.
    }

    updateHighestScore(score) {
        if (score > this.highestScore) {
            this.highestScore = score;
        }
    }

    getHighestScore() {
        return this.highestScore;
    }

    isPersonActive() {
        return this.personActive;
    }
}
