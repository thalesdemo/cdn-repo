/**
 * The `tulip-customizer-camera.js` module provides essential utility functions for handling camera operations
 * specifically geared towards capturing selfies for facial recognition purposes during user login or registration.
 * This module facilitates direct interaction with the user's camera to capture images and provides visual feedback
 * through status images (success or error) within specified DOM containers.
 *
 * Dependencies:
 * - `populateInputField`: Imported from `tulip-customizer-commons.js`. This function is utilized to populate 
 *   form fields with image data captured from the camera, typically encoding this data in base64 format.
 *
 * Functions Provided:
 * - `requestCameraAccess(videoSelector, videoConstraints)`: Manages access to the user's camera with specific 
 *   constraints, attaching the media stream to a video element in the DOM. This function is critical in scenarios 
 *   where camera access might be denied or unavailable, handling such cases gracefully.
 *
 * - `captureImage(videoElement, inputFieldId)`: Captures a still image from the continuous video stream displayed 
 *   on the specified video element. This captured image is then processed and used to populate a designated input 
 *   field, facilitating further backend facial recognition processing.
 *
 * - `displaySuccessImage(containerId)`: Displays a success image, typically a green checkmark, within a specified 
 *   container to indicate the successful capture of a selfie suitable for facial recognition purposes. This function 
 *   also manages the UI by hiding any unnecessary video or selector elements to streamline the user interface post-operation.
 *
 * - `displayErrorImage(containerId)`: Displays an error image, usually a red 'X', within a specified container when 
 *   there is an issue with camera access or the capture process. It provides a user-friendly message advising on possible 
 *   actions to resolve the issue, such as checking camera permissions. This function also handles the UI by hiding 
 *   video elements and selectors to reduce user confusion and encourage corrective action.
 *
 * Usage:
 * This module is primarily used in web applications that require real-time facial recognition during user authentication 
 * processes. It abstracts the complexities of device access and media stream handling, offering a simplified and 
 * reusable interface for developers.
 *
 * Example Scenario:
 * - A facial recognition system used during the login or registration process of a secure web application, where 
 *   capturing a user’s selfie in real-time is crucial for identity verification.
 *
 * By centralizing camera handling and feedback mechanisms, this module promotes the maintainability and scalability 
 * of the application. It enables straightforward updates to the facial recognition process and supports enhancements 
 * of camera-based functionalities within the system.
 */
import { insertElementBelowAnchor, populateInputField } from './tulip-customizer-commons.js';


/**
 * Attempts to access the user's camera using the MediaDevices API and apply the stream to a specified video element.
 * This function logs the camera access attempt and handles both success and failure scenarios.
 *
 * @param {string} videoSelector - A CSS selector string used to locate the video element where the camera stream will be displayed.
 * @param {MediaStreamConstraints} videoConstraints - Constraints object defining the type and specific characteristics of the desired video feed.
 * 
 * Usage:
 * - This function should be called when camera access is required, typically during the initialization of features
 *   that rely on video input (e.g., QR code scanners, photo capture).
 * - `videoSelector` should uniquely identify the video element in the DOM.
 * - `videoConstraints` can specify things like resolution preferences, facing mode (user or environment for front or back camera),
 *   and other video settings.
 *
 * Behavior:
 * - Logs the attempt to find the video element and reports the outcome.
 * - Requests access to the user's camera with specified constraints and sets the video stream on the successfully found video element.
 * - If access is successful and the video element is found, the stream is started automatically.
 * - Properly handles the case where a previous stream might still be active on the video element by stopping it before applying a new stream.
 * - Errors are logged to the console, useful for debugging issues related to camera access or incorrect selectors.
 */
export async function requestCameraAccess(videoSelector, videoConstraints) {
    console.log("Checking for video element with selector:", videoSelector);
    
    const videoElement = document.querySelector(videoSelector);
    console.log("Current element:", videoElement);

    if (videoElement) {
        videoElement.setAttribute('muted', '');  // Ensure the element is muted
        videoElement.setAttribute('playsinline', '');  // Plays inline on all devices
        videoElement.autoplay = true;  // Set autoplay to true
    }

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: videoConstraints })
            .then(stream => {
                if (videoElement) {
                    // Stop any existing streams
                    if (videoElement.srcObject) {
                        const tracks = videoElement.srcObject.getTracks();
                        tracks.forEach(track => track.stop());
                        console.log("Stopped existing video tracks on the element before applying new stream.");
                    }

                    videoElement.srcObject = stream;
                    return videoElement.play();  // Returns a promise
                } else {
                    console.error("Video element not found for selector:", videoSelector);
                    return Promise.reject("Video element not found");
                }
            })
            .then(() => {
                console.log("Camera access successful, stream started.");
            })
            .catch(error => {
                console.error("Error accessing the camera or playing video:", error);
                if (error.name === 'AbortError') {
                    console.log("Retrying video playback...");
                    videoElement.play().catch(e => console.error("Retry play failed:", e));
                }
            });
    } else {
        console.error("Browser does not support getUserMedia API");
    }
}




