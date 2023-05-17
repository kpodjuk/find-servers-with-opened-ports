import isPortReachable from "is-port-reachable";
import { appendToFile } from "./saveToFile.js";

// parameters:
const portToCheck = 80;

const ipSearchStart = [88, 198, 54, 15];
const ipSearchEnd = [88, 198, 54, 25];

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

  console.log("################## Started! ##################");

  for (let iterator = startIP; iterator < endIP + 1; iterator++) {
    const ipToCheck = getIpStringFromIterator(iterator);
    const reachable = await isPortReachable(portToCheck, { host: ipToCheck });
    const checksDone = iterator - startIP + 1;

    let rowWithData =
      ipToCheck +
      "\t\t" +
      reachable +
      "\t\t" +
      "(" +
      checksDone +
      "/" +
      +checksToDo +
      ")";

    console.log(rowWithData);
    appendToFile(rowWithData);
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

checkEveryIp();
