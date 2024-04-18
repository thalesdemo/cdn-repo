// Constants
const ANCHOR_CLASS = ".Step1PurchaseAnchorJS";
const VIDEO_CONTAINER_ID = "video-container";
const VIDEO_ELEMENT_ID = "video-element";
const CAPTURE_BUTTON_ID = "capture-button";
const USER_IMAGE_INPUT_ID = "identiverse_purchase_step1-TEXT_FIELD-userImage-input_container-input";

// Import utilities
import { observeDOMChanges, insertElementBelowAnchor } from './tulip-customizer-commons.js';
import { requestCameraAccess, captureImage } from './tulip-customizer-camera.js';

document.addEventListener("DOMContentLoaded", function () {
    const videoConstraints = {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        facingMode: "user" // or 'environment' to use the rear camera
    };

    const tasks = [
        {
            check: () => document.querySelector(ANCHOR_CLASS) && !document.querySelector(`#${VIDEO_CONTAINER_ID}`),
            action: () => setupVideoAndButton(ANCHOR_CLASS, videoConstraints)
        }
    ];

    observeDOMChanges(tasks);
});


function setupVideoAndButton(anchorClass, videoConstraints) {
  // Create video container
  const videoContainer = insertElementBelowAnchor(anchorClass, VIDEO_CONTAINER_ID, "div", {
      styles: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
      }
  });

  // Check if the video container was created successfully
  if (!videoContainer) {
      console.error("Failed to create video container.");
      return;
  }

  // Create video element within the container
  const videoElement = insertElementBelowAnchor(`#${VIDEO_CONTAINER_ID}`, VIDEO_ELEMENT_ID, "video", {
      attributes: {
          autoplay: true,
          playsinline: true
      },
      styles: {
          width: "100%"
      }
  });

  
  if (!videoElement) {
    console.error("Failed to create video element.");
    return;
  }

  // Ensure the element is in the DOM
  console.log("Video element status in DOM:", document.getElementById(VIDEO_ELEMENT_ID));


  // If all elements are ready, request camera access
  requestCameraAccess(`#${VIDEO_ELEMENT_ID}`, videoConstraints);

  // Create capture button within the container
  const captureButton = insertElementBelowAnchor(`#${VIDEO_ELEMENT_ID}`, CAPTURE_BUTTON_ID, "button", {
      content: "Capture Image",
      styles: {
          display: "block",
          margin: "10px auto",
          padding: "10px 20px",
          border: "1px solid #000",
          borderRadius: "5px",
          backgroundColor: "#f0f0f0",
          cursor: "pointer",
          fontWeight: "bold",
          color: "#000",
          textTransform: "uppercase",
          fontSize: "14px",
          outline: "none",
          transition: "background-color 0.3s"
      },
      eventListeners: [
          {
              type: "mouseover",
              handler: function () { this.style.backgroundColor = "#e0e0e0"; }
          },
          {
              type: "mouseout",
              handler: function () { this.style.backgroundColor = "#f0f0f0"; }
          },
          {
              type: "click",
              handler: () => captureImage(videoElement, USER_IMAGE_INPUT_ID)
          }
      ]
  });

  // Check if the capture button was created successfully
  if (!captureButton) {
      console.error("Failed to create capture button.");
      return;
  }

}
