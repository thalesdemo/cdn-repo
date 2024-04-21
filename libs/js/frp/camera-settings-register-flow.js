// camera-settings-register-flow.js

export const cameraSettingsRegister = {
    anchorClass: ".Step1PurchaseAnchorJS",
    videoContainerId: "video-container",
    videoElementId: "video-element",
    captureButtonId: "capture-button",
    userImageInputId: "identiverse_purchase_step1-TEXT_FIELD-userImage-input_container-input",
    videoConstraints: {
        width: { ideal: 624 },
        height: { ideal: 500 }
    },
    videoContainerStyles: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        maxWidth: "700px",
        height: "500px",
        width: "100%",
        margin: "auto",
        marginBottom: "10px",
        backgroundColor: "black",
    }
};
