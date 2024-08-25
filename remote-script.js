// ==UserScript==
// @name         Override Pointer Events for Checkboxes with Button on Header Detection
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Add a button to override pointer-events for checkboxes when "PO Line Items" header appears, reset button after each click
// @author       You
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let button;

    // Function to create and append the button
    function createButton() {
        if (!button) {
            button = document.createElement('button');
            button.textContent = 'Disable Pointer Events';
            button.style.position = 'fixed';
            button.style.top = '10px';
            button.style.left = '50%';
            button.style.transform = 'translateX(-50%)';
            button.style.zIndex = '1000';
            button.style.padding = '10px 20px';
            button.style.backgroundColor = '#ff4b4b';
            button.style.color = '#fff';
            button.style.border = 'none';
            button.style.borderRadius = '5px';
            button.style.cursor = 'pointer';

            // Append the button to the body
            document.body.appendChild(button);

            // Add click event listener to the button
            button.addEventListener('click', () => {
                // Select all checkboxes with the specific pointer-events style
                const checkboxes = document.querySelectorAll('.check-dependancy .po-table tr:not(:first-child) td .check-input');

                if (checkboxes.length > 0) {
                    checkboxes.forEach((checkbox) => {
                        checkbox.style.pointerEvents = 'auto'; // Set pointer-events to auto to enable interaction
                    });

                    // Provide feedback that the action was completed
                    button.textContent = 'Pointer Events Disabled';
                    button.style.backgroundColor = '#4CAF50';

                    // Reset the button after 3 seconds
                    setTimeout(() => {
                        button.textContent = 'Disable Pointer Events';
                        button.style.backgroundColor = '#ff4b4b';
                        button.disabled = false;
                    }, 3000);

                    // Optional: Log to console for debugging
                    console.log('Pointer events overridden for checkboxes:', checkboxes);
                } else {
                    console.error('No checkboxes found to override pointer events.');
                }
            });
        }
    }

    // Function to observe for the header appearance
    function observeHeader() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    const header = document.querySelector('h2.po-sec-header__text');
                    if (header && header.textContent.trim() === 'PO Line Items') {
                        createButton();
                        observer.disconnect(); // Stop observing once the button is added
                    }
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Start observing the DOM for the header
    observeHeader();

})();
