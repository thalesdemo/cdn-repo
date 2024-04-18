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


  // Insert element below an anchor class
  export function insertElementBelowAnchor(anchorClass, newElementId, elementType, options) {
    const anchor = document.querySelector(anchorClass);
    if (anchor && !document.getElementById(newElementId)) {
        const newElement = document.createElement(elementType);
        newElement.setAttribute("id", newElementId);

        // Apply provided styles
        if (options.styles) {
            Object.assign(newElement.style, options.styles);
        }

        // Set attributes like 'autoplay', 'playsinline', etc.
        if (options.attributes) {
            for (let attr in options.attributes) {
                newElement.setAttribute(attr, options.attributes[attr]);
            }
        }

        // Add event listeners
        if (options.eventListeners) {
            options.eventListeners.forEach(listener => {
                newElement.addEventListener(listener.type, listener.handler);
            });
        }

        // Optionally set inner content
        if (options.content) {
            newElement.textContent = options.content;
        }

        anchor.parentNode.insertBefore(newElement, anchor.nextSibling);
        return newElement;  // Return the created element for additional manipulation if needed
    }
  }

  // Function to set the value of an input element for React-based applications
  // Helper of populateInputField
  export function setNativeValue(element, value) {
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

