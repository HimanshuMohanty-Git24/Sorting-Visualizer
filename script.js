const n = 40;
const array = [];
let selectedAlgorithm = "bubbleSort"; // Default algorithm
let audioCtx = null;

const container = document.getElementById("container");

init();

function init() {
  for (let i = 0; i < n; i++) {
    array[i] = Math.random();
  }
  showBars();
}

function changeAlgorithm() {
  selectedAlgorithm = document.getElementById("algoSelect").value;
}

function play() {
  let steps;
  switch (selectedAlgorithm) {
    case "bubbleSort":
      steps = bubbleSort([...array]);
      break;
    case "selectionSort":
      steps = selectionSort([...array]);
      break;
    case "insertionSort":
      steps = insertionSort([...array]);
      break;
    case "mergeSort":
      console.log("mergeSort");
      steps = mergeSort([...array]);
      break;
    case "heapSort":
      console.log("heapSort");
      steps = heapSort([...array]);
      break;
    case "quickSort":
      console.log("quickSort");
      steps = quickSort([...array]);
      break;
    case "combSort": // Add Comb Sort case
      console.log("combSort");
      steps = combSort([...array]);
      break;
    default:
      console.error("Invalid algorithm selected");
      return;
  }
  animate(steps);
}

function stop() {
  animate([]);
  init();
  audioCtx.close();
  location.reload();
}

function animate(steps) {
  console.log(selectedAlgorithm);
  console.log(steps);
  if (!Array.isArray(steps) || steps.length === 0) {
    showBars();
    return;
  }

  const step = steps.shift();

  if (Array.isArray(step)) {
    const [i, j] = step;
    if (typeof i !== "undefined" && typeof j !== "undefined") {
      [array[i], array[j]] = [array[j], array[i]];
      showBars([i, j]);
      playNote(200 + array[i] * 500);
      playNote(200 + array[j] * 500);
    }
  } else if (typeof step === "object" && step !== null) {
    const { type, payload } = step;
    switch (type) {
      case "merge":
        const [mergeIndex, mergedArray] = payload;
        array.splice(mergeIndex, mergedArray.length, ...mergedArray);
        showBars(mergedArray.map((_, index) => mergeIndex + index));
        playNote(200 + array[mergeIndex] * 500);
        break;
      case "partition":
        const [partitionIndex, pivotIndex] = payload;
        showBars([partitionIndex, pivotIndex]);
        playNote(200 + array[partitionIndex] * 500);
        playNote(200 + array[pivotIndex] * 500);
        break;
      default:
        console.error("Invalid step type");
        break;
    }
  }

  setTimeout(function () {
    animate(steps);
  }, 30);
}

// Comb Sort
function combSort(array) {
  let gap = array.length;
  let swaps = [];
  let swapped = true;

  while (gap > 1 || swapped) {
    gap = getNextGap(gap);
    swapped = false;

    for (let i = 0; i < array.length - gap; i++) {
      if (array[i] > array[i + gap]) {
        swaps.push([i, i + gap]);
        [array[i], array[i + gap]] = [array[i + gap], array[i]];
        swapped = true;
      }
    }
  }

  return swaps;
}
// Get next gap
function getNextGap(gap) {
  gap = (gap * 10) / 13;
  if (gap < 1) {
    return 1;
  }
  return gap;
}


function bubbleSort(array) {
  let swaps = [];
  let swapped;
  do {
    swapped = false;
    for (let i = 1; i < array.length; i++) {
      if (array[i - 1] > array[i]) {
        swaps.push([i - 1, i]);
        swapped = true;
        [array[i - 1], array[i]] = [array[i], array[i - 1]];
      }
    }
  } while (swapped);
  return swaps;
}
// Selection Sort
function selectionSort(array) {
  let swaps = [];

  for (let i = 0; i < array.length - 1; i++) {
    let minIndex = i;
    for (let j = i + 1; j < array.length; j++) {
      if (array[j] < array[minIndex]) {
        minIndex = j;
      }
    }
    if (minIndex !== i) {
      swaps.push([i, minIndex]);
      [array[i], array[minIndex]] = [array[minIndex], array[i]];
    }
  }

  return swaps;
}

