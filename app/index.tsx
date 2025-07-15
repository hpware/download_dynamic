import { renderToReadableStream } from "react-dom/server";
import indexFile from "../html/index.html";
import DownloadPage from "./pages/download";
import sql from "./pg";
import createDB from "./create_database";
import fs from "fs";
import chokidar from "chokidar";
import { AddFile, RemoveFile, ChangeFile } from "./fileActions";
import * as crypto from "crypto";
import { getDownloadLink } from "./obtainDownloadLink";
import GetFile from "./getFile";

const styleCss = await fs.promises.readFile("./app/style.css");
const clientJsFilesUrlArray: any[] = [];
const startTime = performance.now();

// CHECK FOR INCORRECT VALUES
if (
  process.env.ENABLE_CAPTCHA.length !== 0 &&
  process.env.ENABLE_CAPTCHA?.toLocaleLowerCase() !== "true" &&
  process.env.ENABLE_CAPTCHA?.toLocaleLowerCase() !== "false"
) {
  console.log(
    "Please use true, false or none in the ENABLE_CAPTCHA .env value, the application WILL FAIL with this value",
  );
  process.exit(1);
}

for (const file of await fs.promises.readdir("./app/client_js")) {
  if (file.endsWith(".js")) {
    const filePath = `./app/client_js/${file}`;
    clientJsFilesUrlArray[`/__client_js/${file}`] = async () => {
      const content = await fs.promises.readFile(filePath, "utf-8");
      return new Response(content, {
        headers: {
          "Content-Type": "text/javascript",
        },
      });
    };
  }
}

async function checkDatabaseInit() {
  try {
    const check = await sql`
      SELECT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'file'
      ) as exists;
      `;
    const exists = check[0]?.exists || false;
    if (!exists) {
      console.log("Creating DB");
      await createDB();
    }
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
}

await checkDatabaseInit();

function calculateHash(filePath: string) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash("sha256");
    const stream = fs.createReadStream(filePath);

    stream.on("error", reject);
    stream.on("data", (chunk) => hash.update(chunk));
    stream.on("end", () => resolve(hash.digest("hex")));
  });
}

// WATCH FILES
const watcher = chokidar.watch("./data", {
  ignored: (path, stats) => stats?.isFile() && path.endsWith(".tmp"),
  persistent: true,
  usePolling: true,
  interval: 1000,
  awaitWriteFinish: true,
  useFsEvents: false,
  fseventsThreshold: 100000,
});

watcher
  .on("add", async (path) => AddFile(path, await calculateHash(path)))
  .on("change", async (path) => ChangeFile(path, await calculateHash(path)))
  .on("unlink", async (path) => RemoveFile(path));

// APP
Bun.serve({
  port: 3000,
  development: false,
  routes: {
    "/": indexFile,
    "/__style.css": () => {
      return new Response(styleCss, {
        headers: {
          "Content-Type": "text/css",
        },
      });
    },
    /*"/testing": () => {
      console.log("testing loaded");
      return new Response("hi");
      },*/
    ...clientJsFilesUrlArray,
    "/__dlaction/:userid/:dlid": async (req: Request) => {
      if (req.method !== "POST") {
        return new Response("Method not allowed", { status: 400 });
      }
      try {
        const captcha = process.env.ENABLE_CAPTCHA || "false";
        const url = new URL(req.url);
        const { dlid, userid } = req.params;
        const body = await req.json();
        const { turnstileRes } = body;
        if (
          !dlid.match(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
          )
        ) {
          return new Response("Invalid UUID format", { status: 400 });
        }
        const result = await getDownloadLink(
          turnstileRes,
          dlid,
          userid,
          Boolean(captcha),
        );
        return new Response(JSON.stringify(result), {
          headers: {
            "Content-Type": "application/json",
          },
        });
      } catch (e) {}
    },
    "/__download/:uuid/:dlid": async (req: Request) => {
      const url = new URL(req.url);
      const { uuid: uuidSlug, dlid } = req.params;
      const clientId = url.searchParams.get("usr");

      if (
        !uuidSlug.match(
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
        )
      ) {
        return new Response("Invalid UUID format", { status: 400 });
      }
      if (!clientId) {
        return new Response("No client ID entered.", { status: 400 });
      }

      const fileName = await GetFile(uuidSlug, dlid, clientId);
      const file = await fs.promises.readFile(`/data/${fileName}`);
      return new Response(file, {
        headers: {
          "Content-Type": "application/octet-stream",
          "Content-Disposition": `attachment; filename="${fileName}"`,
        },
      });
    },
    "/**": async (req: Request) => {
      try {
        const url = new URL(req.url);
        const pathname = url.pathname.replace("/", "");
        const searchParams = url.searchParams;
        const uuid = searchParams.get("uuid");
        const stream = await renderToReadableStream(
          <DownloadPage pathname={pathname} />,
        );
        await stream.allReady;

        return new Response(stream, {
          headers: {
            "Content-Type": "text/html",
          },
        });
      } catch (e) {
        return new Response("Internal Server Error", { status: 500 });
      }
    },
  },
});

console.log(
  `The app is currently running at port 3000, launched in ${Math.round(performance.now() - startTime)} milliseconds.`,
);
