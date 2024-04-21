// camera-settings-register-flow.js

export const cameraSettingsRegister = {
    anchorClass: ".Step1PurchaseAnchorJS",
    videoContainerId: "video-container",
    videoElementId: "video-element",
    captureButtonId: "capture-button",
    userImageInputId: "identiverse_purchase_step1-TEXT_FIELD-userImage-input_container-input",
    videoConstraints: {
        width: { ideal: 404 },
        height: { ideal: 480 }
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
