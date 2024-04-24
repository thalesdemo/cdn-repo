/**
 * The `tulip-customizer-commons.js` module provides a collection of utility functions designed to facilitate common
 * DOM manipulations, event handling, and dynamic interaction within web applications. This module acts as a foundation
 * for implementing responsive, interactive features that require manipulating the DOM based on user actions or lifecycle events.
 */

/**
 * Observes DOM changes and executes specified tasks when certain conditions are met. This function is essential
 * for reactive UI updates in response to DOM modifications, ensuring that actions are triggered precisely when the required
 * DOM structure is present.
 * 
 * @param {Array} tasks - An array of tasks, each containing a 'check' function to determine if the task should run, and an 'action' function to execute.
 * @returns {MutationObserver} The MutationObserver instance used for observing the changes, allowing for later disconnection if necessary.
 */
export function observeDOMChanges(tasks) {
  const observer = new MutationObserver(() => {
    tasks.forEach(task => {
      if (task.check()) {
        task.action();
      }
    });
  });

  // Start observing the document body for configured mutations
  observer.observe(document.body, { childList: true, subtree: true });

  // Execute tasks immediately on initial load if conditions are met
  tasks.forEach(task => {
    if (task.check()) {
      task.action();
    }
  });

  return observer;
}

/**
 * Simulates a button click on a specified element by ID. This function is useful for automating interactions
 * or triggering actions that are typically initiated by user clicks.
 *
 * @param {string} buttonId - The ID of the button to simulate a click on.
 */
export function clickButtonById(buttonId) {
  const button = document.getElementById(buttonId);

  if (button) {
    console.log(`Triggering button click for ID: ${buttonId}.`);
    button.click();
  } else {
    console.error(`Button with ID '${buttonId}' not found.`);
  }
}

/**
 * Populates a specified input field with a given value. This function is particularly useful in scenarios where
 * data needs to be programmatically set in form elements, often in response to asynchronous operations or preset conditions.
 *
 * @param {string} inputId - The ID of the input field to populate.
 * @param {*} value - The value to populate the input field with.
 */
export function populateInputField(inputId, value) {
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
 * Inserts a new element directly below a specified anchor in the DOM. This function supports adding dynamically created elements
 * into the DOM with specific attributes, styles, and event listeners, making it versatile for various use cases like inserting
 * custom UI components.
 *
 * @param {string} anchorSelector - A selector to identify the anchor element to insert the new element below.
 * @param {string} newElementId - The ID to assign to the new element.
 * @param {string} elementType - The type of element to create (e.g., 'div', 'span').
 * @param {Object} options - Optional parameters including styles, attributes, eventListeners, and content.
 * @returns {HTMLElement|null} The newly created element, or null if creation was not possible.
 */
export function insertElementBelowAnchor(anchorSelector, newElementId, elementType, options = {}) {
  const anchor = document.querySelector(anchorSelector);
  if (!anchor) {
    console.error(`Anchor element with selector '${anchorSelector}' not found.`);
    return null;
  }

  if (document.getElementById(newElementId)) {
    console.error(`Element with ID '${newElementId}' already exists.`);
    return null;
  }

  const newElement = document.createElement(elementType);
  newElement.setAttribute("id", newElementId);

  if (options.styles) {
    Object.assign(newElement.style, options.styles);
  }
  if (options.attributes) {
    for (let attr in options.attributes) {
      newElement.setAttribute(attr, options.attributes[attr]);
    }
  }
  if (options.eventListeners) {
    options.eventListeners.forEach(listener => {
      newElement.addEventListener(listener.type, listener.handler);
    });
  }
  if (options.content) {
    newElement.textContent = options.content;
  }

  anchor.parentNode.insertBefore(newElement, anchor.nextSibling);
  return newElement;
}

/**
 * Appends a new child element to a specified parent element in the DOM. This utility function facilitates the dynamic addition
 * of elements into existing structures, supporting complex UI constructions dynamically based on application state or user interactions.
 *
 * @param {string} parentId - The ID of the parent element to append the new child to.
 * @param {string} childId - The ID to assign to the new child element.
 * @param {string} childType - The type of element to create and append.
 * @param {Object} options - Optional parameters including styles, attributes, eventListeners, and content.
 * @returns {HTMLElement|null} The newly appended child element, or null if the operation failed.
 */
export function appendChildToElement(parentId, childId, childType, options = {}) {
  const parent = document.getElementById(parentId);
  if (!parent) {
    console.error(`Parent element with ID '${parentId}' not found.`);
    return null;
  }

  if (document.getElementById(childId)) {
    console.error(`Child element with ID '${childId}' already exists.`);
    return null;
  }

  const childElement = document.createElement(childType);
  childElement.setAttribute("id", childId);

  if (options.styles) {
    Object.assign(childElement.style, options.styles);
  }
  if (options.attributes) {
    for (let attr in options.attributes) {
      childElement.setAttribute(attr, options.attributes[attr]);
    }
  }
  if (options.eventListeners) {
    options.eventListeners.forEach(listener => {
      childElement.addEventListener(listener.type, listener.handler);
    });
  }
  if (options.content) {
    childElement.textContent = options.content;
  }

  parent.appendChild(childElement);
  return childElement;
}


export function wait(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}