/**
 * Captures a still image from a video stream rendered in a video element and stores the result as a base64-encoded string.
 * The captured image data is then used to populate a specified input field.
 *
 * @param {HTMLVideoElement} videoElement - The video element from which the image will be captured.
 * @param {string} inputFieldId - The ID of an input field where the captured image's base64 data will be stored.
 *
 * Usage:
 * - Typically used in applications involving identity verification, capturing profile pictures, or other instances
 *   where a still image is required from a continuous video stream.
 * - This function should be triggered by a user action, such as pressing a button to capture the image.
 *
 * Behavior:
 * - Creates a canvas element, sets its dimensions to match the video source, and draws the current video frame onto the canvas.
 * - Converts the canvas content to a JPEG image in base64 format.
 * - Populates the specified input field with the base64 string, effectively saving or transmitting the image as needed.
 */
export function captureImage(videoElement, inputFieldId) {
    const canvas = document.createElement("canvas");
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    const context = canvas.getContext("2d");

    // Adjust for mobile orientation here using an external library if necessary

    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL("image/jpeg");
    const base64Data = imageData.replace(/^data:image\/jpeg;base64,/, "");
    
    populateInputField(inputFieldId, base64Data);
}


/**
 * Displays a success image within a specified container, indicating successful completion of an operation,
 * such as successful authentication or data capture. This function also hides any video elements and selectors
 * to clear the interface post-success.
 * 
 * @param {string} containerId - The ID of the container where the success image should be displayed. This
 *                               container should be a part of the DOM and ideally should be related to the
 *                               operation leading to the success state.
 * 
 * Usage:
 * - Call this function when an operation (like scanning or uploading) completes successfully and you want to
 *   visually indicate this success to the user.
 * - This function checks for the existence of a previously displayed success image to avoid duplicates.
 * 
 * Effects:
 * - Appends a green checkmark image to the specified container.
 * - Automatically hides any video elements or selectors present in the container to streamline the user interface
 *   post-operation.
 * - Assumes the success image (`green-checkmark.svg`) is stored in a known path and uses this for the image source.
 */
export function displaySuccessImage(containerId) {
    const videoContainer = document.getElementById(containerId);
    if (!videoContainer) {
        console.error(`Container with ID '${containerId}' not found.`);
        return;
    }

    // Set the background color of the video container to white
    videoContainer.style.backgroundColor = "white";

    const existingImage = videoContainer.querySelector("img");
    if (!existingImage) {
        const checkmarkImage = document.createElement("img");
        checkmarkImage.src = "../login/ui/resources/theme/img/green-checkmark.svg";
        checkmarkImage.alt = "Success";
        checkmarkImage.style.width = "100px";
        checkmarkImage.style.height = "100px";
        checkmarkImage.style.margin = "auto";
        checkmarkImage.style.display = "block";
        videoContainer.appendChild(checkmarkImage);
    }

    const video = videoContainer.querySelector("video");
    if (video) video.style.display = "none";

    const cameraSelector = videoContainer.querySelector("select");
    if (cameraSelector) cameraSelector.style.display = "none";
}


/**
 * Displays an error image along with a message instructing the user to check their camera settings.
 * This is particularly useful in scenarios where camera access is required but not available or denied.
 * The function also hides any active video elements to focus user attention on the error message.
 *
 * @param {string} containerId - The ID of the container where the error image and message should be displayed.
 * 
 * Usage:
 * - Utilize this function in error handling routines, especially in parts of your application that depend on
 *   camera access, such as QR code scanning or facial recognition features.
 * - This function prevents duplication by only adding the error image if it isn't already present.
 * 
 * Effects:
 * - Appends a red 'X' mark image to indicate an error.
 * - Below the image, adds a text message advising the user to check their camera settings.
 * - Hides video elements and selectors within the same container to prevent further user interaction until the
 *   issue is resolved.
 * - Adopts a standard approach for the error message, using a high-contrast red color and central alignment to
 *   ensure visibility and clarity.
 */
