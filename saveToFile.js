import fs from "fs";
import { hrtime } from "node:process";

export const appendToFile = (dataToAppend) => {
  let timeStamp = hrtime.bigint().toString();
  fs.appendFileSync(
    "../files/" + timeStamp + "-allChecked.log",
    dataToAppend + "/n"
  );
};
