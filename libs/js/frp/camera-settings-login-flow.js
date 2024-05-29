// camera-settings-login-flow.js

export const cameraSettingsLogin = {
    anchorClass: ".Step1RedeemAnchorJS",
    videoContainerId: "video-container",
    videoElementId: "video-element",
    captureButtonId: "capture-button",
    userImageInputId: "identiverse_redeem_step1-TEXT_FIELD-userImage-input_container-input",
    hiddenFormSubmitButtonId: "identiverse_redeem_step1-submit-Submit-button_container",
    mobileWidth: 744, //px (accounts for iPad mini)
    videoConstraints: {
        width: { ideal: 800 },
        height: { ideal: 800 }
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
        modelPath: 'https://cdn.onewelco.me/libs/js/extras/face-api/models/',
        drawBoundingBox: true,
        drawLandmarks: true,
        drawExpressions: true,
        drawAgeAndGender: false,
        detectionInterval: 100, // milliseconds
        countdownDuration: 2, // seconds
        detectionThreshold: 0.6,
        badScore: {
            windowSize: 10,             // recentWindow: Number of recent samples to check for bad score threshold
            maxBadScoreInWindow: 5      // maxBadScoresInWindow: Maximum number of bad scores allowed in the recent window
        }
    },
    delayBetweenAnimations: 200, // 2x detectionInterval
    fontSize: {
        countdown: "328px", // Font size for countdown
        success: "54px" // Font size for success message
    } // mobile will use half these dims
};