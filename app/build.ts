Bun.build({
  entrypoints: ["./index.html"],
  outdir: "./dist",
  minify: {
    whitespace: true,
    identifiers: true,
    syntax: true,
  },
});
