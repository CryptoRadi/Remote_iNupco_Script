// ==UserScript==
// @name         Override Pointer Events for Checkboxes with Button on Header Detection
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add a button to override pointer-events for checkboxes when "PO Line Items" header appears
// @author       You
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Function to add the button once the header appears
    function addButtonWhenHeaderAppears() {
        const header = document.querySelector('h2.po-sec-header__text');

        if (header && header.textContent.trim() === 'PO Line Items') {
            // Create the button
            const button = document.createElement('button');
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

            // Add a click event listener to the button
            button.addEventListener('click', () => {
                // Select all checkboxes with the specific pointer-events style
                const checkboxes = document.querySelectorAll('.check-dependancy .po-table tr:not(:first-child) td .check-input');

                // Iterate through each checkbox and override the pointer-events style
                checkboxes.forEach((checkbox) => {
                    checkbox.style.pointerEvents = 'auto'; // Set pointer-events to auto to enable interaction
                });

                // Provide feedback that the action was completed
                button.textContent = 'Pointer Events Disabled';
                button.style.backgroundColor = '#4CAF50';
                button.disabled = true; // Disable the button after clicking

                // Optional: Log to console for debugging
                console.log('Pointer events overridden for checkboxes:', checkboxes);
            });
        } else {
            // Retry after a short delay if the header is not found yet
            setTimeout(addButtonWhenHeaderAppears, 500);
        }
    }

    // Start checking for the header to appear
    addButtonWhenHeaderAppears();
})();
