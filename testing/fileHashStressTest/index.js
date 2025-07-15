import fs from "fs"; // This should be bun (and already imported)
import chokidar from "chokidar";
import * as crypto from "crypto";
import { $ } from "bun";
await $`rm -rf ./data`;
await $`mkdir ./data`;
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

var fileCount = 0;
const calculateHash = (filePath) => {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash("sha256");
    const stream = fs.createReadStream(filePath);

    stream.on("error", reject);
    stream.on("data", (chunk) => hash.update(chunk));
    stream.on("end", () => resolve(hash.digest("hex")));
  });
};

const watcher = chokidar.watch("./data/", {
  ignored: /(^|[/\\])\../,
  persistent: true,
});

watcher.on("add", async (path) => {
  fileCount += 1;
  try {
    const hash = await calculateHash(path);
    console.log(`File: ${path}, SHA256 Hash: ${hash}`);
  } catch (error) {
    console.error(`Error calculating hash for ${path}:`, error);
  }
  console.log(
    `Current file: ${fileCount}, ran for ${Math.round(performance.now() - startTime)} milliseconds`,
  );
});

watcher.on("change", async (path) => {
  try {
    const hash = await calculateHash(path);
    console.log(`File: ${path}, SHA256 Hash: ${hash}`);
  } catch (error) {
    console.error(`Error calculating hash for ${path}:`, error);
  }
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
    fs.writeFileSync(fileName, content);
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
}
createFiles(totalFileCount, 100);
