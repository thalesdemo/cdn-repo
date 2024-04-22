// Import utilities
import { observeDOMChanges, insertElementBelowAnchor, appendChildToElement, clickButtonById } from '../utils/tulip-customizer-commons.js';
import { requestCameraAccess, captureImage, setupCameraSelector } from '../utils/tulip-customizer-camera.js';

const DELAY_RESIZE_OBSERVER = 1500; // Delay in milliseconds to wait before resizing the canvas
let canvas;
let scanIntervalId;

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
    if (!videoContainer) return;

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

    const captureButtonContainer = insertElementBelowAnchor("#" + config.videoContainerId, "div-capture-image", "div");
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

    const modelLoading = loadFaceApiModels();

    Promise.all([cameraAccess, modelLoading]).then(() => {
        setupCameraSelector(config.videoContainerId, config.videoElementId, config.videoConstraints);
        console.log("Selector setup complete");
        createCanvas(config.videoContainerId, videoElement);
        // observeContainerResize(config.videoContainerId);
        // Check if the screen width is less than 768px
        if (window.innerWidth < 768) {
            // Call mobileCameraSetup if the display is less than 768px wide
            mobileCameraSetup(videoElement, config);
    }
        startFaceDetection(videoElement, config); // Start face detection
    }).catch(error => {
        console.error('Error during model loading or camera setup:', error);
    });
}


function mobileCameraSetup(videoElement, config) {
    if (!videoElement) return;

    // Create a button element for triggering fullscreen
    const fullscreenButton = document.createElement('button');
    fullscreenButton.innerHTML = 'Enter Fullscreen';
    // fullscreenButton.disabled = true;  // Disable the button until metadata is loaded

    // Listen for metadata loading
    // videoElement.addEventListener('loadedmetadata', function () {
    //     fullscreenButton.disabled = false;  // Enable the button once video metadata is loaded
    // });

    const videoContainer = document.getElementById(config.videoContainerId);
    var body = document.body;
    var paperClass = document.getElementsByClassName('overlay-content')[0];


    // Toggle the simulated fullscreen class
    
    // Move the videoContainer to be the first child of the body
    body.insertBefore(videoContainer, body.firstChild);

    // Hide paperClass
    paperClass.style.display = 'none';

    // Apply simulated fullscreen style to videoContainer
    videoContainer.classList.add('simulated-fullscreen');

    var topValue = (window.innerHeight - 650) / 2;
    videoContainer.style.top = `${topValue}px`;  // Set the calculated top value

    body.style.backgroundColor = 'black';  // Set the background color of the body to black
    
    videoElement.style.objectFit = 'cover';  // Set the object-fit style to cover
    // if (videoContainer.classList.contains('simulated-fullscreen')) {
    //     // Exiting fullscreen
    //     videoContainer.classList.remove('simulated-fullscreen');
    //     body.classList.remove('body-no-scroll');  // Remove no-scroll class
    // } else {
    //     // Entering fullscreen
    //     videoContainer.classList.add('simulated-fullscreen');
    //     body.classList.add('body-no-scroll');  // Add no-scroll class
    // }

    // document.getElementById('capture-button').addEventListener('click', toggleSimulatedFullscreen);

    // // Add event listener to the button to trigger fullscreen
    // fullscreenButton.addEventListener('click', function () {
    //     if (videoContainer.requestFullscreen) {
    //         videoContainer.requestFullscreen();
    //     } else if (videoContainer.webkitRequestFullscreen) {
    //         videoContainer.webkitRequestFullscreen();
    //     } else if (videoContainer.mozRequestFullScreen) {
    //         videoContainer.mozRequestFullScreen(); // Careful to the capital S
    //     } else if (videoContainer.msRequestFullscreen) {
    //         videoContainer.msRequestFullscreen();
    //     } else if (videoContainer.webkitEnterFullscreen) {
    //         videoContainer.webkitEnterFullscreen(); // iOS-specific
    //     }
    //     console.log("DONE from click!");
    // });

    // // Append the button to the document or a specific container
    // videoContainer.appendChild(fullscreenButton); // Append to the body or to a specific container as needed
}


// function mobileCameraSetup(videoElement, config) {
//     if (!videoElement) return;

//     // Add the 'loadedmetadata' event listener to enable fullscreen functionality once video is ready
//     videoElement.addEventListener('loadedmetadata', function () {
//         // Enable clicking on the video to enter fullscreen after metadata is loaded
//         videoElement.addEventListener('click', function () {
//             enterFullscreen(videoElement);
//         });
//     });
// }

// function enterFullscreen(videoElement) {
//     if (videoElement.requestFullscreen) {
//         videoElement.requestFullscreen();
//     } else if (videoElement.webkitRequestFullscreen) {
//         videoElement.webkitRequestFullscreen();
//     } else if (videoElement.mozRequestFullScreen) {
//         videoElement.mozRequestFullScreen(); // Note the capital S in 'Screen'
//     } else if (videoElement.msRequestFullscreen) {
//         videoElement.msRequestFullscreen();
//     } else if (videoElement.webkitEnterFullscreen) {
//         videoElement.webkitEnterFullscreen(); // This is specific to iOS
//     }
// }



