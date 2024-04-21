// Import utilities
import { observeDOMChanges, insertElementBelowAnchor, appendChildToElement } from '../utils/tulip-customizer-commons.js';
import { requestCameraAccess, captureImage, setupCameraSelector } from '../utils/tulip-customizer-camera.js';

const DELAY_RESIZE_OBSERVER = 1500; // Delay in milliseconds to wait before resizing the canvas
let globalCanvas; // Global canvas variable

export function setupCameraSystem(config) {
    document.addEventListener("DOMContentLoaded", function () {
        const tasks = [
            {
                check: () => document.querySelector(config.anchorClass) && !document.querySelector(`#${config.videoContainerId}`),
                action: () => setupVideoAndButton(config)
            }
        ];

        observeDOMChanges(tasks);
    });
}

function setupVideoAndButton(config) {
    const videoContainer = insertElementBelowAnchor(config.anchorClass, config.videoContainerId, "div", {styles: config.videoContainerStyles});
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

    videoElement.addEventListener('loadedmetadata', () => {
        loadFaceApiModels().then(() => {
            setupFaceDetection(videoElement, config);
        }).catch(error => {
            console.error('Error during model loading:', error);
        });
    });

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
    requestCameraAccess(`#${config.videoElementId}`, config.videoConstraints);
    setupCameraSelector(config.videoContainerId, config.videoElementId);
}

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

function setupFaceDetection(videoElement, config) {
    console.log("Video metadata loaded. Setting up face detection...");
    const canvas = faceapi.createCanvasFromMedia(videoElement);
    canvas.styles.position = 'absolute';
    document.getElementById(config.videoContainerId).appendChild(canvas);
    globalCanvas = canvas; // Assign to global variable
    const displaySize = { width: videoElement.videoWidth, height: videoElement.videoHeight };
    console.log("Webcam display size:", displaySize);
    faceapi.matchDimensions(canvas, displaySize);
    // observeContainerResize(config.videoElementId);
    console.log("Video stream is playing. Starting detection...");
    detectFaces(videoElement, displaySize);
}

function detectFaces(videoElement, displaySize) {
    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(videoElement, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        globalCanvas.getContext('2d').clearRect(0, 0, globalCanvas.width, globalCanvas.height);
        faceapi.draw.drawDetections(globalCanvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(globalCanvas, resizedDetections);
        faceapi.draw.drawFaceExpressions(globalCanvas, resizedDetections);
    }, 100);
}

function observeContainerResize(elementId) {
    const webcamContainer = document.getElementById(elementId);
    let resizeTimeout;

    const resizeObserver = new ResizeObserver((entries) => {
        if (resizeTimeout) clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            entries.forEach(entry => {
                const { width, height } = entry.contentRect;
                const displaySize = { width, height };
                // if (globalCanvas) {
                //     document.getElementById(elementId).removeChild(globalCanvas);
                // }

                faceapi.matchDimensions(globalCanvas, displaySize);
                // console.log("Updated webcam display size to:", displaySize);
                // setupFaceDetection(document.getElementById(config.videoElementId), config);
            });
        }, DELAY_RESIZE_OBSERVER);
    });

    resizeObserver.observe(webcamContainer);
}
