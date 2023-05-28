import isPortReachable from "is-port-reachable";
import { appendToFile } from "./saveToFile.js";
import { hrtime } from "node:process";

// parameters:
const portToCheck = 7777;
const ipSearchStart = [88, 198, 0, 0];
const ipSearchEnd = [88, 198, 255, 255];
const timeout = 1000;
const onlyAppendIfPortOpen = true;

// to get arg from cmd line:
var args = process.argv.slice(2);
process.argv.forEach(function (val, index, array) {
  console.log(index + ": " + val);
});

const checkEveryIp = async (_) => {
  let globalArr = [];

  console.time("Done in:");
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

  for (let iterator = startIP; iterator < endIP + 1; iterator++) {
    // create object for current ip address
    let ipAdress = {
      ip: -1,
      id: -1,
      portStatus: -1,
      checkedPort: portToCheck,
    };

    ipAdress.ip = getIpStringFromIterator(iterator);
    const checksDone = iterator - startIP + 1;

    ipAdress.id = checksDone;

    // console.log(ipAdress);

    isPortReachable(portToCheck, {
      host: ipAdress.ip,
      timeout: timeout,
    }).then((result) => {
      ipAdress.portStatus = result;
      globalArr.push(ipAdress);
      if (globalArr.length == checksToDo) {
        globalArr.sort((a, b) => a.id - b.id); // b - a for reverse sort

        if (onlyAppendIfPortOpen) {
          let onlyOpen = [];
          globalArr.forEach((value) => {
            if (value.portStatus == true) {
              onlyOpen.push(value);
            }
          });
          appendToFile(JSON.stringify(onlyOpen), startTimestamp);
        } else {
          appendToFile(JSON.stringify(globalArr), startTimestamp);
        }

        console.timeEnd("Done in:");
      }
    });

    // console.log(rowWithData);
    // if (onlyAppendIfPortOpen && reachable)
    // appendToFile(rowWithData, startTimestamp);
    // else if (!onlyAppendIfPortOpen) appendToFile(rowWithData, startTimestamp);

    // benchmark.end();
  }
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
