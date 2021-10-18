const mainThread = document.getElementById("main-thread");
const worker2 = document.getElementById("worker-2");
const worker3 = document.getElementById("worker-3");
const worker4 = document.getElementById("worker-4");

const addBtn = document.getElementById("add-btn");
const minusBtn = document.getElementById("rest-btn");
const enableThreadsInput = document.getElementById("enable-threads");
const itemsNumberInput = document.getElementById("num-items");
const counterResult = document.getElementById("counter-result");

// timers elements
const timerSpan2 = document.getElementById("timer-worker-2");
const timerSpan3 = document.getElementById("timer-worker-3");
const timerSpan4 = document.getElementById("timer-worker-4");

var counter = 0;
var counter2 = 0;
var counter3 = 0;
var counter4 = 0;
var interval = null;
var interval2 = null;
var interval3 = null;
var interval4 = null;

const uniqueValuesResult = {
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0,
  6: 0,
  7: 0,
  8: 0,
  9: 0,
  10: 0,
};

if (window.Worker) {
  var myWorker2 = new Worker("worker2.js");
  var myWorker3 = new Worker("worker3.js");
  var myWorker4 = new Worker("worker4.js");
}

// addBtn.onclick = () => {
//   counter++;
//   counterResult.innerText = counter;
// };
// minusBtn.onclick = () => {
//   if (counter === 0) {
//     return;
//   }

//   counter--;
//   counterResult.innerText = counter;
// };

// var areThreadsEnabled = false;

function fillResults(results) {
  const list = document.querySelectorAll(
    "#results-list li > div.result-content"
  );
  // const list2 = document.querySelectorAll("#results-list li > div.bar");
  // console.log("_fillResults result dom list: ", list, list2);
  // console.log("_fillResults result unique values: ", results);
  Array.from(list).forEach((element, i) => {
    element.textContent = results[i + 1]?.toLocaleString();
  });
}

function createArray(iter) {
  let arr = [];
  for (let i = 0; i < iter; i++) {
    arr.push(Math.ceil(Math.random() * 10));
  }
  return arr;
}

function runInMainThread(iter) {
  console.log(
    "%c [main thread] ",
    "background-color: red; color: white; font-size: 16px"
  );

  console.time("create array");
  const arr = createArray(iter);
  console.timeEnd("create array");
  console.time("reduce sum array");
  const sum = arr.reduce((accum, i) => accum + i, 0);
  console.log(sum);
  console.timeEnd("reduce sum array");

  console.time("uniqueValuesCounter");
  const uniqueValuesCounter = arr.reduce((accum, item) => {
    if (accum[item]) {
      accum[item] += 1;
    } else {
      accum[item] = 1;
    }
    return accum;
  }, {});
  console.timeEnd("uniqueValuesCounter");
  console.log("uniqueValuesCounter obj: ", uniqueValuesCounter);

  fillResults(uniqueValuesCounter);
}

// enableThreadsInput.onchange = (e) => {
//   console.log("input threads: ", e, e.currentTarget.checked);
//   areThreadsEnabled = e.currentTarget.checked;
// };

myWorker2.onmessage = function (e) {
  console.log("Message received from worker: ", e.data);
  const { type, payload } = e.data;
  window.clearInterval(interval2);
  if (type === "unique_values") {
    fillResults(payload);
  }
};
myWorker3.onmessage = function (e) {
  console.log("Message received from worker: ", e.data);
  const { type, payload } = e.data;
  window.clearInterval(interval3);
  if (type === "unique_values") {
    fillResults(payload);
  }
};
myWorker4.onmessage = function (e) {
  console.log("Message received from worker: ", e.data);
  const { type, payload } = e.data;
  window.clearInterval(interval4);
  if (type === "unique_values") {
    fillResults(payload);
  }
};

function sleep() {
  return new Promise((resolve) =>
    window.setTimeout(resolve, Math.random() * 7000 + 3000)
  );
}

function runInWorker(worker) {
  console.log(
    "%c [worker] :",
    "background-color: red; color: white; font-size: 16px",
    worker
  );
  console.log("itemsNumber: ", itemsNumberInput.value);
  // counter = 0;

  const iter = parseInt(itemsNumberInput.value);
  if (iter > 100000000) {
    alert("Número excede el límete de 100.000.000 ");
    return;
  }

  switch (worker) {
    case 1:
      runInMainThread(iter);
      break;
    case 2:
      counter2 = 0;
      window.clearInterval(interval2);
      myWorker2.postMessage({ iter });
      interval2 = window.setInterval(() => {
        counter2 += 20;
        timerSpan2.innerText = counter2;
      }, 20);
      break;
    case 3:
      counter3 = 0;
      window.clearInterval(interval3);
      myWorker3.postMessage({ iter });
      interval3 = window.setInterval(() => {
        counter3 += 20;
        timerSpan3.innerText = counter3;
      }, 20);
      break;
    case 4:
      counter4 = 0;
      window.clearInterval(interval4);
      myWorker4.postMessage({ iter });
      interval4 = window.setInterval(() => {
        counter4 += 20;
        timerSpan4.innerText = counter4;
      }, 20);
      break;
    default:
      runInMainThread(iter);
  }
}

mainThread.addEventListener("click", async () => {
  runInWorker(1);
});
worker2.addEventListener("click", async () => {
  runInWorker(2);
});
worker3.addEventListener("click", async () => {
  runInWorker(3);
});
worker4.addEventListener("click", async () => {
  runInWorker(4);
});
