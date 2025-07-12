import pg from "./pg";

export async function AddFile(path: string) {
  console.log(`Add file ${path.replace("data/", "")}`);
}

export async function ChangeFile(path: string) {
  console.log(`Change file ${path.replace("data/", "")}`);
}

export async function RemoveFile(path: string) {
  console.log(`Remove file ${path.replace("data/", "")}`);
}
