import fs from "fs"; // This should be bun (and already imported)
import chokidar from "chokidar";
import * as crypto from "crypto";

const calculateHash = (filePath) => {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash("sha256");
    const stream = fs.createReadStream(filePath);

    stream.on("error", reject);
    stream.on("data", (chunk) => hash.update(chunk));
    stream.on("end", () => resolve(hash.digest("hex")));
  });
};

const watcher = chokidar.watch("./data", {
  ignored: /(^|[/\\])\../,
  persistent: true,
});

watcher.on("add", async (path) => {
  try {
    const hash = await calculateHash(path);
    console.log(`File: ${path}, SHA256 Hash: ${hash}`);
  } catch (error) {
    console.error(`Error calculating hash for ${path}:`, error);
  }
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
    const fileName = `${generateRandomString("5")}.txt`;
    const content = generateRandomString("10");
    fs.writeFileSync(fileName, content);
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
}
createFiles(100, 100);
