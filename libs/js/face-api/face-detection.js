const DELAY_RESIZE_OBSERVER = 150; // Delay in milliseconds to wait before resizing the canvas

const webcamElement = document.getElementById("webcam");
const canvasElement = document.getElementById("webcam-canvas");
const webcam = new Webcam(webcamElement, "user", canvasElement);
const modelPath = "models";
let currentStream;
let displaySize;
let canvas;
let faceDetection;
let initialized = false;

// Configuration and options
const config = {
  webcamElementId: "webcam",
  modelPath: "models",
  detectionInterval: 250,
  autoStart: true,
  features: {
    drawBoundingBox: true,
    drawLandmarks: true,
    drawExpressions: true,
    drawAgeAndGender: true,
  },
};
document.addEventListener("DOMContentLoaded", function () {
  webcam
    .start()
    .then((result) => {
      webcamElement.style.transform = "";
      console.log("webcam started");
    })
    .catch((err) => {
      displayError();
    });

  $("#webcam").bind("loadedmetadata", function () {
    setTimeout(() => {
      displaySize = { width: this.scrollWidth, height: this.scrollHeight };
      console.log("set webcam display size to:", displaySize);
      Promise.all([
        faceapi.nets.tinyFaceDetector.load(modelPath),
        faceapi.nets.faceLandmark68TinyNet.load(modelPath),
        faceapi.nets.faceExpressionNet.load(modelPath),
        faceapi.nets.ageGenderNet.load(modelPath),
      ]).then(function () {
        createCanvas();
        startDetection();
        observeContainerResize();
      });
    }, 500);
  });
});

function createCanvas() {
  if (document.getElementsByTagName("canvas").length == 1) {
    canvas = faceapi.createCanvasFromMedia(webcamElement);
    document.getElementById("webcam-container").append(canvas);
    faceapi.matchDimensions(canvas, displaySize);
  }
}

function startDetection() {
  faceDetection = setInterval(async () => {
    const detections = await faceapi
      .detectSingleFace(webcamElement, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks(true)
      .withFaceExpressions()
      .withAgeAndGender();

    if (detections) {
      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      canvas
        .getContext("2d", { willReadFrequently: true })
        .clearRect(0, 0, canvas.width, canvas.height);

      // Draw features based on config
      drawFeaturesOnCanvas(resizedDetections);

      // Check face detection score and take snapshot if meets criteria
      if (detections.detection.score > 0.6) {
        // TODO: do something here with the data? add a counter, take 10 pics, then stop
        // captureAndStoreFacialScan();
        // takeSnapshot();
      }
    } else {
      console.log("no face detected");
      clearCanvas();
    }
  }, config.detectionInterval);
}

function drawFeaturesOnCanvas(detections) {
  if (config.features.drawBoundingBox) {
    faceapi.draw.drawDetections(canvas, detections);
  }
  if (config.features.drawLandmarks) {
    faceapi.draw.drawFaceLandmarks(canvas, detections);
  }
  if (config.features.drawExpressions) {
    faceapi.draw.drawFaceExpressions(canvas, detections);
  }
  if (config.features.drawAgeAndGender) {
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
    .getContext("2d", { willReadFrequently: true })
    .clearRect(0, 0, canvas.width, canvas.height);
}

function captureAndStoreFacialScan() {
  const dataUrl = canvas.toDataURL();
  const img = document.createElement("img");
  img.src = dataUrl;
  document.getElementById("capturedImages").appendChild(img);
}

function displayError(err = "") {
  if (err != "") {
    $("#errorMsg").html(err);
  }
  $("#errorMsg").removeClass("d-none");
}

function displayError(err = "") {
  if (err != "") {
    $("#errorMsg").html(err);
  }
  $("#errorMsg").removeClass("d-none");
}

function observeContainerResize() {
  const webcamContainer = document.getElementById("webcam-container");
  let resizeTimeout; // Declare a variable outside of the resize event handler

  const resizeObserver = new ResizeObserver((entries) => {
    if (resizeTimeout) clearTimeout(resizeTimeout); // Clear the previous timeout
    resizeTimeout = setTimeout(() => {
      // Set a new timeout
      console.log("resize observer called");
      if (!initialized) {
        console.log("camera initialization complete");
        initialized = true;
        return;
      }
      entries.forEach((entry) => {
        const { width, height } = entry.contentRect;
        if (canvas) {
          document.getElementById("webcam-container").removeChild(canvas); // Remove the existing canvas
        }
        displaySize = { width, height }; // Update the display size based on the new dimensions
        console.log("set webcam display size to:", displaySize);
        createCanvas(); // Create a new canvas
        startDetection(); // Restart face detection
      });
    }, DELAY_RESIZE_OBSERVER);
  });

  resizeObserver.observe(webcamContainer);
}

function recreateCanvas(contentRect) {
  const { width, height } = contentRect;
  if (!initialized) {
    console.log("camera initialization complete");
    initialized = true;
    return;
  }
  if (canvas) {
    document.getElementById("webcam-container").removeChild(canvas); // Remove the existing canvas
  }
  displaySize = { width, height }; // Update the display size based on the new dimensions
  console.log("set webcam display size to:", displaySize);
  createCanvas(); // Create a new canvas
}

function takeSnapshot() {
  const imageSrc = webcam.snap();
  const img = document.createElement("img");
  img.src = imageSrc;
  document.getElementById("capturedImages").appendChild(img);
  console.log("Snapshot taken");
}
