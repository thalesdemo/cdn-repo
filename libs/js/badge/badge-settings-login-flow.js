// badge-settings-login-flow.js
export const badgeSettingsLogin = {
    video: {
        elementId: "qr-element",
        containerId: "qr-container",
        styles: {
            container: {
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
            },
            element: {
                maxWidth: "100%",
                margin: "auto",
                width: "100%",      // Fill the width of the container
                height: "100%",     // Fill the height of the container
                objectFit: "cover"  // Cover the container while maintaining the aspect ratio
            }
        }
    },
    interaction: {
        qrRegexPattern: /^user:\/\/identiverse\?id=([^&]+)(&firstname=([^&]*))?(&lastname=([^&]*))?/,
        submitButtonDelay: 1500 // milliseconds
    },
    domSelectors: {
        step1Selectors: {
            anchorClass: ".Step1PurchaseAnchorJS",
            userNameId: "identiverse_purchase_step1-TEXT_FIELD-userName-input_container-input",
            submitButtonId: "identiverse_purchase_step1-submit-Submit-button_container"
        }
    }
};
