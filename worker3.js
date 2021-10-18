function createArray(iter) {
  let arr = [];
  for (let i = 0; i < iter; i++) {
    arr.push(Math.ceil(Math.random() * 10));
  }
  return arr;
}

onmessage = function (e) {
  console.log(
    "%c [worker 3] ",
    "background-color: orange; color: white; font-size: 16px"
  );

  const { iter } = e.data;
  console.time("create array");
  const arr = createArray(iter);
  // postMessage({ hilo: 3, arr });
  console.timeEnd("create array");
  console.time("reduce sum array");
  const sum = arr.reduce((accum, i) => accum + i, 0);
  console.log(sum);
  console.timeEnd("reduce sum array");

  // postMessage({ hilo: 3, sum });

  // map obj
  console.time("uniqueValuesCounter");
  const uniqueValuesCounter = arr.reduce((accum, item) => {
    
    if(accum[item]) {
      accum[item] += 1;
    } else {
      accum[item] = 1;
    }

    return accum;
  }, {})
  postMessage({ hilo: 3, type: "unique_values", payload: uniqueValuesCounter });
  console.timeEnd("uniqueValuesCounter");
  console.log("uniqueValuesCounter obj: ", uniqueValuesCounter)
};
