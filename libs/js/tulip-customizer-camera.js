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
