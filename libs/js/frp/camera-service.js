// Import utilities
import { observeDOMChanges, insertElementBelowAnchor, appendChildToElement, clickButtonById } from '../utils/tulip-customizer-commons.js';
import { requestCameraAccess, captureImage, setupCameraSelector } from '../utils/tulip-customizer-camera.js';
// import { startCountdown } from './animation.js';
import { DetectionScoreManager } from './detection-score-manager.js';

let canvas; /* Canvas element for drawing face detection results */
let scanIntervalId; /* Interval ID for face detection (to handle setInterval) */
let scoreManager; /* DetectionScoreManager instance for managing detection scores */

export function setupCameraSystem(config) {
    const videoContainerOptions = {
        styles: config.videoContainerStyles
    };

    scoreManager = new DetectionScoreManager(
        config.faceApiFeatures.countdownDuration * 1000 / config.faceApiFeatures.detectionInterval,  // sampleSize: Total number of samples to evaluate for final action
        config.faceApiFeatures.detectionThreshold,    // threshold: Minimum score considered good
        config.faceApiFeatures.badScore.windowSize,     // recentWindow: Number of recent samples to check for bad score threshold
        config.faceApiFeatures.badScore.maxBadScoreInWindow,  // maxBadScoresInWindow: Maximum number of bad scores allowed in the recent window
        config.fontSize // Pass font size configuration
    );

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
    if (!videoContainer) return;

    /* Create an animation container (countdown, multiple faces, poor score, etc.) */
    const animationContainer = appendChildToElement(config.videoContainerId, "animation-container", "div", {});
    if (!animationContainer) return;

    /* Create a video element for the camera feed */
    const videoElement = appendChildToElement(config.videoContainerId, config.videoElementId, "video", {
        styles: {
            width: '100%',
            height: '100%',
            objectFit: 'contain'
        },
        attributes: {
            autoplay: true,
            playsinline: true
        }
    });
    if (!videoElement) return;

    /* Create a button to capture an image manually (this will be removed in later versions in favor of a keystroke listener) */
    // const captureButtonContainer = insertElementBelowAnchor("#" + config.videoContainerId, "div-capture-image", "div");
    // const captureButton = appendChildToElement("div-capture-image", config.captureButtonId, "button", {
    //     content: "Capture Image",
    //     eventListeners: [
    //         {
    //             type: "click",
    //             handler: () => captureImage(videoElement, config.userImageInputId)
    //         }
    //     ]
    // });
    // if (!captureButton) return;

    /* Load the camera and request access */
    const cameraAccess = requestCameraAccess(`#${config.videoElementId}`, config.videoConstraints).then(() => {
        return new Promise((resolve) => {
            videoElement.onloadedmetadata = () => {
                console.log("Camera metadata loaded");
                videoElement.onplaying = () => {
                    resolve();
                    console.log("Video is now playing");
                };
            };
        });
    });

    /* In parallel, load the face-api models */
    const modelLoading = loadFaceApiModels(config);

    /* Once both the camera and models are ready, set up the camera selector and start face detection
     * Note: The camera selector is only set up if there are multiple cameras available and could not
     *       be setup before permissions were granted (browser dependent/for privacy) **/
    Promise.all([cameraAccess, modelLoading]).then(() => {

        /* Setup the camera selector */
        setupCameraSelector(config.videoContainerId, config.videoElementId, config.videoConstraints);
        
        /* Create the canvas for face detection */
        createCanvas(config.videoContainerId, videoElement);

        /* Check if the screen width is less than 744px */
        if (window.innerWidth < config.mobileWidth) {
            /* Call mobileCameraSetup if the display is less than 744px wide */
            mobileCameraSetup(videoElement, config);
        }
    
        /* Start face detection */
        startFaceDetection(videoElement, config); // Start face detection
    
    }).catch(error => {
        console.error('Error during model loading or camera setup:', error);
    });
}