export function displayErrorImage(containerId) {
    const videoContainer = document.getElementById(containerId);
    if (!videoContainer) {
        console.error(`Container with ID '${containerId}' not found.`);
        return;
    }

    // Set the background color of the video container to white
    videoContainer.style.backgroundColor = "white";

    const existingImage = videoContainer.querySelector("img[alt='Error']");
    if (!existingImage) {
        const errorImage = document.createElement("img");
        errorImage.src = "../login/ui/resources/theme/img/red-xmark.svg";
        errorImage.alt = "Error";
        errorImage.style.width = "100px";
        errorImage.style.height = "100px";
        errorImage.style.margin = "auto";
        errorImage.style.display = "block";
        videoContainer.appendChild(errorImage);

        const instructionParagraph = document.createElement("p");
        instructionParagraph.textContent = "Please check your camera settings and allow access.";
        instructionParagraph.style.textAlign = "center";
        instructionParagraph.style.marginTop = "20px";
        instructionParagraph.style.color = "#ff0000";
        instructionParagraph.style.fontSize = "16px";
        videoContainer.appendChild(instructionParagraph);
    }

    const video = videoContainer.querySelector("video");
    if (video) video.style.display = "none";

    const cameraSelector = videoContainer.querySelector("select");
    if (cameraSelector) cameraSelector.style.display = "none";
}


/**
 * Creates or retrieves a camera selector within a specified container.
 * This selector allows users to choose between available video input devices.
 * @param {string} containerId - The ID of the container where the selector should be placed.
 * @param {string} selectorId - Optional. The ID to assign to the selector, defaults to 'camera-selector'.
 * @returns {HTMLElement} The camera selector element, appended to the specified container.
 */
export function createCameraSelector(containerId, selectorId = "camera-selector") {
    const container = document.getElementById(containerId);
    let selector = document.getElementById(selectorId);
    if (!selector) {
        selector = document.createElement("select");
        selector.id = selectorId;
        selector.style.marginTop = "10px";
        selector.style.display = "flex";
        selector.style.margin = "auto";
        container.appendChild(selector);
    }
    return selector;
}


/**
 * Populates the camera selector with available video input options.
 * Each option corresponds to a detected video input device.
 * @param {Array} cameras - An array of camera devices obtained from media device enumeration.
 * @param {HTMLElement} selector - The selector element to populate with camera options.
 */
export function populateCameraSelector(cameras, selector) {
    selector.innerHTML = "";
    cameras.forEach((camera, index) => {
        const option = document.createElement("option");
        option.value = camera.deviceId; // Ensure you use `deviceId` which is the correct property for device identification.
        option.text = camera.label || `Camera ${index + 1}`;
        selector.appendChild(option);
    });
}


/**
 * Sets up a listener on the camera selector to switch the video stream when a different camera is selected.
 * This function is vital for applications that need dynamic video source switching.
 * @param {HTMLElement} selector - The camera selector element.
 * @param {function} onCameraChange - Callback function that handles camera change.
 */
export function setupCameraChangeListener(selector, onCameraChange) {
    selector.removeEventListener("change", selector.changeListener);
    selector.changeListener = () => {
        onCameraChange(selector.value);
    };
    selector.addEventListener("change", selector.changeListener);
}


/**
 * Sets up a camera selector and manages camera access for a specified video element.
 * This function is adaptable for various uses where camera selection and streaming are needed.
 *
 * @param {string} containerId - The ID of the container where the camera selector will be placed.
 * @param {string} videoElementId - The ID of the video element that will display the camera stream.
 */
export function setupCameraSelector(containerId, videoElementId) {
    const videoElement = document.getElementById(videoElementId);
    if (!videoElement) {
        console.error("Video element or stream not found:", videoElementId);
        return;
    }

    insertElementBelowAnchor('#' + containerId, "div-button-selector", "div");
    const cameraSelector = createCameraSelector("div-button-selector");

    // Enumerate devices to populate the selector
    navigator.mediaDevices.enumerateDevices()
        .then(devices => {
            const cameras = devices.filter(device => device.kind === 'videoinput');
            populateCameraSelector(cameras, cameraSelector);
            setupCameraChangeListener(cameraSelector, selectedDeviceId => {
                // Apply new camera selection
                const updatedConstraints = {
                    video: { deviceId: { exact: selectedDeviceId },
                        width: { ideal: 700 },
                        height: { ideal: 500 }  }
                };

                navigator.mediaDevices.getUserMedia(updatedConstraints)
                    .then(newStream => {
                        videoElement.srcObject.getTracks().forEach(track => track.stop()); // Stop the current stream
                        videoElement.srcObject = newStream;
                        videoElement.play();
                    })
                    .catch(error => {
                        console.error("Failed to switch camera:", error);
                    });
            });
            if (cameras.length <= 1) {
                cameraSelector.style.display = "none"; // Hide selector if only one camera is available
            }
        })
        .catch(error => {
            console.error("Error enumerating devices:", error);
        });
}
