    // Generate a random sorted array
    const array = Array.from({ length: 10 }, () => Math.floor(Math.random() * 100));
    array.sort((a, b) => a - b);

    const initialArrayDiv = document.getElementById('initialArray');
    const stepsContainer = document.getElementById('stepsContainer');

    // Display the initial array in a single row (for reference)
    function displayInitialArray() {
      const row = document.createElement('div');
      row.className = 'array-row';
      array.forEach(num => {
        const box = document.createElement('div');
        box.className = 'box';
        box.textContent = num;
        row.appendChild(box);
      });
      initialArrayDiv.innerHTML = '<h4>Initial Sorted Array:</h4>';
      initialArrayDiv.appendChild(row);
    }
    displayInitialArray();

    // Clear the steps container before rendering new steps
    function resetSteps() {
      stepsContainer.innerHTML = '';
    }

    // Render an array of step objects
    function renderSteps(steps) {
      resetSteps();
      steps.forEach((step, index) => {
        const stepRow = document.createElement('div');
        stepRow.className = 'step-row';

        // Explanation text
        const explanation = document.createElement('div');
        explanation.className = 'explanation';
        explanation.textContent = `Step ${index + 1}: ${step.explanation}`;
        
        // Array row
        const arrayRow = document.createElement('div');
        arrayRow.className = 'array-row';

        array.forEach((val, idx) => {
          const box = document.createElement('div');
          box.classList.add('box');
          box.textContent = val;

          // Check highlights
          if (step.highlights.includes(idx)) {
            box.classList.add('highlight');
          }
          if (step.foundIndex === idx) {
            box.classList.add('found');
          }

          // Add a tooltip if it's a mid index (or mid1/mid2)
          const midObj = step.midIndexes.find(m => m.index === idx);
          if (midObj) {
            box.setAttribute(
              'data-title',
              `${midObj.label} = ${idx}, Value = ${array[idx]}`
            );
          }

          arrayRow.appendChild(box);
        });

        stepRow.appendChild(arrayRow);
        stepRow.appendChild(explanation);
        stepsContainer.appendChild(stepRow);
      });
    }

    /* 
      Build step arrays for each search
      Each step object: {
        highlights: [indices to highlight],
        foundIndex: index that is found or -1,
        midIndexes: array of {index, label}, e.g. [{index: 3, label: 'mid'}],
        explanation: string describing the step
      }
    */

    // 1) Linear Search
    function linearSearchSteps(arr, value) {
      const steps = [];
      let foundIndex = -1;

      for (let i = 0; i < arr.length; i++) {
        const step = {
          highlights: [i],
          foundIndex: -1,
          midIndexes: [], // No mid concept in linear
          explanation: `Checking index ${i}, value ${arr[i]}`
        };

        if (arr[i] === value) {
          step.foundIndex = i;
          step.explanation += ` — Found ${value} at index ${i}`;
          steps.push(step);
          foundIndex = i;
          break;
        } else {
          step.explanation += ` — Not found here`;
          steps.push(step);
        }
      }

      if (foundIndex === -1) {
        steps.push({
          highlights: [],
          foundIndex: -1,
          midIndexes: [],
          explanation: `Number ${value} not found in array`
        });
      }
      return steps;
    }

    // 2) Binary Search
    function binarySearchSteps(arr, value) {
      let left = 0;
      let right = arr.length - 1;
      const steps = [];
      let foundIndex = -1;

      while (left <= right) {
        const mid = Math.floor((left + right) / 2);

        const step = {
          highlights: [mid], // highlight only mid
          foundIndex: -1,
          midIndexes: [{ index: mid, label: 'mid' }],
          explanation: `Check index ${mid}, value ${arr[mid]}`
        };

        if (arr[mid] === value) {
          step.foundIndex = mid;
          step.explanation += ` — Found ${value} at index ${mid}`;
          steps.push(step);
          foundIndex = mid;
          break;
        } else if (arr[mid] < value) {
          step.explanation += ` — ${value} > ${arr[mid]}, move right`;
          steps.push(step);
          left = mid + 1;
        } else {
          step.explanation += ` — ${value} < ${arr[mid]}, move left`;
          steps.push(step);
          right = mid - 1;
        }
      }

      if (foundIndex === -1) {
        steps.push({
          highlights: [],
          foundIndex: -1,
          midIndexes: [],
          explanation: `Number ${value} not found in array`
        });
      }
      return steps;
    }

    // 3) Ternary Search
    function ternarySearchSteps(arr, value) {
      let left = 0;
      let right = arr.length - 1;
      const steps = [];
      let foundIndex = -1;

      while (left <= right) {
        const third = Math.floor((right - left) / 3);
        const mid1 = left + third;
        const mid2 = right - third;

        const step = {
          highlights: [mid1, mid2],
          foundIndex: -1,
          midIndexes: [
            { index: mid1, label: 'mid1' },
            { index: mid2, label: 'mid2' }
          ],
          explanation: `Check mid1=${mid1} (value ${arr[mid1]}) & mid2=${mid2} (value ${arr[mid2]})`
        };

        if (arr[mid1] === value) {
          step.foundIndex = mid1;
          step.explanation += ` — Found ${value} at mid1`;
          steps.push(step);
          foundIndex = mid1;
          break;
        } else if (arr[mid2] === value) {
          step.foundIndex = mid2;
          step.explanation += ` — Found ${value} at mid2`;
          steps.push(step);
          foundIndex = mid2;
          break;
        } else if (value < arr[mid1]) {
          step.explanation += ` — ${value} < ${arr[mid1]}, search left side`;
          steps.push(step);
          right = mid1 - 1;
        } else if (value > arr[mid2]) {
          step.explanation += ` — ${value} > ${arr[mid2]}, search right side`;
          steps.push(step);
          left = mid2 + 1;
        } else {
          step.explanation += ` — ${value} is between ${arr[mid1]} and ${arr[mid2]}, search middle`;
          steps.push(step);
          left = mid1 + 1;
          right = mid2 - 1;
        }
      }

      if (foundIndex === -1) {
        steps.push({
          highlights: [],
          foundIndex: -1,
          midIndexes: [],
          explanation: `Number ${value} not found in array`
        });
      }
      return steps;
    }

    // Button Click Handlers
    function showLinearSearch() {
      const value = parseInt(document.getElementById('searchValue').value);
      if (isNaN(value)) {
        alert('Please enter a valid number!');
        return;
      }
      const steps = linearSearchSteps(array, value);
      renderSteps(steps);
    }

    function showBinarySearch() {
      const value = parseInt(document.getElementById('searchValue').value);
      if (isNaN(value)) {
        alert('Please enter a valid number!');
        return;
      }
      const steps = binarySearchSteps(array, value);
      renderSteps(steps);
    }

    function showTernarySearch() {
      const value = parseInt(document.getElementById('searchValue').value);
      if (isNaN(value)) {
        alert('Please enter a valid number!');
        return;
      }
      const steps = ternarySearchSteps(array, value);
      renderSteps(steps);
    }
