// ==UserScript==
// @name         Override Pointer Events for Checkboxes with Button on Header Detection
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Add a button to override pointer-events for checkboxes when "PO Line Items" header appears, reset button after each click, remove button if header is not present
// @author       Ummair Radi
// @match        https://inupco.nupco.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    let button;
    let observer;
    let interactionInProgress = false;

    // Function to create and append the button
    function createButton() {
        if (!button) {
            button = document.createElement('button');
            button.textContent = 'Enable Checkbox';
            button.style.position = 'fixed';
            button.style.top = '10px';
            button.style.left = '50%';
            button.style.transform = 'translateX(-50%)';
            button.style.zIndex = '1000';
            button.style.padding = '10px 20px';
            button.style.backgroundColor = '#E06E0E';
            button.style.color = '#fff';
            button.style.border = 'none';
            button.style.borderRadius = '5px';
            button.style.cursor = 'pointer';

            // Append the button to the body
            document.body.appendChild(button);

            // Add click event listener to the button
            button.addEventListener('click', () => {
                // Indicate that an interaction is in progress
                interactionInProgress = true;

                // Select all checkboxes with the specific pointer-events style
                const checkboxes = document.querySelectorAll('.check-dependancy .po-table tr:not(:first-child) td .check-input');

                if (checkboxes.length > 0) {
                    checkboxes.forEach((checkbox) => {
                        checkbox.style.pointerEvents = 'auto'; // Set pointer-events to auto to enable interaction
                    });

                    // Provide feedback that the action was completed
                    button.textContent = 'Checkbox Enabled';
                    button.style.backgroundColor = '#4CAF50';
                    button.disabled = true;

                    // Reset the button after 3 seconds
                    setTimeout(() => {
                        if (document.body.contains(button)) {
                            button.textContent = 'Enable Checkbox';
                            button.style.backgroundColor = '#E06E0E';
                            button.disabled = false;
                        }
                        interactionInProgress = false; // Interaction complete
                    }, 3000);

                    // Optional: Log to console for debugging
                    console.log('Pointer events overridden for checkboxes:', checkboxes);
                } else {
                    console.error('No checkboxes found to override pointer events.');
                    interactionInProgress = false;
                }
            });
        }
    }

    // Function to remove the button if it's present and no interaction is in progress
    function removeButton() {
        if (button && !interactionInProgress) {
            button.remove();
            button = null;
        }
    }

    // Function to observe for the header appearance
    function observeHeader() {
        observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length || mutation.removedNodes.length) {
                    const header = document.querySelector('h2.po-sec-header__text, h2.po-sec-header__text--add-mode');
                    if (header && (header.textContent.trim() === 'PO Line Items' || header.textContent.includes('items selected'))) {
                        createButton();
                    } else {
                        removeButton();
                    }
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Start observing the DOM for the header continuously
    observeHeader();

})();
