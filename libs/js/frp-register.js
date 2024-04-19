// Constants
const ANCHOR_CLASS = ".Step1PurchaseAnchorJS";
const VIDEO_CONTAINER_ID = "video-container";
const VIDEO_ELEMENT_ID = "video-element";
const CAPTURE_BUTTON_ID = "capture-button";
const USER_IMAGE_INPUT_ID = "identiverse_purchase_step1-TEXT_FIELD-userImage-input_container-input";

// Import utilities
import { observeDOMChanges, insertElementBelowAnchor, appendChildToElement } from './tulip-customizer-commons.js';
import { requestCameraAccess, captureImage } from './tulip-customizer-camera.js';

document.addEventListener("DOMContentLoaded", function () {
    const videoConstraints = {
        width: { ideal: 800 },
        height: { ideal: 800 },
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
    const videoContainer = insertElementBelowAnchor(anchorClass, VIDEO_CONTAINER_ID, "div");
    if (!videoContainer) return;

    // Append video element as a child of the video container
    const videoElement = appendChildToElement(VIDEO_CONTAINER_ID, VIDEO_ELEMENT_ID, "video", {
        attributes: {
            autoplay: true,
            playsinline: true
        }
    });
    if (!videoElement) return;

    // Append capture button as a child of the video container
    const captureButton = appendChildToElement(VIDEO_CONTAINER_ID, CAPTURE_BUTTON_ID, "button", {
        content: "Capture Image",
        eventListeners: [
            {
                type: "click",
                handler: () => captureImage(videoElement, USER_IMAGE_INPUT_ID)
            }
        ]
    });
    if (!captureButton) return;

    requestCameraAccess(`#${VIDEO_ELEMENT_ID}`, videoConstraints);
}
