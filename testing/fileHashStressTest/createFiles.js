import fs from "node:fs"; // This should be bun (and already imported)
import * as crypto from "crypto";
import { $ } from "bun";
const startTime = performance.now();

const args = {
  fileCount:
    process.argv
      .find((arg) => arg.startsWith("--count=") || arg.startsWith("-c="))
      ?.split("=")[1] || "100",
};
const totalFileCount = parseInt(args.fileCount);
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log(
  "This will DELETE the entire ./data folder, make sure there aren't any files there. or you have a backup of it. after this benchmark, please `rm -r ./data` to folder.",
);

await new Promise((resolve) => {
  readline.question("Proceed? (y/N): ", (answer) => {
    readline.close();
    if (answer.toLowerCase() !== "y") {
      console.log("Operation cancelled");
      process.exit(0);
    }
    resolve();
  });
});

const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
function generateRandomString(length) {
  let slug = "";
  for (let times = 0; times < length; times++) {
    slug += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return slug;
}
async function createFiles(count, delayMs) {
  for (let i = 0; i < count; i++) {
    const fileName = `./data/${generateRandomString("5")}.txt`;
    const content = generateRandomString("10");
    console.log(`File created ${fileName}`);
    fs.writeFileSync(fileName, content);
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
}
createFiles(totalFileCount, 1);
