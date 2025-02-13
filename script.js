let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
let target = 7;
let index = 0;
let history = [];
let currentArray = [...arr]; // Make a copy of the array for visualization

// Display the array on the screen
function displayArray() {
    const arrayContainer = document.getElementById("array-container");
    arrayContainer.innerHTML = '';

    currentArray.forEach((el, i) => {
        const elementDiv = document.createElement("div");
        elementDiv.classList.add("array-element");
        elementDiv.textContent = el;
        
        if (i === history[index]) {
            elementDiv.classList.add("current");
        }
        
        if (el === target && i === history[index]) {
            elementDiv.classList.add("found");
        }
        
        arrayContainer.appendChild(elementDiv);
    });
}

// Show step information
function updateStepInfo() {
    const stepInfo = document.getElementById("current-step");
    if (history[index] === undefined) {
        stepInfo.textContent = `Searching for ${target}...`;
    } else {
        stepInfo.textContent = `Checking index ${history[index]}: Value is ${currentArray[history[index]]}`;
    }

    document.getElementById("next-btn").disabled = index >= history.length;
    document.getElementById("back-btn").disabled = index <= 0;
}

// Recursive linear search with visualization
function recursiveLinearSearch(arr, target, idx = 0) {
    if (idx >= arr.length) return null;
    history.push(idx);

    if (arr[idx] === target) return idx;

    // Swap elements to show the iteration (for visual effect)
    if (arr[idx] > arr[idx + 1]) {
        [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]]; // Swap elements
        currentArray = [...arr]; // Update the current array copy for visualization
    }

    return recursiveLinearSearch(arr, target, idx + 1);
}

// Move to the next step
function nextStep() {
    if (index < history.length) {
        index++;
        displayArray();
        updateStepInfo();
    }
}

// Go back to the previous step
function backStep() {
    if (index > 0) {
        index--;
        displayArray();
        updateStepInfo();
    }
}

// Start the search and record each step
function startSearch() {
    history = [];
    index = 0;
    currentArray = [...arr]; // Reset the array to its original state
    recursiveLinearSearch(arr, target); // Run the search
    displayArray(); // Initial display
    updateStepInfo(); // Initial step info
}

startSearch(); // Begin the visualization


let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];  // Sorted array
let target = 7;  // The target element we are searching for
let left = 0;  // Left boundary of the search range
let right = arr.length - 1;  // Right boundary of the search range
let history = [];  // To track the steps
let currentMid = null;  // Current middle index being checked
let foundIndex = null;  // To track if the element is found

// Display the array with the current state
function displayArray() {
    const arrayContainer = document.getElementById("array-container");
    arrayContainer.innerHTML = '';

    arr.forEach((el, i) => {
        const elementDiv = document.createElement("div");
        elementDiv.classList.add("array-element");
        elementDiv.textContent = el;

        if (i === currentMid) {
            elementDiv.classList.add("current");
        }

        if (i === left || i === right) {
            elementDiv.classList.add("boundary");
        }

        if (i === foundIndex) {
            elementDiv.classList.add("found");
        }

        arrayContainer.appendChild(elementDiv);
    });
}

// Update the step info text
function updateStepInfo() {
    const stepInfo = document.getElementById("current-step");

    if (foundIndex !== null) {
        stepInfo.textContent = `Element ${target} found at index ${foundIndex}`;
    } else {
        stepInfo.textContent = `Searching in range [${left}, ${right}], checking middle index ${currentMid}: Value is ${arr[currentMid]}`;
    }

    document.getElementById("next-btn").disabled = foundIndex !== null || left > right;
    document.getElementById("back-btn").disabled = left === 0 && right === arr.length - 1;
}

// Binary search step function
function binarySearchStep() {
    if (left > right) {
        foundIndex = null;  // Target not found
        return;
    }

    currentMid = Math.floor((left + right) / 2);
    history.push({ left, right, mid: currentMid });

    if (arr[currentMid] === target) {
        foundIndex = currentMid;
    } else if (arr[currentMid] < target) {
        left = currentMid + 1;
    } else {
        right = currentMid - 1;
    }
}

// Move to the next step
function nextStep() {
    if (foundIndex !== null || left > right) {
        return;
    }

    binarySearchStep();
    displayArray();
    updateStepInfo();
}

// Go back to the previous step
function backStep() {
    if (history.length <= 1) {
        return;
    }

    history.pop();
    const lastStep = history[history.length - 1];
    left = lastStep.left;
    right = lastStep.right;
    currentMid = lastStep.mid;

    foundIndex = null;
    displayArray();
    updateStepInfo();
}

// Start the binary search
function startSearch() {
    history = [];
    left = 0;
    right = arr.length - 1;
    foundIndex = null;
    currentMid = null;

    displayArray();
    updateStepInfo();
}

startSearch(); // Begin the search visualization
