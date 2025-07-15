import sql from "./pg";
import { v4 as uuidv4 } from "uuid";
import * as pathp from "path";

export async function AddFile(path: string, hash: string) {
  console.log(`Add file ${path.replace("data/", "")}, hash: ${hash}`);
  try {
    const fileNameWithoutExt = pathp.parse(path).name;
    const runSQLQuery = await sql`
      INSERT INTO file (uuid, path, download_uuid, file_name, file_hash)
      VALUES (${uuidv4()}, ${fileNameWithoutExt}, ${uuidv4()}, ${path}, ${hash})
      ON CONFLICT (path) DO UPDATE
      SET
        path = file.path || '_' || (
          SELECT COALESCE(
            (SELECT MAX(CAST(REGEXP_REPLACE(f2.path, '^.*_([0-9]+)$', '\1') AS INTEGER)) + 1
            FROM file f2
            WHERE f2.path ~ ('^' || ${fileNameWithoutExt} || '_[0-9]+$')
          ), 1)
        )
    `;
    console.log(runSQLQuery);
  } catch (e) {
    console.error("Error adding file:", e);
  }
}

export async function ChangeFile(path: string, hash: string) {
  console.log(`Change file ${path.replace("data/", "")}, hash: ${hash}`);
  try {
    await sql`
      UPDATE file
      SET file_hash = ${hash}
      WHERE path = ${path}
    `;
  } catch (e) {
    console.error("Error changing file:", e);
  }
}

export async function RemoveFile(path: string) {
  console.log(`Remove file ${path.replace("data/", "")}`);
  try {
    await sql`
      DELETE FROM file
      WHERE path = ${path}
    `;
  } catch (e) {
    console.error("Error removing file:", e);
  }
}
