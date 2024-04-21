// Import utilities
import { observeDOMChanges, insertElementBelowAnchor, appendChildToElement } from '../utils/tulip-customizer-commons.js';
import { requestCameraAccess, captureImage, setupCameraSelector } from '../utils/tulip-customizer-camera.js';

const DELAY_RESIZE_OBSERVER = 1500; // Delay in milliseconds to wait before resizing the canvas
let canvas;

export function setupCameraSystem(config) {
    const videoContainerOptions = {
        styles: config.videoContainerStyles
    };

    document.addEventListener("DOMContentLoaded", function () {
        const tasks = [
            {
                check: () => document.querySelector(config.anchorClass) && !document.querySelector(`#${config.videoContainerId}`),
                action: () => setupVideoAndButton(config, videoContainerOptions)
            }
        ];

        observeDOMChanges(tasks);
    });
}

function setupVideoAndButton(config, videoContainerOptions) {
    const videoContainer = insertElementBelowAnchor(config.anchorClass, config.videoContainerId, "div", videoContainerOptions);
    const captureButtonContainer = insertElementBelowAnchor("#" + config.videoContainerId, "div-capture-image", "div");

    if (!videoContainer) return;

    const videoElement = appendChildToElement(config.videoContainerId, config.videoElementId, "video", {
        styles: {
            width: '100%',
            height: '100%',
            objectFit: 'cover'
        },
        attributes: {
            autoplay: true,
            playsinline: true
        }
    });

    if (!videoElement) return;

    const captureButton = appendChildToElement("div-capture-image", config.captureButtonId, "button", {
        content: "Capture Image",
        eventListeners: [
            {
                type: "click",
                handler: () => captureImage(videoElement, config.userImageInputId)
            }
        ]
    });

    if (!captureButton) return;
    requestCameraAccess(`#${config.videoElementId}`, config.videoConstraints).then(() => {
            setupCameraSelector(config.videoContainerId, config.videoElementId);
            console.log("Selector setup complete");
    });
    // Load models and then enable camera access and face detection
    loadFaceApiModels().then(() => {
        // observeContainerResize(config.videoContainerId);
        startFaceDetection(videoElement, config); // Start face detection after models are loaded
    }).catch(error => {
        console.error('Error during model loading or camera setup:', error);
    });
}

// Define a function to load face-api models
export async function loadFaceApiModels() {
    try {
        await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri('https://cdn.onewelco.me/libs/js/face-api/models/'),
            faceapi.nets.faceLandmark68Net.loadFromUri('https://cdn.onewelco.me/libs/js/face-api/models/'),
            faceapi.nets.faceRecognitionNet.loadFromUri('https://cdn.onewelco.me/libs/js/face-api/models/'),
            faceapi.nets.faceExpressionNet.loadFromUri('https://cdn.onewelco.me/libs/js/face-api/models/')
        ]);
        console.log('Face-API models loaded successfully');
    } catch (error) {
        console.error('Failed to load Face-API models:', error);
        throw error; // Rethrow to ensure calling function can handle the failure
    }
}

function startFaceDetection(videoElement, config) {
    videoElement.addEventListener('playing', () => {
        console.log("Video stream is playing. Starting detection...")
        canvas = faceapi.createCanvasFromMedia(videoElement);
        const videoContainer = document.getElementById(config.videoContainerId)
        videoContainer.append(canvas);
        const displaySize = { width: videoElement.videoWidth, height: videoElement.videoHeight };
        console.log("set faceapi canvas size to:", displaySize);
        faceapi.matchDimensions(canvas, displaySize);
    
        setInterval(async () => {
            const detections = await faceapi.detectAllFaces(videoElement, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
            const resizedDetections = faceapi.resizeResults(detections, displaySize);
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
            faceapi.draw.drawDetections(canvas, resizedDetections);
            faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
            faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
        }, 100);
    });
}

function observeContainerResize(elementId) {
    const webcamContainer = document.getElementById(elementId);
    let resizeTimeout; // Declare a variable outside of the resize event handler
  
    const resizeObserver = new ResizeObserver((entries) => {
      if (resizeTimeout) clearTimeout(resizeTimeout); // Clear the previous timeout
      resizeTimeout = setTimeout(() => {
        // Set a new timeout
        console.log("resize observer called");
        // if (!initialized) {
        //   // webcam.updateConstraints();
        //   console.log("camera initialization complete");
        //   initialized = true;
        //   return;
        // }
        entries.forEach((entry) => {
          const { width, height } = entry.contentRect;
          const element = document.getElementById(elementId);
          faceapi.matchDimensions(canvas, { width: element.videoWidth, height: element.videoHeight});
        //   if (canvas) {
        //     document.getElementById(elementId).removeChild(canvas); // Remove the existing canvas
        //   }
        //   displaySize = { width, height }; // Update the display size based on the new dimensions
        //   console.log("set webcam display size to:", displaySize);
        //   createCanvas(); // Create a new canvas
        //   startDetection(); // Restart face detection
        });
        //webcam.updateConstraints();
      }, DELAY_RESIZE_OBSERVER);
    });
  
    resizeObserver.observe(webcamContainer);
  }