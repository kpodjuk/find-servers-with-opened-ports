import isPortReachable from "is-port-reachable";
import { appendToFile } from "./saveToFile.js";
import { hrtime } from "node:process";

// parameters:
const portToCheck = 80;
const ipSearchStart = [88, 198, 20, 0];
const ipSearchEnd = [88, 198, 20, 50];
const onlyAppendIfPortOpen = true;

// to get arg from cmd line:
var args = process.argv.slice(2);
process.argv.forEach(function (val, index, array) {
  console.log(index + ": " + val);
});

const checkEveryIp = async (_) => {
  // calculate first and last iterator
  const startIP =
    (ipSearchStart[0] << 24) |
    (ipSearchStart[1] << 16) |
    (ipSearchStart[2] << 8) |
    ipSearchStart[3];

  const endIP =
    (ipSearchEnd[0] << 24) |
    (ipSearchEnd[1] << 16) |
    (ipSearchEnd[2] << 8) |
    ipSearchEnd[3];

  const checksToDo = endIP - startIP + 1;

  // save time when search was started

  // const startTimestamp = (hrtime.bigint()/1000000n); // hrtime returns nanoseconds, converted to ms
  const startTimestamp = Date.now();
  console.log(startTimestamp);
  console.log("################## Started! ##################");

  for (let iterator = startIP; iterator < endIP + 1; iterator++) {
    benchmark.start();

    const ipToCheck = getIpStringFromIterator(iterator);
    const reachable = await isPortReachable(portToCheck, { host: ipToCheck });
    const checksDone = iterator - startIP + 1;

    let rowWithData =
      ipToCheck +
      "\t" +
      +portToCheck +
      "\t" +
      reachable +
      "\t" +
      benchmark.end() +
      "\t" +
      "(" +
      checksDone +
      "/" +
      +checksToDo +
      ")";

    console.log(rowWithData);
    if (onlyAppendIfPortOpen && reachable)
      appendToFile(rowWithData, startTimestamp);
    else appendToFile(rowWithData, startTimestamp);

    // benchmark.end();
  }

  console.log("################## Done! ##################");
};

const getIpStringFromIterator = (iterator) => {
  let ipString = ((iterator & 0xff000000) >>> 24) + ".";
  ipString += ((iterator & 0x00ff0000) >>> 16) + ".";
  ipString += ((iterator & 0x0000ff00) >>> 8) + ".";
  ipString += iterator & 0x000000ff;
  return ipString;
};

let benchmark = {
  startTimestamp: -1,
  endTimestamp: 0,
  took: -1,

  start() {
    this.startTimestamp = Date.now();
  },

  end() {
    this.endTimestamp = Date.now();
    this.took = this.endTimestamp - this.startTimestamp;
    // console.log("Took:" + this.took);
    return this.took + "ms";
  },
};

checkEveryIp();
