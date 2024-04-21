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
    // Start both asynchronous operations
    const cameraAccess = requestCameraAccess(`#${config.videoElementId}`, config.videoConstraints).then(() => {
        // setupCameraSelector(config.videoContainerId, config.videoElementId);
        // console.log("Selector setup complete");
        // Wait until the video element begins playing
        const videoElement = document.querySelector(`#${config.videoElementId}`);
        return new Promise((resolve) => {
            videoElement.onplaying = () => {
                resolve();
                console.log("Video is now playing");
            };
        });
    });

    const modelLoading = loadFaceApiModels();

    // Wait for both the camera access and model loading to complete
    Promise.all([cameraAccess, modelLoading]).then(() => {
        createCanvas(config.videoContainerId, videoElement);
        // observeContainerResize(config.videoContainerId);
        startFaceDetection(videoElement, config); // Start face detection
    }).catch(error => {
        console.error('Error during model loading or camera setup:', error);
    });


}

function createCanvas(videoContainerId, videoElement) {

    // wait for loadedmetadata of videoElement: loadedmetadata

      console.log("Video metadata loaded!");

        if (document.getElementsByTagName("canvas").length == 0) {
            
                console.log("Creating canvas...");
                
                canvas = faceapi.createCanvasFromMedia(videoElement);
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

            
    console.log(`Before setDimensions: Canvas dimensions: width: ${canvas.width}, height: ${canvas.height}`);
    console.log(`Before setDimensions: Video dimensions: width: ${videoElement.videoWidth}, height: ${videoElement.videoHeight}`);
    console.log(`Before setDimensions: Video ratio: ${videoElement.videoWidth / videoElement.videoHeight}`)
    console.log(`Before setDimensions: Raw video dimensions: width: ${videoElement.width}, height: ${videoElement.height}`);
    console.log(`Before setDimensions: Offset raw video dimensions: width: ${videoElement.offsetWidth}, height: ${videoElement.offsetHeight}`);

    console.log("Setting video element dimensions to match video container.")
    const videoContainer = document.getElementById(videoContainerId)
    videoElement.width = videoContainer.offsetWidth;
    videoElement.height = videoContainer.offsetHeight;

    const displaySize = { width: videoElement.offsetWidth, height: videoElement.offsetHeight };
    console.log("Matching canvas dimensions to displaySize.")
    faceapi.matchDimensions(canvas, displaySize);
    console.log(`After setDimensions: Canvas dimensions: width: ${canvas.width}, height: ${canvas.height}`);
    console.log(`After setDimensions: Video dimensions: width: ${videoElement.width}, height: ${videoElement.height}`);
    console.log(`After setDimensions: Offset raw video dimensions: width: ${videoElement.offsetWidth}, height: ${videoElement.offsetHeight}`);

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

        setInterval(async () => {
            const detections = await faceapi
            .detectSingleFace(videoElement, new faceapi.TinyFaceDetectorOptions())
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

                if (detections.detection.score > 0.6) {
                    //console.log("Face detected! Score is:", detections.detection.score)
                    //console.log("More details about detections object:", detections);

                    // TODO: do something here with the data? add a counter, take 10 pics, then stop
                    // captureAndStoreFacialScan();
                    // takeSnapshot();
                }
            
            }
            // else {
            //     console.log("No face detected");
            // }

        }, 100);
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

    console.log("************** IN RESIZE RESULTS ************** CALLING MATCH DIMENSIONS");
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
      const { age, gender, genderProbability } = detections;
      new faceapi.draw.DrawTextField(
        [
          `${faceapi.round(age, 0)} years`,
          `${gender} (${faceapi.round(genderProbability)})`,
        ],
        detections.detection.box.bottomRight
      ).draw(canvas);
    }
  }

function clearCanvas() {
    canvas
      .getContext("2d")
      .clearRect(0, 0, canvas.width, canvas.height);
    console.log("Canvas cleared!");
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