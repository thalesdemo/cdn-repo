// tulip-customizer-camera.js
import { populateInputField } from './tulip-customizer-commons.js';

export function requestCameraAccess(videoSelector, videoConstraints) {
    console.log("Checking for video element with selector:", videoSelector);
    console.log("Current element:", document.querySelector(videoSelector));
    
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: videoConstraints })
            .then(stream => {
                const video = document.querySelector(videoSelector);
                if (video) {
                    video.srcObject = stream;
                    video.play();
                } else {
                    console.error("Video element not found");
                }
            })
            .catch(error => {
                console.error("Error accessing the camera:", error);
            });
    } else {
        console.error("Browser does not support getUserMedia API");
    }
}

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
 * Displays a success image within a specified container and hides unnecessary video elements.
 * @param {string} containerId - The ID of the container where the success image should be displayed.
 */
export function displaySuccessImage(containerId) {
    const videoContainer = document.getElementById(containerId);
    if (!videoContainer) {
        console.error(`Container with ID '${containerId}' not found.`);
        return;
    }

    // Check for an existing image and only append if there isn't one
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

    // Hide the video element and any camera selector within the specified container
    const video = videoContainer.querySelector("video");
    if (video) video.style.display = "none";

    const cameraSelector = videoContainer.querySelector("select");
    if (cameraSelector) cameraSelector.style.display = "none";
}



/**
 * Displays an error image within a specified container and optionally hides video elements.
 * @param {string} containerId - The ID of the container where the error image should be displayed.
 */
export function displayErrorImage(containerId) {
    const videoContainer = document.getElementById(containerId);
    if (!videoContainer) {
        console.error(`Container with ID '${containerId}' not found.`);
        return;
    }

    // Check for an existing error image to prevent multiple insertions
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
    }

    // Hide the video element and any camera selector within the container
    const video = videoContainer.querySelector("video");
    if (video) video.style.display = "none";

    const cameraSelector = videoContainer.querySelector("select");
    if (cameraSelector) cameraSelector.style.display = "none";
}