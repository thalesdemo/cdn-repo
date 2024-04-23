// camera-settings-login-flow.js

export const cameraSettingsLogin = {
    anchorClass: ".Step1RedeemAnchorJS",
    videoContainerId: "video-container",
    videoElementId: "video-element",
    captureButtonId: "capture-button",
    userImageInputId: "identiverse_redeem_step1-TEXT_FIELD-userImage-input_container-input",
    hiddenFormSubmitButtonId: "identiverse_redeem_step1-submit-Submit-button_container",
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
        detectionInterval: 100,
        detectionThreshold: 0.8
    }
};
