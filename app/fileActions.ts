import sql from "./pg";
import { v4 as uuidv4 } from "uuid";
import * as pathp from "path";

export async function AddFile(path: string, hash: string) {
  console.log(`Add file ${path.replace("data/", "")}, hash: ${hash}`);
  try {
    const fileNameWithoutExt = pathp.parse(path).name;
    const runSQLQuery = await sql`
      INSERT INTO file (uuid, path, download_uuid, file_name, file_hash)
      VALUES (
        ${uuidv4()},
        ${path},
        ${uuidv4()},
        ${fileNameWithoutExt},
        ${hash}
      )
      ON CONFLICT (path)
      DO UPDATE SET
        file_hash = CASE
          WHEN file.file_hash = ${hash} THEN file.file_hash
          ELSE ${hash}
        END
      RETURNING *
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