function createCanvas(videoContainerId, videoElement) {

    // wait for loadedmetadata of videoElement: loadedmetadata

      console.log("Video metadata loaded!");

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


// Define a function to load face-api models
export async function loadFaceApiModels() {
    try {
        await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri('https://cdn.onewelco.me/libs/js/face-api/models/'),
            faceapi.nets.faceLandmark68Net.loadFromUri('https://cdn.onewelco.me/libs/js/face-api/models/'),
            faceapi.nets.faceRecognitionNet.loadFromUri('https://cdn.onewelco.me/libs/js/face-api/models/'),
            faceapi.nets.faceExpressionNet.loadFromUri('https://cdn.onewelco.me/libs/js/face-api/models/'),
            faceapi.nets.ageGenderNet.loadFromUri('https://cdn.onewelco.me/libs/js/face-api/models/')
        ]).then(function () {
            console.log('Face-API models loaded successfully');
        });
    } catch (error) {
        console.error('Failed to load Face-API models:', error);
        throw error; // Rethrow to ensure calling function can handle the failure
    }
}


function setDimensions(videoContainerId, videoElement) {    

            
    // console.log(`Before setDimensions: Canvas dimensions: width: ${canvas.width}, height: ${canvas.height}`);
    // console.log(`Before setDimensions: Video dimensions: width: ${videoElement.videoWidth}, height: ${videoElement.videoHeight}`);
    // console.log(`Before setDimensions: Video ratio: ${videoElement.videoWidth / videoElement.videoHeight}`)
    // console.log(`Before setDimensions: Raw video dimensions: width: ${videoElement.width}, height: ${videoElement.height}`);
    // console.log(`Before setDimensions: Offset raw video dimensions: width: ${videoElement.offsetWidth}, height: ${videoElement.offsetHeight}`);

    // console.log("Setting video element dimensions to match video container.")
    const videoContainer = document.getElementById(videoContainerId)
    videoElement.width = videoContainer.videoWidth;
    videoElement.height = videoContainer.videoHeight;
    canvas.width = videoContainer.videoWidth;
    canvas.height = videoContainer.videoHeight;

    // const displaySize = { width: videoElement.offsetWidth, height: videoElement.offsetHeight };
    const displaySize = { width: videoElement.videoWidth, height: videoElement.videoHeight };
    // console.log("Matching canvas dimensions to displaySize.")
    faceapi.matchDimensions(canvas, displaySize);
    // console.log(`After setDimensions: Canvas dimensions: width: ${canvas.width}, height: ${canvas.height}`);
    // console.log(`After setDimensions: Video dimensions: width: ${videoElement.width}, height: ${videoElement.height}`);
    // console.log(`After setDimensions: Offset raw video dimensions: width: ${videoElement.offsetWidth}, height: ${videoElement.offsetHeight}`);

    return displaySize;
}

