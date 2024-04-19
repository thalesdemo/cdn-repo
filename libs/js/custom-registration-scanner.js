import { clickButtonById, populateInputField, observeDOMChanges, insertElementBelowAnchor, appendChildToElement } from './tulip-customizer-commons.js';
import { displaySuccessImage, displayErrorImage } from './tulip-customizer-camera.js';
import { initializeQrScanner } from './tulip-qr-scanner.js';

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

  const qrScanner = initializeQrScanner("qr-video", "video-container", (result) => {
      console.log("QR Code detected:", result.data);
      handleQrResult(result.data);
  });

  if (!qrScanner) {
      console.error("Failed to initialize the QR scanner.");
      return;
  }

  window.qrScannerInitialized = true;
}

function handleQrResult(qrData) {
  const pattern = /^user:\/\/identiverse\?id=([^&]+)(&firstname=([^&]*))?(&lastname=([^&]*))?/;
  const match = qrData.match(pattern);

  if (match) {
      console.log("QR Code contains expected data. Stopping scanner...");
      populateInputFieldsFromQrData(match);
      displaySuccessImage("video-container");
      setTimeout(() => {
          clickButtonById("identiverse_register_step1-submit-Submit-button_container");
      }, 1500);
  } else {
      console.log("QR Code does not contain expected data. Continuing to scan...");
  }
}

function populateInputFieldsFromQrData(match) {
  // Assuming `match` follows the structure from the regex pattern
  // match[1]: ID
  // match[3]: Firstname (optional)
  // match[5]: Lastname (optional)

  // Populate the userName input field with the extracted ID
  if (match[1]) {
      console.log("Extracted ID:", match[1]);
      populateInputField(
          "identiverse_register_step1-TEXT_FIELD-userName-input_container-input",
          match[1]
      );
  }

  // Check if firstName is present in the match and populate it
  if (match[3]) {
      const firstName = decodeURIComponent(match[3]);
      console.log("Extracted firstName:", firstName);
      populateInputField(
          "identiverse_register_step1-TEXT_FIELD-firstName-input_container-input",
          firstName
      );
  }

  // Check if lastName is present in the match and populate it
  if (match[5]) {
      const lastName = decodeURIComponent(match[5]);
      console.log("Extracted lastName:", lastName);
      populateInputField(
          "identiverse_register_step1-TEXT_FIELD-lastName-input_container-input",
          lastName
      );
  }
}
