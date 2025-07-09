import "../css/main.css";
export default function Layout({
  page,
  title,
  scriptTags,
  jsCode,
}: {
  page: React.ReactNode;
  title?: string;
  scriptTags?: any;
  jsCode?: string;
}) {
  return (
    <html>
      <head>
        <title>{title || "Undefined"}</title>
        <link rel="stylesheet" href="/_style.css" />
        <meta charSet="UTF-8" />
      </head>
      <body>
        <header className="p-2 m-2">
          <h1 className="text-2xl">Download 📥</h1>
          <hr className="justify-center m-auto w-[80vw]" />
        </header>
        <main>{page}</main>
        <footer>
          <span className="text-xs ml-2">
            &copy; {new Date().getFullYear()}
          </span>
        </footer>
        {scriptTags &&
          scriptTags.map((url: any, index: number) => (
            <script key={index} src={url}></script>
          ))}
        {jsCode && (
          <script dangerouslySetInnerHTML={{ __html: jsCode }}></script>
        )}
      </body>
    </html>
  );
}