/* To improve logic, used for fullscreen on mobile devices only */
function mobileCameraSetup(videoElement, config) {
    if (!videoElement) return;
    console.log('Entered mobile camera setup with browser dimensions', `${window.innerWidth} x ${window.innerHeight}`)
    
    /* Half the font-size for animations in mobile */
    console.log("Initial fontSizeConfig:", scoreManager.fontSizeConfig);
    
    Object.keys(scoreManager.fontSizeConfig).forEach(key => {
        let value = scoreManager.fontSizeConfig[key];
        console.log(`Current value for ${key}:`, value);  // Log current value
    
        // Extract the number from the string (assuming format is like "328px")
        let numericValue = parseInt(value, 10); // Parse integer from the beginning of the string
    
        if (!isNaN(numericValue)) {
            // Halve the numeric value and append 'px' back to it
            scoreManager.fontSizeConfig[key] = (numericValue / 2) + 'px';
        } else {
            console.error(`Value for ${key} could not be converted to a number:`, value);
        }
    });
    
    console.log("Modified fontSizeConfig:", scoreManager.fontSizeConfig);

    /* Lock the screen orientation */
    // if (screen.orientation.type === 'portrait-primary' || screen.orientation.type === 'portrait-secondary') {
    //     screen.orientation.lock();
    //     console.log("Screen orientation locked to portrait:", screen.orientation.type)
    // }
    // else {
    //     screen.orientation.lock('portrait');
    //     console.log("Screen orientation set and locked to portrait:", screen.orientation.type)
    // }
    
    /* Get the video container and body elements */
    const videoContainer = document.getElementById(config.videoContainerId);
    var body = document.body;
    var paperClass = document.getElementsByClassName('overlay-content')[0];
   
    /* Move the videoContainer to be the first child of the body */
    body.insertBefore(videoContainer, body.firstChild);

    /* Hide paperClass, effectively the entire 1W page */
    paperClass.style.display = 'none';

    /* Apply simulated fullscreen style to videoContainer */
    videoContainer.classList.add('simulated-fullscreen');

    /* Calculate the top value for the videoContainer */
    var topValue = (window.innerHeight - 650) / 2;

    /* Set the top value of the videoContainer */
    videoContainer.style.top = `${topValue}px`;

    /* Set the background color of the body to black */
    body.style.backgroundColor = 'black'; 
    
    /* Set the video element styles */
    videoElement.style.objectFit = 'cover';
}


function createCanvas(videoContainerId, videoElement) {
    if (document.getElementsByTagName("canvas").length == 0) {
            console.log("Creating canvas...");
            canvas = faceapi.createCanvasFromMedia(videoElement);
            canvas.id = "overlayCanvas";
            document.getElementById(videoContainerId).append(canvas);
            console.log("Canvas created!");
            const videoContainer = document.getElementById(videoContainerId);
            const displaySize = { width: videoContainer.offsetWidth, height: videoContainer.offsetHeight };
            console.log("Set dimensions in createCanvas to width:", displaySize.width, "height:", displaySize.height);
            faceapi.matchDimensions(canvas, displaySize);
    }
}

/* Function to load the face-api models */
export async function loadFaceApiModels(config) {
    try {
        await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri(config.faceApiFeatures.modelPath),
            faceapi.nets.faceLandmark68Net.loadFromUri(config.faceApiFeatures.modelPath),
            faceapi.nets.faceRecognitionNet.loadFromUri(config.faceApiFeatures.modelPath),
            faceapi.nets.faceExpressionNet.loadFromUri(config.faceApiFeatures.modelPath),
            faceapi.nets.ageGenderNet.loadFromUri(config.faceApiFeatures.modelPath)
        ]).then(function () {
            console.log('Face-API models loaded successfully');
        });
    } catch (error) {
        console.error('Failed to load Face-API models:', error);
        throw error; // Rethrow to ensure calling function can handle the failure
    }
}


