
import { populateInputField, observeDOMChanges, insertElementBelowAnchor, appendChildToElement } from '../utils/tulip-customizer-commons.js';
import { initializeQrScanner } from '../utils/tulip-qr-scanner.js';

let qrScannerInitialized = false;

export function setupBadgeSystem(config) {

    // QR Configuration object
    const qrConfig = {
        videoElementId: config.video.elementId,
        containerId: config.video.containerId,
        qrRegexPattern: new RegExp(config.interaction.qrRegexPattern),
        successImageContainerId: config.video.containerId,
        failureImageContainerId: config.video.containerId,
        submitButtonId: config.domSelectors.step1Selectors.submitButtonId,
        submitButtonDelay: config.interaction.submitButtonDelay,
        fields: {
            userName: config.domSelectors.step1Selectors.userNameId,
            firstName: config.domSelectors.step1Selectors.firstNameId,
            lastName: config.domSelectors.step1Selectors.lastNameId
        }
    };

    // Wait for the DOM to be fully loaded
    document.addEventListener("DOMContentLoaded", function () {
      console.log("DOM loaded and parsed.");
    
      // Define tasks to be executed based on certain conditions
      const tasks = [
          {
              check: () =>
                  document.querySelector(config.domSelectors.registerStep1Anchor) &&
                  !document.querySelector("#" + config.video.containerId),
              action: () => { 
                insertVideoContainer(config)
              }
          },
          {
              check: () =>
                  document.getElementById(config.video.elementId) && !qrScannerInitialized,
              action: () =>  { 
                setupQrScannerAndPopulateInput(qrConfig)
              }
          },
          {
              check: () => document.querySelector(config.domSelectors.step2Selectors.predefinedFirstName),
              action: () => {
                  const firstNameValue = document.querySelector(config.domSelectors.step2Selectors.predefinedFirstName).textContent;
                  if (firstNameValue) {
                      console.log("Populating givenName input with:", firstNameValue);
                      populateInputField(
                          config.domSelectors.step2Selectors.firstNameId,
                          firstNameValue
                      );
                  }
              },
          },
          {
              check: () => document.querySelector(config.domSelectors.step2Selectors.predefinedLastName),
              action: () => {
                  const lastNameValue = document.querySelector(config.domSelectors.step2Selectors.predefinedLastName).textContent;
                  if (lastNameValue) {
                      console.log("Populating lastName input with:", lastNameValue);
                      populateInputField(
                          config.domSelectors.step2Selectors.lastNameId,
                          lastNameValue
                      );
                  }
              },
          }
      ];
    
      observeDOMChanges(tasks);
    });
    
};

// Function to insert the video container and its contents below the specified anchor
function insertVideoContainer(config) {
  console.log("Inserting video container below the register step 1 anchor");
  const anchorSelector = config.domSelectors.registerStep1Anchor; // Updated to use constant
  const videoContainerOptions = {
      styles: { 
        ...config.video.styles.container
       }
  };

  // Insert the video container element below the anchor using the helper function
  const videoContainer = insertElementBelowAnchor(anchorSelector, config.video.containerId, "div", videoContainerOptions);
  if (!videoContainer) {
      console.error("Failed to insert video container.");
      return;
  }

  // Append a video element to the newly created video container
  const videoElementOptions = {
      styles: {
        ...config.video.styles.element
      },
      attributes: {
          id: config.video.elementId // Used constant for ID
      }
  };

  const videoElement = appendChildToElement(config.video.containerId, config.video.elementId, "video", videoElementOptions);
  if (!videoElement) {
      console.error("Failed to append video element.");
      return;
  }
}

function setupQrScannerAndPopulateInput(qrConfig) {
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
  }

  qrScannerInitialized = true;

}
