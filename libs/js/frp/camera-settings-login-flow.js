// camera-settings-login-flow.js

export const cameraSettingsLogin = {
    anchorClass: ".Step1RedeemAnchorJS",
    videoContainerId: "video-container",
    videoElementId: "video-element",
    captureButtonId: "capture-button",
    userImageInputId: "identiverse_redeem_step1-TEXT_FIELD-userImage-input_container-input",
    videoConstraints: {
        width: { ideal: 768 },
        height: { ideal: 896 }
    },
    videoContainerStyles: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        maxWidth: "576px",
        height: "672px",
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
