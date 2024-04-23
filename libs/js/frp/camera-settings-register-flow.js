// camera-settings-register-flow.js

export const cameraSettingsRegister = {
    anchorClass: ".Step1PurchaseAnchorJS",
    videoContainerId: "video-container",
    videoElementId: "video-element",
    captureButtonId: "capture-button",
    userImageInputId: "identiverse_purchase_step1-TEXT_FIELD-userImage-input_container-input",
    hiddenFormSubmitButtonId: "identiverse_purchase_step1-submit-Submit-button_container",
    videoConstraints: {
        width: { ideal: 900 },
        height: { ideal: 900 }
    },
    videoContainerStyles: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        maxWidth: "650px",
        height: "650px",
        width: "100%",
        margin: "auto",
        marginBottom: "10px",
        backgroundColor: "black",
    },
    faceApiFeatures: {
        drawBoundingBox: true,
        drawLandmarks: true,
        drawExpressions: true,
        drawAgeAndGender: true,
        detectionInterval: 100, // milliseconds
        countdownDuration: 3, // seconds
        detectionThreshold: 0.75,
        badScore: {
            windowSize: 10,             // recentWindow: Number of recent samples to check for bad score threshold
            maxBadScoreInWindow: 4      // maxBadScoresInWindow: Maximum number of bad scores allowed in the recent window
        }
    },
    delayBetweenAnimations: 200, // 2x detectionInterval
    fontSize: {
        countdown: "328px", // Font size for countdown
        success: "54px" // Font size for success message
    }
};
