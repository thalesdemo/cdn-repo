import { populateInputField, observeDOMChanges, insertElementBelowAnchor, appendChildToElement } from './tulip-customizer-commons.js';
import { initializeQrScanner } from './tulip-qr-scanner.js';


const qrConfig = {
  videoElementId: "qr-video",
  containerId: "video-container",
  qrRegexPattern: /^user:\/\/identiverse\?id=([^&]+)(&firstname=([^&]*))?(&lastname=([^&]*))?/,
  successImageContainerId: "video-container",
  submitButtonId: "identiverse_register_step1-submit-Submit-button_container",
  submitButtonDelay: 1500,
  fields: {
      userName: "identiverse_register_step1-TEXT_FIELD-userName-input_container-input",
      firstName: "identiverse_register_step1-TEXT_FIELD-firstName-input_container-input",
      lastName: "identiverse_register_step1-TEXT_FIELD-lastName-input_container-input"
  }
};


// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded and parsed.");

  // Define tasks to be executed based on certain conditions
  const tasks = [
    // Task to insert the video container below the anchor div
    {
      check: () =>
          document.querySelector(".introStep1Register") &&
          !document.querySelector("#video-container"),
      action: () => insertVideoContainer(),
    },
    // Task to initialize the QR scanner and populate the input field
    {
      check: () =>
        document.getElementById("qr-video") && !window.qrScannerInitialized,
      action: () => setupQrScannerAndPopulateInput(),
    },
    // Task to populate the firstname field
    {
      check: () => document.querySelector(".predefinedFirstName h1 span span"),
      action: () => {
        const firstNameValue = document.querySelector(
          ".predefinedFirstName h1 span span"
        ).textContent;
        if (firstNameValue) {
          console.log("Populating givenName input with:", firstNameValue);
          populateInputField(
            "identiverse_register_step2-TEXT_FIELD-givenName-input_container-input",
            firstNameValue
          );
        }
      },
    },
    // Task to populate the lastname field
    {
      check: () => document.querySelector(".predefinedLastName h1 span span"),
      action: () => {
        const lastNameValue = document.querySelector(
          ".predefinedLastName h1 span span"
        ).textContent;
        if (lastNameValue) {
          console.log("Populating lastName input with:", lastNameValue);
          populateInputField(
            "identiverse_register_step2-TEXT_FIELD-name-input_container-input",
            lastNameValue
          );
        }
      },
    },
  ];

  observeDOMChanges(tasks);

});


// Function to insert the video container and its contents below the specified anchor
function insertVideoContainer() {
  console.log("Inserting video container below introStep1Register");
  const anchorSelector = ".introStep1Register";
  const videoContainerOptions = {
      styles: {
          width: "100%",
          maxWidth: "640px",
          margin: "auto",
          marginTop: "20px",
          marginBottom: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
      }
  };

  // Insert the video container element below the anchor using the helper function
  const videoContainer = insertElementBelowAnchor(anchorSelector, "video-container", "div", videoContainerOptions);
  if (!videoContainer) {
      console.error("Failed to insert video container.");
      return;
  }

  // Append a video element to the newly created video container
  const videoElementOptions = {
      styles: {
          maxWidth: "100%",
          margin: "auto"
      },
      attributes: {
          id: "qr-video"
      }
  };

  const videoElement = appendChildToElement("video-container", "qr-video", "video", videoElementOptions);
  if (!videoElement) {
      console.error("Failed to append video element.");
      return;
  }
}

function setupQrScannerAndPopulateInput() {
  console.log("Initializing QR Scanner");

  if (window.qrScannerInitialized) return;

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