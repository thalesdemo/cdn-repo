// camera-settings-login-flow.js

export const cameraSettingsLogin = {
    anchorClass: ".Step1RedeemAnchorJS",
    videoContainerId: "video-container",
    videoElementId: "video-element",
    captureButtonId: "capture-button",
    userImageInputId: "identiverse_redeem_step1-TEXT_FIELD-userImage-input_container-input",
    videoConstraints: {
        width: { ideal: 624 },
        height: { ideal: 500 }
    },
    videoContainerStyles: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        maxWidth: "624px",
        height: "500px",
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
    }
};
