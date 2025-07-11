import { renderToReadableStream } from "react-dom/server";
import indexFile from "./html/index.html";
import DownloadPage from "./pages/download";
import sql from "./pg";
import createDB from "./create_database";
import fs from "fs";
import chokidar from "chokidar";
console.log(`The app is currently running at port 3000`);

const styleCss = await fs.promises.readFile("./app/style.css");

const clientJsFilesUrlArray: any[] = [];
for (const file of await fs.promises.readdir("./app/client_js")) {
  if (file.endsWith(".js")) {
    const filePath = `./app/client_js/${file}`;
    clientJsFilesUrlArray[`/_client_js/${file}`] = async () => {
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

// WATCH FILES
const watcher = chokidar.watch("./data", {
  ignored: (path, stats) => stats?.isFile() && path.endsWith(".tmp"),
  persistent: true,
});
const log = console.log.bind(console);
watcher
  .on("add", (path) => log(`File ${path} has been added`))
  .on("change", (path) => log(`File ${path} has been changed`))
  .on("unlink", (path) => log(`File ${path} has been removed`));

// APP
Bun.serve({
  port: 3000,
  development: false,
  routes: {
    "/": indexFile,
    "/_current_docker_dir": async () => {
      const currentDir = process.cwd();
      return new Response(currentDir, {
        headers: {
          "Content-Type": "text/plain",
        },
      });
    },
    "/_style.css": () => {
      return new Response(styleCss, {
        headers: {
          "Content-Type": "text/css",
        },
      });
    },
    ...clientJsFilesUrlArray,
    "/download/:uuid/:dlid": async (req: Request) => {
      const url = new URL(req.url);
      const { uuid: uuidSlug, dlid } = req.params;

      if (
        !uuidSlug.match(
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
        )
      ) {
        return new Response("Invalid UUID format", { status: 400 });
      }

      const fileName = "fileName";
      const fileType = "text/html";
      return new Response("Hello", {
        headers: {
          "Content-Type": `${fileType}`,
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
          <DownloadPage pathname={pathname} uuidMode={uuid} />,
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
