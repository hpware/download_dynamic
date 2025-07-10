import "../css/main.css";

const COPYRIGHT_OWNER =
  process.env.COPYRIGHT_OWNER === undefined
    ? "Respected Owners"
    : process.env.COPYRIGHT_OWNER;
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
      <script
        dangerouslySetInnerHTML={{
          __html: `
          /**
            * COPYRIGHT ${new Date().getFullYear()}
            * WRITEN BY @hpware on GitHub, CONTENT IS NOT OWNED TO THE PERSON WHO WROTE THE SOFTWARE.
            * THIS WEBSITE IS OWNED BY ${COPYRIGHT_OWNER}, AND ALL LIBILLTY GOES TO THE COPYTIGHT OWNER. IF IT USES THE PLACEHOLDER "Respected Owners", DO NOT CONTACT THE PERSON WHO WROTE THIS, HE HAS NO IDEA EITHER
            * THIS PLATFORM / SOFTWARE IS LICENSED UNDER MIT
            * Writen using Bun & Postgres.
          */
          `,
        }}
      ></script>
      <body>
        <header className="p-2 m-2">
          <h1 className="text-2xl">Download 📥</h1>
          <hr className="justify-center m-auto w-[80vw]" />
        </header>
        <main>{page}</main>
        <footer>
          <span className="text-xs ml-2">
            &copy; {new Date().getFullYear()} {COPYRIGHT_OWNER}
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
