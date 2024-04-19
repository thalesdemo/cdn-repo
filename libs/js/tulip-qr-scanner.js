// tulip-qr-scanner.js

import QrScanner from './qr-scanner.min.js';  // Ensure QrScanner is appropriately imported
import { populateInputField, clickButtonById } from './tulip-customizer-commons.js';
import { displaySuccessImage, displayErrorImage, setupCameraSelector } from './tulip-customizer-camera.js';

// /**
//  * Creates or retrieves a camera selector within a specified container.
//  * @param {string} containerId - The ID of the container where the selector should be placed.
//  * @param {string} selectorId - The ID to assign to the selector.
//  * @returns {HTMLElement} The camera selector element.
//  */
// export function createCameraSelector(containerId, selectorId = "camera-selector") {
//     const videoContainer = document.getElementById(containerId);
//     let cameraSelector = document.getElementById(selectorId);
//     if (!cameraSelector) {
//         cameraSelector = document.createElement("select");
//         cameraSelector.id = selectorId;
//         cameraSelector.style.marginTop = "10px";
//         videoContainer.appendChild(cameraSelector);
//     }
//     return cameraSelector;
// }

// /**
//  * Populates a given selector with camera options.
//  * @param {Array} cameras - An array of camera objects.
//  * @param {HTMLElement} selector - The selector to populate.
//  */
// export function populateCameraSelector(cameras, selector) {
//     selector.innerHTML = "";  // Clear existing options
//     cameras.forEach((camera, index) => {
//         const option = document.createElement("option");
//         option.value = camera.id;
//         option.text = camera.label || `Camera ${index + 1}`;
//         selector.appendChild(option);
//     });
// }

// /**
//  * Sets up a change listener on the camera selector.
//  * @param {HTMLElement} selector - The camera selector element.
//  * @param {QrScanner} qrScanner - The QR scanner instance.
//  */
// export function setupCameraChangeListener(selector, qrScanner) {
//     selector.removeEventListener("change", selector.changeListener);
//     selector.changeListener = () => {
//         qrScanner.setCamera(selector.value).catch(console.error);
//         console.log("Camera switched to:", selector.value);
//     };
//     selector.addEventListener("change", selector.changeListener);
// }

/**
 * Sets the initial camera based on the available cameras.
 * @param {Array} cameras - An array of available camera objects.
 * @param {HTMLElement} selector - The camera selector element.
 * @param {QrScanner} qrScanner - The QR scanner instance.
 */
export function setInitialCamera(cameras, selector, qrScanner) {
    if (cameras.length > 0) {
        qrScanner.setCamera(cameras[0].id).then(() => {
            selector.value = cameras[0].id;
            console.log("Default camera set:", cameras[0].label);
        }).catch(console.error);
    }
}


/**
 * Initializes the QR scanner and handles all related setup.
 * @param {string} videoElementId - ID of the video element for the QR scanner.
 * @param {string} containerId - ID of the container for placing the camera selector.
 * @param {function} resultHandler - Callback function to handle QR scan results.
 */

export function initializeQrScanner(config) {
    const video = document.getElementById(config.videoElementId);
    if (!video) {
        console.error("Video element not found:", config.videoElementId);
        return;
    }

    const qrScanner = new QrScanner(video, result => handleQrResult(result.data, config), {
        highlightScanRegion: true,
        highlightCodeOutline: true,
    });

    return qrScanner.start().then(() => {
        return QrScanner.listCameras(true);
    }).then(cameras => {
        // Set up the camera selector and handle camera changes
        setupCameraSelector(config.containerId, config.videoElementId);
        

    }).catch(err => {
        displayErrorImage(config.failureImageContainerId);
        console.error("Error starting the scanner:", err);
    });
}

function handleQrResult(qrData, config) {
    const pattern = config.qrRegexPattern;
    const match = qrData.match(pattern);

    if (match) {
        console.log("QR Code contains expected data.");
        populateInputFieldsFromQrData(match, config);
        displaySuccessImage(config.successImageContainerId);
        setTimeout(() => {
            clickButtonById(config.submitButtonId);
        }, config.submitButtonDelay);
    } else {
        console.log("Continuing to scan...");
    }
}

function populateInputFieldsFromQrData(match, config) {
    if (match[1]) {
        populateInputField(config.fields.userName, match[1]);
    }
    if (match[3]) {
        populateInputField(config.fields.firstName, decodeURIComponent(match[3]));
    }
    if (match[5]) {
        populateInputField(config.fields.lastName, decodeURIComponent(match[5]));
    }
}