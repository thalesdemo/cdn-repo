// tulip-qr-scanner.js

import QrScanner from '../ext/qr-scanner/1.4.2/qr-scanner.min.js';  // Ensure QrScanner is appropriately imported
import { populateInputField, clickButtonById, insertElementBelowAnchor } from './tulip-customizer-commons.js';
import { displaySuccessImage, displayErrorImage, setupCameraSelector, setupCameraSelectorLegacyImpl } from './tulip-customizer-camera.js';


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
        setupCameraSelectorLegacyImpl(config.containerId, config.videoElementId);
        

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