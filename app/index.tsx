import { renderToReadableStream } from "react-dom/server";
import indexFile from "./html/index.html";
import DownloadPage from "./pages/download";
import fs from "fs";
console.log(`The app is currently running at port 3000`);

const styleCss = await fs.promises.readFile("./app/style.css");

Bun.serve({
  port: 3000,
  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
  routes: {
    "/": indexFile,
    "/style.css": () => {
      return new Response(styleCss, {
        headers: {
          "Content-Type": "text/css",
        },
      });
    },
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
