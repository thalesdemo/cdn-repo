// Constants for DOM elements IDs and selectors
const VIDEO_ELEMENT_ID = "qr-video";
const VIDEO_CONTAINER_ID = "video-container";
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
    width: "100%",
    maxWidth: "640px",
    margin: "auto",
    marginTop: "20px",
    marginBottom: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
};

const VIDEO_ELEMENT_STYLES = {
    maxWidth: "100%",
    margin: "auto"
};

// QR Configuration object
const qrConfig = {
  videoElementId: VIDEO_ELEMENT_ID,
  containerId: VIDEO_CONTAINER_ID,
  qrRegexPattern: QR_REGEX_PATTERN,
  successImageContainerId: VIDEO_CONTAINER_ID,
  failureImageContainerId: VIDEO_CONTAINER_ID,
  submitButtonId: SUBMIT_BUTTON_ID,
  submitButtonDelay: SUBMIT_BUTTON_DELAY,
  fields: {
      userName: USER_NAME_FIELD_STEP1_ID,
      firstName: FIRST_NAME_FIELD_STEP1_ID,
      lastName: LAST_NAME_FIELD_STEP1_ID
  }
};

import { populateInputField, observeDOMChanges, insertElementBelowAnchor, appendChildToElement } from './utils/tulip-customizer-commons.js';
import { initializeQrScanner } from './utils/tulip-qr-scanner.js';


window.qrScannerInitialized = window.qrScannerInitialized || false;

// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded and parsed.");

  // Define tasks to be executed based on certain conditions
  const tasks = [
      {
          check: () =>
              document.querySelector(REGISTER_STEP1_ANCHOR_CLASS) &&
              !document.querySelector("#" + VIDEO_CONTAINER_ID),
          action: insertVideoContainer
      },
      {
          check: () =>
              document.getElementById(VIDEO_ELEMENT_ID) && !window.qrScannerInitialized,
          action: setupQrScannerAndPopulateInput
      },
      {
          check: () => document.querySelector(PREDEFINED_FIRST_NAME_SELECTOR),
          action: () => {
              const firstNameValue = document.querySelector(PREDEFINED_FIRST_NAME_SELECTOR).textContent;
              if (firstNameValue) {
                  console.log("Populating givenName input with:", firstNameValue);
                  populateInputField(
                      GIVEN_NAME_FIELD_STEP2_ID,
                      firstNameValue
                  );
              }
          },
      },
      {
          check: () => document.querySelector(PREDEFINED_LAST_NAME_SELECTOR),
          action: () => {
              const lastNameValue = document.querySelector(PREDEFINED_LAST_NAME_SELECTOR).textContent;
              if (lastNameValue) {
                  console.log("Populating lastName input with:", lastNameValue);
                  populateInputField(
                      NAME_FIELD_STEP2_ID,
                      lastNameValue
                  );
              }
          },
      }
  ];

  observeDOMChanges(tasks);
});


// Function to insert the video container and its contents below the specified anchor
function insertVideoContainer() {
  console.log("Inserting video container below the register step 1 anchor");
  const anchorSelector = REGISTER_STEP1_ANCHOR_CLASS; // Updated to use constant
  const videoContainerOptions = {
      styles: VIDEO_CONTAINER_STYLES // Reused from constants
  };

  // Insert the video container element below the anchor using the helper function
  const videoContainer = insertElementBelowAnchor(anchorSelector, VIDEO_CONTAINER_ID, "div", videoContainerOptions);
  if (!videoContainer) {
      console.error("Failed to insert video container.");
      return;
  }

  // Append a video element to the newly created video container
  const videoElementOptions = {
      styles: VIDEO_ELEMENT_STYLES, // Reused from constants
      attributes: {
          id: VIDEO_ELEMENT_ID // Used constant for ID
      }
  };

  const videoElement = appendChildToElement(VIDEO_CONTAINER_ID, VIDEO_ELEMENT_ID, "video", videoElementOptions);
  if (!videoElement) {
      console.error("Failed to append video element.");
      return;
  }
}

function setupQrScannerAndPopulateInput() {
  console.log("Initializing QR Scanner");

  if (window.qrScannerInitialized) return;

  // Initialize the QR scanner with the configuration object
  const qrScanner = initializeQrScanner(qrConfig).then(() => {
      console.log("QR Scanner initialized and running.");
  }).catch(err => {
      console.error("Failed to start QR scanner:", err);
  });

  if (!qrScanner) {
      console.error("Failed to initialize the QR scanner.");
      return;
  }

  window.qrScannerInitialized = true;
}
