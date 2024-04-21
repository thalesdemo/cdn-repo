// camera-settings-register-flow.js

export const cameraSettingsRegister = {
    anchorClass: ".Step1PurchaseAnchorJS",
    videoContainerId: "video-container",
    videoElementId: "video-element",
    captureButtonId: "capture-button",
    userImageInputId: "identiverse_purchase_step1-TEXT_FIELD-userImage-input_container-input",
    videoConstraints: {
        width: { ideal: 800 },
        height: { ideal: 800 }
    },
    videoContainerStyles: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        maxWidth: "800px",
        width: "100%",
        height: "800px",
        margin: "auto",
        marginTop: "20px",
        marginBottom: "10px",
        backgroundColor: "black",
        overflow: "hidden",
        // transform: "scale(0.9)"
    }
};
