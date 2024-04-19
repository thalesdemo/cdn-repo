// camera-settings-login-flow.js

export const cameraSettingsLogin = {
    anchorClass: ".Step1RedeemAnchorJS",
    videoContainerId: "video-container",
    videoElementId: "video-element",
    captureButtonId: "capture-button",
    userImageInputId: "identiverse_redeem_step1-TEXT_FIELD-userImage-input_container-input",
    videoConstraints: {
        width: { ideal: 800 },
        height: { ideal: 800 }
    },
    videoContainerStyles: {
        width: "100%",
        maxWidth: "640px",
        margin: "auto",
        marginTop: "20px",
        marginBottom: "10px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    }
};