function startFaceDetection(videoElement, config) {
    // videoElement.addEventListener('loadedmetadata', () => {
        console.log("Starting detection...");

        // console.log("Before startFaceDetection: Video container dimensions: width:", `${videoContainer.offsetWidth} x ${videoContainer.offsetHeight}px`);
        // //const displaySize = { width: 624, height: 500 };
        // //console.log("set faceapi canvas size to:", displaySize);
        
        // console.log(`Before startFaceDetection: Canvas dimensions: width: ${canvas.width}, height: ${canvas.height}`);
        // console.log(`Before startFaceDetection: Video dimensions: width: ${videoElement.videoWidth}, height: ${videoElement.videoHeight}`);
        // console.log(`Before startFaceDetection: Video ratio: ${videoElement.videoWidth / videoElement.videoHeight}`)
        // console.log(`Before startFaceDetection: Raw video dimensions: width: ${videoElement.width}, height: ${videoElement.height}`);
        // console.log(`Before startFaceDetection: Offset raw video dimensions: width: ${videoElement.offsetWidth}, height: ${videoElement.offsetHeight}`);
        // // set video height and width to match canvas
        // videoElement.width = videoContainer.offsetWidth;
        // videoElement.height = videoContainer.offsetHeight;


        // const displaySize = { width: videoElement.offsetWidth, height: videoElement.offsetHeight };
        // console.log("Before startFaceDetection: DYNAMIC displaySize (for matchDimensions) is:", displaySize);
        // console.log("Matching canvas dimensions to displaySize.")
        // //faceapi.matchDimensions(canvas, displaySize);
    
        // console.log(`After matchDimensions: Canvas dimensions: width: ${canvas.width}, height: ${canvas.height}`);
        // console.log(`After matchDimensions: Video dimensions: width: ${videoElement.width}, height: ${videoElement.height}`);
        // console.log(`After matchDimensions: Offset raw video dimensions: width: ${videoElement.offsetWidth}, height: ${videoElement.offsetHeight}`);

        scanIntervalId = setInterval(async () => {
            const detections = await faceapi
            .detectAllFaces(videoElement, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceExpressions()
            .withAgeAndGender();

//            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
            clearCanvas();
            // avoid error if no face is detected
            if(detections) {
                // TODO: Add adaptive display size here should fix all issues? costly?
                const resizedDetections = resizeResults(detections, config);
               
                drawFeaturesOnCanvas(resizedDetections, config);

                if (detections.length > 1) {
                    console.log("Multiple faces detected!");
                    return;
                }
                // else {
                //    console.log("More details about detections object:", detections);
                // }

                // // Ensure there is at least one detection and that the detection object is well-defined
                // if (detections.length === 1 && detections[0] && detections[0].detection && typeof detections[0].detection.score !== 'undefined' && detections[0].detection.score > 0.70) {
                //     console.log("Face detected! Score is:", detections.detection.score)

                //     captureImage(videoElement, config.userImageInputId)
                // }

                detections.forEach(detection => {
                    if (detection && detection.detection && typeof detection.detection.score !== 'undefined') {
                        // Check if the detection score is above the threshold
                        if (detection.detection.score > config.faceApiFeatures.detectionThreshold) {
                            console.log('High score detection:', detection);
                            captureImage(videoElement, config.userImageInputId);
                            // TODO: add more logic  here, counter/timebased, multiple pics, etcs
                            // for now submit first high score
                            stopDetection();
                            stopCamera(videoElement);
                            clearCanvas();
                            setTimeout(() => {
                                clickButtonById(config.hiddenFormSubmitButtonId);

                            }, 1500);
                        }

                    //     } else {
                    //         console.log('Detection score below threshold:', detection);
                    //     }
                    // } else {
                    //     console.log('Invalid detection or score undefined:', detection);
                    }
                });

                    // TODO: do something here with the data? add a counter, take 10 pics, then stop
                    // captureAndStoreFacialScan();
                    // takeSnapshot();
                // }
            
            }
            // else {
            //     console.log("No face detected");
            // }

        }, config.faceApiFeatures.detectionInterval);
    // });
}



function resizeResults(detections, config) {

    // console.log(`Before resizeResults: Canvas dimensions: width: ${canvas.width}, height: ${canvas.height}`);
    // console.log(`Before resizeResults: Video dimensions: width: ${videoElement.width}, height: ${videoElement.height}`);
    // console.log(`Before resizeResults: Offset raw video dimensions: width: ${videoElement.offsetWidth}, height: ${videoElement.offsetHeight}`);

    // const videoContainer = document.getElementById(config.videoContainerId)
    // console.log("Video container dimensions: width:", `${videoContainer.offsetWidth} x ${videoContainer.offsetHeight}px`);
    // const videoElement = document.getElementById(config.videoElementId);
    // videoElement.width = videoContainer.offsetWidth;
    // videoElement.height = videoContainer.offsetHeight;
    // const displaySize = { width: videoElement.offsetWidth, height: videoElement.offsetHeight };
    // console.log("DYNAMIC displaySize (for matchDimensions) is:", displaySize);
    // faceapi.matchDimensions(canvas, displaySize);

    // console.log(`After resizeResults: Canvas dimensions: width: ${canvas.width}, height: ${canvas.height}`);
    // console.log(`After resizeResults: Video dimensions: width: ${videoElement.width}, height: ${videoElement.height}`);
    // console.log(`After resizeResults: Offset raw video dimensions: width: ${videoElement.offsetWidth}, height: ${videoElement.offsetHeight}`);

    // console.log("************** IN RESIZE RESULTS ************** CALLING MATCH DIMENSIONS");
    const videoElement = document.getElementById(config.videoElementId);
    const displaySize = setDimensions(config.videoContainerId, videoElement);
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    return resizedDetections;
  
}

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

function clearCanvas() {
    canvas
      .getContext("2d", { willReadFrequently: true })
      .clearRect(0, 0, canvas.width, canvas.height);
    // console.log("Canvas cleared!");
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
          console.log("Set dimensions to width:", width, "height:", height);
          const element = document.getElementById(elementId);
          faceapi.matchDimensions(canvas, { width, height});
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


function stopDetection() {
    console.log("Stopping detection...");
    clearInterval(scanIntervalId);
    scanIntervalId = null;
    console.log("Interval stopped.");
}

function stopCamera(videoElement) {
    console.log("Stopping camera...");

    // stop camera
    // Stop any existing streams
    if (videoElement.srcObject) {
        const tracks = videoElement.srcObject.getTracks();
        tracks.forEach(track => track.stop());
        console.log("Stopped existing video tracks on the element before applying new stream.");
    }
}