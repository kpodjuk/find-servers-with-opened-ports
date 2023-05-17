import isPortReachable from "is-port-reachable";

let portToCheck = 25626;

const testIP = "88.198.54.20";

let ipSearchStart = [192, 168, 0, 0];
let ipSearchEnd = [192, 168, 1, 255];

// isPortReachable(25626, { host: testIP }).then((open) => {
//   if (open) {
//     console.log("reachable");
//   } else {
//     console.log("unreachable");
//   }
// });

const ipsToCheck = 10;

const getNextIp = (para) => {
  switch (para) {
    default:
      return "0.0.0.0";
      break;
    case 5:
      return "88.198.54.20";
      break;
  }
};

const checkEveryIp = async (_) => {
  console.log("Started!");

  for (let i = 0; i < ipsToCheck; i++) {
    const ipToCheck = getNextIp(i);
    const reachable = await isPortReachable(portToCheck, { host: ipToCheck });
    console.log(ipToCheck + "= " + reachable);
  }

  console.log("Done!");
};

// checkEveryIp();

let arrayWithIps = [];

const iterateOverIpRanges = () => {
  let iterator;

  let startIP =
    (ipSearchStart[0] << 24) |
    (ipSearchStart[1] << 16) |
    (ipSearchStart[2] << 8) |
    ipSearchStart[3];
  let endIP =
    (ipSearchEnd[0] << 24) |
    (ipSearchEnd[1] << 16) |
    (ipSearchEnd[2] << 8) |
    ipSearchEnd[3];

  for (iterator = startIP; iterator < endIP; iterator++) {
    let ipString = ((iterator & 0xff000000) >>> 24) + ".";
    ipString += ((iterator & 0x00ff0000) >>> 16) + ".";
    ipString += ((iterator & 0x0000ff00) >>> 8) + ".";
    ipString += iterator & 0x000000ff;
    arrayWithIps.push(ipString);
  }
};

iterateOverIpRanges();

console.log(arrayWithIps);
console.log("Total=" + arrayWithIps.length);
