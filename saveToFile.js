import fs from "fs";

const filesDir = "./files";

export const appendToFile = (dataToAppend, startTimestamp) => {



// create folder if doesn't exist
if(!fs.existsSync(filesDir)){
fs.mkdirSync(filesDir);
}

 
  fs.appendFileSync(
    filesDir + "/" + startTimestamp + "-allChecked.log",
    dataToAppend + "\n"
  );
};
