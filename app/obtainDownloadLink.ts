import { v4 as uuidv4 } from "uuid";
import generateRandomString from "./generateRandomString";
import sql from "./pg";

export async function getDownloadLink(item: string) {
  try {
    const randomString = generateRandomString(14);
    const uuiddd = uuidv4();
  } catch (e) {}
}
