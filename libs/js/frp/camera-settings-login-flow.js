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
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        maxWidth: "640px",
        width: "100%",
        height: "480px",
        margin: "auto",
        marginTop: "20px",
        marginBottom: "10px",
        backgroundColor: "black",
        overflow: "hidden"
    }
};
