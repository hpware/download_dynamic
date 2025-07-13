import pg from "./pg";

export async function AddFile(path: string, hash: any) {
  console.log(`Add file ${path.replace("data/", "")}, hash: ${hash}`);
}

export async function ChangeFile(path: string, hash: any) {
  console.log(`Change file ${path.replace("data/", "")}, hash: ${hash}`);
}

export async function RemoveFile(path: string) {
  console.log(`Remove file ${path.replace("data/", "")}`);
}