function startFaceDetection(videoElement, config) {
    /* Function to start face detection, which sets a scan interval to detect faces, based on the configuration parameter 
     * @param {HTMLVideoElement} videoElement - The video element to use for face detection
     * @param {Object} config - The configuration object for the camera system
     * @returns {void}
     * 
     * Note: The function uses setInterval to repeatedly scan for faces at a specified interval, drawing the results 
     * on the canvas and checking for high-scoring detections to trigger image capture and submission.
     *
     * TODO: The function also checks for multiple faces detected and stops the detection if more than one face is detected.
     * TODO: The function also checks for the detection score and stops the detection if the score is below the threshold 
     * after 1 second of not detecting a face above the threshold.
    **/
    console.log("Starting detection...");

    /* Set the scan interval to detect faces */
    scanIntervalId = setInterval(async () => {

        /* Detect faces using the TinyFaceDetector with landmarks, expressions, ... */
        const detections = await faceapi
        .detectAllFaces(videoElement, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions()
        .withAgeAndGender();

        /* Clear the canvas before drawing new detections */
        clearCanvas();

        handleScoreDetections(detections, config);

        if(detections) {
            const resizedDetections = resizeResults(detections, config);
            drawFeaturesOnCanvas(resizedDetections, config);
        }

    }, config.faceApiFeatures.detectionInterval);

}


function handleScoreDetections(detections, config) {
    const isMultiple = detections.length != 1;
    const score = detections.length ? Math.max(...detections.map(det => det.detection.score)) : 0;

    const isNewHigh = scoreManager.addDetection(score, isMultiple);

    if (!scoreManager.evaluateScores()) {
        console.log("Poor quality detections recently, resetting.");
        scoreManager.resetAll();
        return;
    }

    if (isNewHigh) {
        console.log("New high detected with score:", score);
        const videoElement = document.getElementById(config.videoElementId);
        captureImage(videoElement, config.userImageInputId); // Capture image when a new high score is found
    }

    // Check for high enough scores to trigger the countdown once
    if (score >= config.faceApiFeatures.detectionThreshold && !scoreManager.countdownActive) {
        const display = document.querySelector('#animation-container');
        scoreManager.startCountdown(3, display);
    }

    if (scoreManager.hasEnoughSamples()) {
        console.log("Reached sufficient samples for evaluation.");
        if (scoreManager.getHighestScore() >= config.faceApiFeatures.detectionThreshold) {
            console.log("High-quality detection session completed.");           
            handleSuccessfulFaceDetectionSequence(config);
        } else {
            console.log("Session ended without sufficient quality.");
            scoreManager.resetAll();
        }
    }
}

async function handleSuccessfulFaceDetectionSequence(config) {
    // Stop the detection
    stopDetection();
    
    // Wait for a specified interval
    await wait(config.delayBetweenAnimations);
    
    // Clear the canvas
    clearCanvas();
    
    // Wait for another interval if needed
    await wait(config.delayBetweenAnimations);

    // Stop the camera
    stopCamera(document.getElementById(config.videoElementId));
    
    // Wait longer than usual to account for the startCountdown interference (at 1000ms interval)
    await wait(2000 - config.delayBetweenAnimations * 2);

    // Display success message
    const display = document.querySelector('#animation-container');
    scoreManager.displaySuccessMessage(display);

    // Pause a bit before submitting the form
    await wait(1250);
    exitFullscreen(config);

    await wait(config.delayBetweenAnimations);
    clickButtonById(config.hiddenFormSubmitButtonId);

}

// Helper function to create a delay
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


/* Function to resize the results to match the display size */
function resizeResults(detections, config) {
    const videoElement = document.getElementById(config.videoElementId);            
    const dims = faceapi.matchDimensions(canvas, videoElement, true);
    dims.height = videoElement.offsetHeight;
    dims.width = videoElement.offsetWidth;
    canvas.height = videoElement.offsetHeight;
    canvas.width = videoElement.offsetWidth;

    /* Resize the box given the display image's different size (than the original video) */ 
    const resizedDetections = faceapi.resizeResults(detections, dims);
    
    /* A bit of debugging, this gets messy with mobile + desktop */
    // canvas.width = videoElement.offsetWidth;
    // canvas.height = videoElement.offsetHeight;
    videoElement.width = videoElement.videoWidth;
    videoElement.height = videoElement.videoHeight;

    /* Not sure if this is needed */
    videoElement.style.width = videoElement.offsetWidth + 'px';
    videoElement.style.height = videoElement.offsetHeight + 'px';

    return resizedDetections;
}

/* Function to draw the features on the canvas */
function drawFeaturesOnCanvas(detections, config) {
    if (config.faceApiFeatures.drawBoundingBox) {
      faceapi.draw.drawDetections(canvas, detections);
    }
    if (config.faceApiFeatures.drawLandmarks) {
      faceapi.draw.drawFaceLandmarks(canvas, detections);
    }
    if (config.faceApiFeatures.drawExpressions) {
      faceapi.draw.drawFaceExpressions(canvas, detections);
    }
    if (config.faceApiFeatures.drawAgeAndGender) {
        detections.forEach(result => {
            const { age, gender, genderProbability } = result
            new faceapi.draw.DrawTextField(
              [
                `${faceapi.round(age, 0)} years`,
                `${gender} (${faceapi.round(genderProbability)})`
              ],
              result.detection.box.bottomRight
            ).draw(canvas)
          })
    }
  }

/* Function to clear the canvas */
function clearCanvas() {
    canvas
      .getContext("2d", { willReadFrequently: true })
      .clearRect(0, 0, canvas.width, canvas.height);
}

/* Function to stop the face detection */
function stopDetection() {
    console.log("Stopping detection...");
    clearInterval(scanIntervalId);
    scanIntervalId = null;
    console.log("Interval stopped.");
}

/* Function to stop the camera */
function stopCamera(videoElement) {
    console.log("Stopping camera...");

    /* Stop any existing streams */
    if (videoElement.srcObject) {
        const tracks = videoElement.srcObject.getTracks();
        tracks.forEach(track => track.stop());
        console.log("Stopped existing video tracks on the element before applying new stream.");
    }
}


function exitFullscreen(config) {
    if(!config.videoContainerId) return;

    if(window.innerWidth < config.mobileWidth) {
        /* Remove simulated fullscreen style to videoContainer */
        const videoContainer = document.getElementById(config.videoContainerId);
        videoContainer.classList.remove('simulated-fullscreen');

        /* Remove the display none to paperClass */    
        var paperClass = document.getElementsByClassName('overlay-content')[0];
        paperClass.style.display = 'block';

        /* Remove the score from the screen */
        const animationContainer = document.querySelector('#animation-container');
        animationContainer.innerHTML = '';
        animationContainer.style.display = 'none';
    }
}