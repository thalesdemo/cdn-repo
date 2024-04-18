// Library from https://github.com/nimiq/qr-scanner
import QrScanner from "./qr-scanner.min.js";

// Define a global variable to store the process token
let globalProcessToken = null; // Initialize the global variable

// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded and parsed");

  // Define tasks to be executed based on certain conditions
  const tasks = [
    // Task to retrieve and store the process token
    // {
    //   check: () => document.querySelector('.processToken h1 span span'),
    //   action: () => {
    //     const processTokenField = document.querySelector('.processToken h1 span span');
    //     if (processTokenField) {
    //       globalProcessToken = processTokenField.textContent.trim();
    //       console.log("Process token retrieved and stored:", globalProcessToken);
    //     }
    //   },
    // },
    // Task to automatically redirect with processToken if not in the URL already
    // {
    //   check: () => globalProcessToken && !window.location.search.includes(`processToken=${globalProcessToken}`),
    //   action: () => {
    //     const currentUrl = new URL(window.location.href);
    //     // Append the processToken parameter to the URL's search parameters
    //     currentUrl.searchParams.set('processToken', globalProcessToken);
    //     // Redirect to the new URL with the processToken parameter
    //     window.location.href = currentUrl.href;
    //   },
    // },
    // Task to insert the video container below the anchor div
    {
      check: () =>
        document.querySelector(".introStep1Register") &&
        !document.querySelector("#video-container"),
      action: () => insertElementsBelowAnchor(),
    },
    // Task to initialize the QR scanner and populate the input field
    {
      check: () =>
        document.getElementById("qr-video") && !window.qrScannerInitialized,
      action: () => setupQrScannerAndPopulateInput(),
    },
    // Task to populate the firstname field
    {
      check: () => document.querySelector(".predefinedFirstName h1 span span"),
      action: () => {
        const firstNameValue = document.querySelector(
          ".predefinedFirstName h1 span span"
        ).textContent;
        if (firstNameValue) {
          console.log("Populating givenName input with:", firstNameValue);
          populateInputField(
            "identiverse_register_step2-TEXT_FIELD-givenName-input_container-input",
            firstNameValue
          );
        }
      },
    },
    // Task to populate the lastname field
    {
      check: () => document.querySelector(".predefinedLastName h1 span span"),
      action: () => {
        const lastNameValue = document.querySelector(
          ".predefinedLastName h1 span span"
        ).textContent;
        if (lastNameValue) {
          console.log("Populating lastName input with:", lastNameValue);
          populateInputField(
            "identiverse_register_step2-TEXT_FIELD-name-input_container-input",
            lastNameValue
          );
        }
      },
    },
  ];

  // Insert new elements below a specific anchor div
  function insertElementsBelowAnchor() {
    console.log("Inserting video container below introStep1Register");
    const anchor = document.querySelector(".introStep1Register");
    if (anchor && !document.getElementById("video-container")) {
      const videoContainer = document.createElement("div");
      videoContainer.setAttribute("id", "video-container");
      videoContainer.style.width = "100%";
      videoContainer.style.maxWidth = "640px";
      videoContainer.style.margin = "auto";
      videoContainer.style.marginTop = "20px";
      videoContainer.style.marginBottom = "20px";
      videoContainer.style.display = "flex";
      videoContainer.style.flexDirection = "column";
      videoContainer.style.alignItems = "center";

      const videoElement = document.createElement("video");
      videoElement.setAttribute("id", "qr-video");
      videoElement.style.maxWidth = "100%";
      videoElement.style.margin = "auto";

      videoContainer.appendChild(videoElement);
      anchor.parentNode.insertBefore(videoContainer, anchor.nextSibling);
    }
  }

  // Setup QR scanner and autopopulate the input field
  function setupQrScannerAndPopulateInput() {
    console.log("Initializing QR Scanner");
    const video = document.getElementById("qr-video");
    if (!video || window.qrScannerInitialized) return;

    const qrScanner = new QrScanner(
      video,
      (result) => {
        console.log("QR Code detected:", result.data);
        const qrData = result.data;
        const pattern =
          /^user:\/\/identiverse\?id=([^&]+)(&firstname=([^&]*))?(&lastname=([^&]*))?/;
        const match = qrData.match(pattern);

        if (match) {
          console.log("QR Code contains expected data. Stopping scanner...");
          const id = match[1];
          console.log("Extracted ID:", id);

          // Populate the userName input field with the extracted ID
          populateInputField(
            "identiverse_register_step1-TEXT_FIELD-userName-input_container-input",
            id
          );

          // Check if firstName is present in the match
          if (match[3]) {
            const firstName = decodeURIComponent(match[3]);
            populateInputField(
              "identiverse_register_step1-TEXT_FIELD-firstName-input_container-input",
              firstName
            );
            console.log("Extracted firstName:", firstName);
          }

          // Check if lastName is present in the match
          if (match[5]) {
            const lastName = decodeURIComponent(match[5]);
            populateInputField(
              "identiverse_register_step1-TEXT_FIELD-lastName-input_container-input",
              lastName
            );
            console.log("Extracted lastName:", lastName);
          }

          // Display a success image
          displaySuccessImage();

          // Stop the QR scanner
          qrScanner.stop();

          // Pause for 1.5 seconds and then submit the form
          setTimeout(() => {
            step1SubmitForm();
          }, 1500);
        } else {
          console.log(
            "QR Code does not contain expected data. Continuing to scan..."
          );
        }
      },
      {
        highlightScanRegion: true,
        highlightCodeOutline: true,
      }
    );

    qrScanner
      .start()
      .then(() => {
        // Only list and set up cameras after the scanner has started successfully
        QrScanner.listCameras(true).then((cameras) => {
          const cameraSelector =
            document.getElementById("camera-selector") ||
            createCameraSelector();
          populateCameraSelector(cameras, cameraSelector);
          setupCameraChangeListener(cameraSelector, qrScanner); // Setup the change listener here
          setInitialCamera(cameras, cameraSelector, qrScanner);
        });
      })
      .catch((err) => {
        console.error("Error starting the scanner:", err);
      });

    window.qrScannerInitialized = true;
  }

  function createCameraSelector() {
    const videoContainer = document.getElementById("video-container");
    let cameraSelector = document.getElementById("camera-selector");
    if (!cameraSelector) {
      cameraSelector = document.createElement("select");
      cameraSelector.id = "camera-selector";
      cameraSelector.style.marginTop = "10px";
      videoContainer.appendChild(cameraSelector);
    }
    return cameraSelector;
  }

  function populateCameraSelector(cameras, selector) {
    selector.innerHTML = ""; // Clear existing options
    cameras.forEach((camera, index) => {
      const option = document.createElement("option");
      option.value = camera.id;
      option.text = camera.label || `Camera ${index + 1}`;
      selector.appendChild(option);
    });
  }

  function setupCameraChangeListener(selector, qrScanner) {
    // Ensure that the listener is added only once by removing any existing listeners first
    selector.removeEventListener("change", selector.changeListener);
    selector.changeListener = () => {
      qrScanner.setCamera(selector.value).catch(console.error);
      console.log("Camera switched to:", selector.value);
    };
    selector.addEventListener("change", selector.changeListener);
  }

  function setInitialCamera(cameras, selector, qrScanner) {
    if (cameras.length > 0) {
      qrScanner
        .setCamera(cameras[0].id)
        .then(() => {
          selector.value = cameras[0].id; // Ensure the selector shows the camera that's active
          console.log("Default camera set:", cameras[0].label);
        })
        .catch((err) => {
          console.error("Could not set the camera:", err);
        });
    }
  }

  // Function to display a success image
  function displaySuccessImage() {
    const videoContainer = document.getElementById("video-container");
    const existingImage = videoContainer.querySelector("img");
    if (!existingImage) {
      const checkmarkImage = document.createElement("img");
      checkmarkImage.src =
        "../login/ui/resources/theme/img/green-checkmark.svg";
      checkmarkImage.alt = "Success";
      checkmarkImage.style.width = "100px";
      checkmarkImage.style.height = "100px";
      checkmarkImage.style.margin = "auto";
      checkmarkImage.style.display = "block";
      videoContainer.appendChild(checkmarkImage);
    }
    // Hide the video and camera selector if present
    const video = document.getElementById("qr-video");
    if (video) video.style.display = "none";
    const cameraSelector = document.querySelector("#video-container select");
    if (cameraSelector) cameraSelector.style.display = "none";
  }

  // Function to handle displaying an error image
  function displayErrorImage() {
    const videoContainer = document.getElementById("video-container");
    if (videoContainer) {
      const errorImage = document.createElement("img");
      errorImage.src = "../login/ui/resources/theme/img/red-xmark.svg";
      errorImage.alt = "Error";
      errorImage.style.width = "100px";
      errorImage.style.height = "100px";
      errorImage.style.margin = "auto";
      errorImage.style.display = "block";
      videoContainer.appendChild(errorImage);
      // Optionally hide the video and selector
      const video = document.getElementById("qr-video");
      if (video) video.style.display = "none";
      const cameraSelector = videoContainer.querySelector("select");
      if (cameraSelector) cameraSelector.style.display = "none";
    }
  }

  // Function to populate an input field with a specific value
  function populateInputField(inputId, value) {
    const inputElement = document.getElementById(inputId);
    if (inputElement) {
      setNativeValue(inputElement, value);
      inputElement.dispatchEvent(new Event("input", { bubbles: true }));
      inputElement.dispatchEvent(new Event("change", { bubbles: true }));
    } else {
      console.error(`Input element ${inputId} not found`);
    }
  }

  // Function to set the value of an input element for React-based applications
  // Helper of populateInputField
  function setNativeValue(element, value) {
    const valueSetter = Object.getOwnPropertyDescriptor(element, "value").set;
    const prototype = Object.getPrototypeOf(element);
    const prototypeValueSetter = Object.getOwnPropertyDescriptor(
      prototype,
      "value"
    ).set;

    if (valueSetter && valueSetter !== prototypeValueSetter) {
      prototypeValueSetter.call(element, value);
    } else {
      valueSetter.call(element, value);
    }
  }

  // Function to submit the form after the QR code is scanned
  function step1SubmitForm() {
    // Find the submit button by its ID
    const submitButton = document.getElementById(
      "identiverse_register_step1-submit-Submit-button_container"
    );

    // Check if the button exists
    if (submitButton) {
      // Simulate a click on the submit button
      console.log("Triggering submit button click for register step1.");
      submitButton.click();
    } else {
      console.error("Submit button not found");
    }
  }

  // Does not work
  // function step1SubmitForm() {
  //   // Use the global process token
  //   if (globalProcessToken) {
  //     // Find the form that contains the submit button
  //     const form = document.getElementById('identiverse_register_step1-submit-Submit-button_container').form;

  //     if (form) {
  //       // Modify the form's action URL to include the globalProcessToken as a query parameter
  //       const originalAction = form.getAttribute('action');
  //       const newAction = `${originalAction}?processToken=${encodeURIComponent(globalProcessToken)}`;
  //       form.setAttribute('action', newAction);

  //       // Submit the form
  //       console.log("Form is being submitted with globalProcessToken.");
  //       form.submit();
  //     } else {
  //       console.error("Form is missing");
  //     }
  //   } else {
  //     console.error("Global process token not found");
  //   }
  // }

  // Observe DOM mutations and execute tasks
  const observer = new MutationObserver(function () {
    console.log("DOM mutation observed");
    tasks.forEach((task) => {
      if (task.check()) {
        task.action();
      }
    });
  });

  // Observe the entire body and subtree for changes
  observer.observe(document.body, { childList: true, subtree: true });

  // Execute tasks on initial page load
  tasks.forEach((task) => {
    if (task.check()) {
      task.action();
    }
  });
});
