class DetectionScoreManager {
    constructor(sampleSize, threshold, multipleDetectionWindow, multipleDetectionThreshold) {
        this.sampleSize = sampleSize; // Total number of detection scores to keep for evaluation.
        this.threshold = threshold; // Score threshold for "good" detection.
        this.scores = []; // Array to store detection scores.
        this.personActive = false; // Indicates if a person detection cycle is active.
        this.multipleDetections = []; // Array to track presence of multiple detections.
        this.multipleDetectionWindow = multipleDetectionWindow; // Number of frames to consider for multiple detection evaluation.
        this.multipleDetectionThreshold = multipleDetectionThreshold; // Allowable number of frames with multiple detections.
    }

    
    /* Adds a new score to the array of detection scores and manages the multiple detection flag. */
    addDetection(score, isMultiple) {
        // Manage scores
        if (this.scores.length >= this.sampleSize) {
            this.scores.shift();
        }
        this.scores.push(score);

        // Manage multiple detection flags
        if (this.multipleDetections.length >= this.multipleDetectionWindow) {
            this.multipleDetections.shift();
        }
        this.multipleDetections.push(isMultiple);
    }

    
    /* Evaluates the current array of scores to check if the count of 'bad' scores (scores below the threshold) is within acceptable limits. */
    evaluateScores() {
        // Evaluate scores based on the threshold
        const goodScores = this.scores.filter(score => score >= this.threshold).length;
        return goodScores >= (this.sampleSize - this.threshold * this.sampleSize);
    }

    /* Checks if multiple detections are happening too frequently. 
     * This method is designed to keep track of frames that have multiple face detections. The goal is to deactivate the
     * detection system if multiple faces are detected too frequently over the last several frames.
    */
    checkMultipleDetections() {
        // Check the recent history for multiple detections
        const multipleCount = this.multipleDetections.filter(isMultiple => isMultiple).length;
        return multipleCount > this.multipleDetectionThreshold;
    }

    /* Resets all relevant data when the criteria are not met or when a detection cycle completes. */
    resetAll() {
        this.scores = [];
        this.personActive = false;
        this.multipleDetections = [];
    }

    /* Manages the state of whether a person is currently detected as active. */
    activatePersonDetection() {
        this.personActive = true;
    }

    /* Deactivates the person detection state and hides the animation display. */
    deactivatePersonDetection() {
        this.personActive = false;
        const display = document.querySelector('#animation-container');
        display.style.display = 'none'; // Hide the countdown display.
    }

    // /* Updates the highest score detected during an active detection phase. */
    // updateHighestScore(score) {
    //     if (score > this.highestScore) {
    //         this.highestScore = score;
    //     }
    // }

    // /* Retrieves the highest score detected during an active detection phase. */
    // getHighestScore() {
    //     return this.highestScore;
    // }

    /* Checks if the person detection state is active. */
    isPersonActive() {
        return this.personActive;
    }
}
