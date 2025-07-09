import "../css/main.css";

export default function Export() {
  return (
    <html>
      <head>
        <title>Oops! You have found an error!</title>
        <link rel="stylesheet" href="/_style.css" />
        <meta charSet="UTF-8" />
      </head>
      <body>
        <div class="absolute inset-0 flex flex-col justify-center text-center text-lg">
          <span>This error can be reported to the owner's email address.</span>
        </div>
      </body>
    </html>
  );
}
