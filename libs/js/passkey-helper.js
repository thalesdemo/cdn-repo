import { observeDOMChanges, insertElementBelowAnchor } from './utils/tulip-customizer-commons.js';


document.addEventListener("DOMContentLoaded", function () {
  const tasks = [
      {
          check: () => document.querySelector('div.passkey_challenge') && !document.querySelector('#passkeyCustomLoginButton'),
          action: () => {
              const passkeyLoginAnchorLabel = '.Step2PasskeyLoginAnchorJS';
              const passkeyCustomLoginButton = 'passkeyCustomLoginButton';
              const passkeyLoginAnchor = document.querySelector(passkeyLoginAnchorLabel);
              if (passkeyLoginAnchor) {
                  // Create a custom button to trigger the passkey authentication
                  const button = insertElementBelowAnchor(
                      passkeyLoginAnchorLabel,
                      passkeyCustomLoginButton,
                      'button',
                      {
                          content: 'Sign in with a passkey',
                          styles: {
                            color: "#ffffff",
                            width: "100%",
                            margin: "16px 0 16px 0",
                            padding: "6px 16px",
                            opacity: 1,
                            fontSize: "1.5rem",
                            minWidth: "64px",
                            boxSizing: "border-box",
                            transition: "opacity 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
                            lineHeight: "2.0",
                            fontFamily: "'Red Hat Display', sans-serif",
                            fontWeight: 400,
                            whiteSpace: "nowrap",
                            borderRadius: "6px",
                            textTransform: "none",
                            backgroundColor: "#030001",
                          },
                          eventListeners: [
                              {
                                  type: 'click',
                                  handler: function() {
                                      console.log("Custom button clicked.");
                                      passkeyAuth();  // Call your passkey authentication function here
                                  }
                              }
                          ]
                      }
                  );
                  console.log("Custom button inserted.");
              }
          }
      }
  ];

  observeDOMChanges(tasks);
});

/**
 * Extracts the text content from a nested element based on the provided CSS selector.
 *
 * @param {string} selector - The CSS selector for the target element.
 * @returns {string|null} - The extracted text content or null if the element is not found.
 */
function extractValue(selector) {
    const element = document.querySelector(selector);
    return element ? element.textContent.trim() : null;
  }
  
  /**
   * Populates a specified input field with a given value.
   *
   * @param {string} inputId - The ID of the input field to populate.
   * @param {*} value - The value to populate the input field with.
   */
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
  
  /**
   * Sets the native value of an input element, designed to work with frameworks that encapsulate the native input properties
   * like React. This helper function ensures that the value setting is recognized by the framework's reactivity system.
   *
   * @param {HTMLInputElement} element - The input element whose value is to be set.
   * @param {*} value - The value to set on the input element.
   */
  function setNativeValue(element, value) {
    const valueSetter = Object.getOwnPropertyDescriptor(element, "value").set;
    const prototype = Object.getPrototypeOf(element);
    const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, "value").set;
  
    if (valueSetter && valueSetter !== prototypeValueSetter) {
      prototypeValueSetter.call(element, value);
    } else {
      valueSetter.call(element, value);
    }
  }
  
  /**
   * Converts an ArrayBuffer to a Base64-URL encoded string.
   *
   * @param {ArrayBuffer} buffer - The ArrayBuffer to convert.
   * @returns {string} - The Base64-URL encoded string.
   */
  function arrayBufferToBase64Url(buffer) {
    const base64 = btoa(String.fromCharCode.apply(null, new Uint8Array(buffer)));
    if(base64 === null) {
      return null;
    }
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  
  /**
   * Converts an assertion object to a serializable format.
   *
   * @param {PublicKeyCredential} assertion - The assertion object to convert.
   * @returns {object} - The serializable assertion object.
   */
  function assertionToObject(assertion) {
    return {
      id: assertion.id,
      rawId: arrayBufferToBase64Url(assertion.rawId),
      type: assertion.type,
      response: {
        clientDataJSON: arrayBufferToBase64Url(assertion.response.clientDataJSON),
        authenticatorData: arrayBufferToBase64Url(assertion.response.authenticatorData),
        signature: arrayBufferToBase64Url(assertion.response.signature),
        userHandle: assertion.response.userHandle ? arrayBufferToBase64Url(assertion.response.userHandle) : null
      }
    };
  }
  
  // Function to authenticate using passkey
  function passkeyAuth() {
    // Extract the challenge value from the page
    const challengeValue = extractValue('.passkey_challenge h1 span span');
    // Extract the user verification value from the page
    const userVerificationValue = extractValue('.passkey_userVerification h1 span span');
    // Extract the RP ID value from the page
    const rpIdValue = extractValue('.passkey_rpId h1 span span');
  
    console.log(challengeValue);
  
    if (!challengeValue || !userVerificationValue || !rpIdValue) {
      return;
    }

    const challengeArray = Uint8Array.from(atob(challengeValue.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));
  
    const publicKeyCredentialRequestOptions = {
      challenge: challengeArray,
      rpId: rpIdValue,
      userVerification: userVerificationValue
    };
  
    navigator.credentials.get({ publicKey: publicKeyCredentialRequestOptions })
      .then((assertion) => {
        // Convert the entire assertion object to a serializable form
        const assertionObject = assertionToObject(assertion);
  
        // Stringify the entire object
        const assertionString = JSON.stringify(assertionObject);
  
        // Encode the stringified object in Base64
        const assertionBase64 = btoa(assertionString);
  
        // Populate the input field with the Base64-encoded string
        populateInputField('identiverse_purchase_step2_passkey-TEXT_FIELD-passkeyauthn-input_container-input', assertionBase64);
        passkeySubmitForm();
      })
      .catch((error) => {
        console.error('Authentication error:', error);
      });
  }
  
  // Function to submit the passkey form
  function passkeySubmitForm() {
    // Find the submit button by its ID
    const submitButton = document.getElementById('identiverse_purchase_step2_passkey-submit-Submit-button_container');
  
    // Check if the button exists
    if (submitButton) {
      // Simulate a click on the submit button
      console.log("Triggering submit button click for the passkey auth after 1s.");
      // Sleep for 1 second
      setTimeout(() => {
        // Show all elements with class 'paperClass'
        const paperElements = document.querySelectorAll('.paperClass'); // Select all elements with class 'paperClass'
        paperElements.forEach(function(el) {
          el.style.display = 'block';
        });
        submitButton.click();
      }, 1000);
    } else {
      console.error('Submit button not found');
    }
  }
  
