  // tulip-customizer-commons.js
  
  // MutationObserver required to use other elements
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
  
    // Also execute tasks on initial load
    tasks.forEach(task => {
      if (task.check()) {
        task.action();
      }
    });
  
    return observer; // Returning the observer might be useful for disconnecting later
  }
    
  /**
   * Function to simulate a button click by the given button ID.
   * @param {string} buttonId - The ID of the button to be clicked.
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

  // Function to populate an input field with a specific value
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

  // Helper function to set the value of an input element for React-based applications
  // Should not be called directly.
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

  
    
  // Insert element below an anchor using a CSS selector with integrated error checking
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

    // Apply provided styles if they exist
    if (options.styles) {
        Object.assign(newElement.style, options.styles);
    }

    // Set attributes if they exist
    if (options.attributes) {
        for (let attr in options.attributes) {
            newElement.setAttribute(attr, options.attributes[attr]);
        }
    }

    // Add event listeners if they exist
    if (options.eventListeners) {
        options.eventListeners.forEach(listener => {
            newElement.addEventListener(listener.type, listener.handler);
        });
    }

    // Optionally set inner content if provided
    if (options.content) {
        newElement.textContent = options.content;
    }

    anchor.parentNode.insertBefore(newElement, anchor.nextSibling);
    return newElement;  // Return the created element for additional manipulation if needed
  }



  // Function to append a child element to a specified parent element
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

    // Apply styles, attributes, event listeners, and content if provided
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
    return childElement;  // Return the created element for additional manipulation if needed
}