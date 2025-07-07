import fs from "fs";
const indexFile = await fs.promises.readFile("app/html/index.html");
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
    "/**": async (req: Request) => {
      try {
        const url = new URL(req.url);
        const pathname = url.pathname.replace("/", "");
        return new Response(`Hello World! Path: ${pathname}`);
      } catch (e) {
        return new Response("Oops!", {
          headers: { "Content-Type": "text/html" },
        });
      }
    },
  },
});
