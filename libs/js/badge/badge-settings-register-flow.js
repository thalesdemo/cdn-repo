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
        registerStep1Anchor: ".introStep1Register",
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


// Constants for DOM elements IDs and selectors
const VIDEO_ELEMENT_ID = "qr-element";
const VIDEO_CONTAINER_ID = "qr-container";
const SUBMIT_BUTTON_ID = "identiverse_register_step1-submit-Submit-button_container";
const REGISTER_STEP1_ANCHOR_CLASS = ".introStep1Register";
const PREDEFINED_FIRST_NAME_SELECTOR = ".predefinedFirstName h1 span span";
const PREDEFINED_LAST_NAME_SELECTOR = ".predefinedLastName h1 span span";

// Field IDs for Step 1 (hidden input fields populated from QR code)
const USER_NAME_FIELD_STEP1_ID = "identiverse_register_step1-TEXT_FIELD-userName-input_container-input";
const FIRST_NAME_FIELD_STEP1_ID = "identiverse_register_step1-TEXT_FIELD-firstName-input_container-input";
const LAST_NAME_FIELD_STEP1_ID = "identiverse_register_step1-TEXT_FIELD-lastName-input_container-input";

// Field IDs for Step 2 (fields for user modification)
const GIVEN_NAME_FIELD_STEP2_ID = "identiverse_register_step2-TEXT_FIELD-givenName-input_container-input";
const NAME_FIELD_STEP2_ID = "identiverse_register_step2-TEXT_FIELD-name-input_container-input";

// QR Configuration constants
const QR_REGEX_PATTERN = /^user:\/\/identiverse\?id=([^&]+)(&firstname=([^&]*))?(&lastname=([^&]*))?/;
const SUBMIT_BUTTON_DELAY = 1500; // milliseconds

// Styles for dynamic elements
const VIDEO_CONTAINER_STYLES = {
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
};

const VIDEO_ELEMENT_STYLES = {
    maxWidth: "100%",
    margin: "auto",
    width: "100%",      // Fill the width of the container
    height: "100%",     // Fill the height of the container
    objectFit: "cover"  // Cover the container while maintaining the aspect ratio
};


