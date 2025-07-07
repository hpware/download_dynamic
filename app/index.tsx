import fs from "fs";
const indexFile = await fs.promises.readFile("app/html/index.html");
const errorFile = await fs.promises.readFile("app/html/error.html");
import { renderToReadableStream } from "react-dom/server";
import DownloadPage from "./pages/download";
console.log(`The app is currently running at port 3000`);
Bun.serve({
  port: 3000,
  development: true,
  routes: {
    "/": () => {
      return new Response(indexFile, {
        headers: {
          "Content-Type": "text/html",
        },
      });
    },
    "/download/:uuid": async (req: Request) => {
      const { uuid: uuidSlug } = req.params;
      const fileName = "fileName";
      const fileType = "text/html";
      return new Response(indexFile, {
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
        const stream = await renderToReadableStream(
          <DownloadPage pathname={pathname} />,
        );
        return new Response(stream, {
          headers: { "Content-Type": "text/html" },
        });
      } catch (e) {
        return new Response(errorFile, {
          headers: { "Content-Type": "text/html" },
        });
      }
    },
  },
});
