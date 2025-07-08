import "../css/main.css";
export default function Layout({
  page,
  title,
}: {
  page: React.ReactNode;
  title?: string;
}) {
  return (
    <html>
      <head>
        <title>{title || "Undefined"}</title>
        <link rel="stylesheet" href="/style.css" />
        <meta charSet="UTF-8" />
      </head>
      <body>
        <main>{page}</main>
        <footer>
          <span className="text-xs ml-2">
            &copy; {new Date().getFullYear()}
          </span>
        </footer>
      </body>
    </html>
  );
}