// Insertion Sort
function insertionSort(array) {
  let swaps = [];

  for (let i = 1; i < array.length; i++) {
    let current = array[i];
    let j = i - 1;

    while (j >= 0 && array[j] > current) {
      swaps.push([j, j + 1]);
      array[j + 1] = array[j];
      j--;
    }

    array[j + 1] = current;
  }

  return swaps;
}


/*Merge Sort correct implementation */
function mergeSort(array) {
  const steps = [];

  function mergeSortHelper(arr, start = 0, end = arr.length - 1) {
    if (start < end) {
      const mid = Math.floor((start + end) / 2);
      mergeSortHelper(arr, start, mid);
      mergeSortHelper(arr, mid + 1, end);
      merge(arr, start, mid, end);
    }
  }

  function merge(arr, start, mid, end) {
    const left = arr.slice(start, mid + 1);
    const right = arr.slice(mid + 1, end + 1);

    let i = 0;
    let j = 0;
    let k = start;

    while (i < left.length && j < right.length) {
      steps.push({
        type: "merge",
        payload: [k, [left[i], right[j]]],
      });

      if (left[i] <= right[j]) {
        arr[k] = left[i];
        i++;
      } else {
        arr[k] = right[j];
        j++;
      }

      k++;
    }

    while (i < left.length) {
      arr[k] = left[i];
      steps.push({
        type: "merge",
        payload: [k, [left[i]]],
      });
      i++;
      k++;
    }

    while (j < right.length) {
      arr[k] = right[j];
      steps.push({
        type: "merge",
        payload: [k, [right[j]]],
      });
      j++;
      k++;
    }
  }

  mergeSortHelper(array);
  return steps;
}

// Heap Sort
function heapSort(array) {
  const steps = [];

  function buildMaxHeap(arr) {
    const n = arr.length;
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      maxHeapify(arr, i, n);
    }
  }

  function maxHeapify(arr, i, heapSize) {
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    let largest = i;

    if (left < heapSize && arr[left] > arr[largest]) {
      largest = left;
    }

    if (right < heapSize && arr[right] > arr[largest]) {
      largest = right;
    }

    if (largest !== i) {
      steps.push([i, largest]);
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      maxHeapify(arr, largest, heapSize);
    }
  }

  buildMaxHeap(array);

  for (let i = array.length - 1; i > 0; i--) {
    steps.push([0, i]);
    [array[0], array[i]] = [array[i], array[0]];
    maxHeapify(array, 0, i);
  }

  return steps;
}

function quickSort(array) {
  const steps = [];

  function quickSortHelper(arr, low, high) {
    if (low < high) {
      const pivotIndex = partition(arr, low, high);
      quickSortHelper(arr, low, pivotIndex - 1);
      quickSortHelper(arr, pivotIndex + 1, high);
    }
  }

  function partition(arr, low, high) {
    const pivot = arr[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
      if (arr[j] < pivot) {
        i++;
        steps.push([i, j]);
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }

    steps.push([i + 1, high]);
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];

    return i + 1;
  }

  quickSortHelper(array, 0, array.length - 1);
  return steps;
}

function showBars(indices) {
  container.innerHTML = "";
  for (let i = 0; i < array.length; i++) {
    const bar = document.createElement("div");
    bar.style.height = array[i] * 100 + "%";
    bar.classList.add("bar");
    if (indices && indices.includes(i)) {
      bar.style.backgroundColor = "red";
    }
    container.appendChild(bar);
  }
}

function playNote(freq) {
  if (audioCtx == null) {
    audioCtx = new (AudioContext ||
      webkitAudioContext ||
      window.webkitAudioContext)();
  }
  const dur = 0.1;
  const osc = audioCtx.createOscillator();
  osc.frequency.value = freq;
  osc.start();
  osc.stop(audioCtx.currentTime + dur);
  const node = audioCtx.createGain();
  node.gain.value = 0.1;
  node.gain.linearRampToValueAtTime(0, audioCtx.currentTime + dur);
  osc.connect(node);
  node.connect(audioCtx.destination);
}
