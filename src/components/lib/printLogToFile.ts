export default function printLogToFile(data: any) {
  const fs = require("fs");
  const file = "outputLog.json";
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
  console.log(`-----------Log printed to ${file}`);
  return;
}
