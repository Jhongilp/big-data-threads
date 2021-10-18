const mainThread = document.getElementById("main-thread");


const addBtn = document.getElementById("add-btn");
const minusBtn = document.getElementById("rest-btn");
const enableThreadsInput = document.getElementById("enable-threads");
const itemsNumberInput = document.getElementById("num-items");
const counterResult = document.getElementById("counter-result");


var counter = 0;

var interval = null;

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

function fillResults(results) {
  const list = document.querySelectorAll(
    "#results-list li > div.result-content"
  );
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





function runInWorker(worker) {
  

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
  console.log(
    "%c [main thread] :",
    "background-color: red; color: white; font-size: 16px"
  );
  console.log("itemsNumber: ", itemsNumberInput.value);

  const iter = parseInt(itemsNumberInput.value);
  if (iter > 100000000) {
    alert("Número excede el límete de 100.000.000 ");
    return;
  }
  runInMainThread(iter);
});
