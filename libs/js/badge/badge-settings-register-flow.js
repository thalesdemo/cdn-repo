// badge-settings-register-flow.js
export const badgeSettingsRegister = {
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
        registerStep1Anchor: ".Step1RegisterAnchorJS",
        step1Selectors: {
            userNameId: "identiverse_register_step1-TEXT_FIELD-userName-input_container-input",
            firstNameId: "identiverse_register_step1-TEXT_FIELD-firstName-input_container-input",
            lastNameId: "identiverse_register_step1-TEXT_FIELD-lastName-input_container-input",
            submitButtonId: "identiverse_register_step1-submit-Submit-button_container"
        },
        step2Selectors: {
            predefinedFirstName: ".predefinedFirstName h1 span span",
            predefinedLastName: ".predefinedLastName h1 span span",
            firstNameId: "identiverse_register_step2-TEXT_FIELD-givenName-input_container-input",
            lastNameId: "identiverse_register_step2-TEXT_FIELD-name-input_container-input"
        }
    }
};