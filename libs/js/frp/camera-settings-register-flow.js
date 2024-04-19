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
