// Import utilities
import { observeDOMChanges, insertElementBelowAnchor, appendChildToElement } from '../utils/tulip-customizer-commons.js';
import { requestCameraAccess, captureImage, setupCameraSelector } from '../utils/tulip-customizer-camera.js';


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

    // Load models and then enable camera access and face detection
    loadFaceApiModels().then(() => {
        requestCameraAccess(`#${config.videoElementId}`, config.videoConstraints);
        setupCameraSelector(config.videoContainerId, config.videoElementId);
        startFaceDetection(videoElement); // Start face detection after models are loaded
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

function startFaceDetection(videoElement) {
    videoElement.addEventListener('playing', () => {
        console.log("Video stream is playing. Starting detection...")
        const canvas = faceapi.createCanvasFromMedia(videoElement);
        document.body.append(canvas);
        const displaySize = { width: videoElement.videoWidth, height: videoElement.videoHeight };
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
