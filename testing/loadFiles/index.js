const startTime = performance.now();
var a = true;
while (a) {
  try {
    const req = await fetch("http://localhost:3000/testing");
    const res = await req.text();
    if (res === "hi") {
      a = false;
    }
  } catch (e) {}
  if (a === false) {
    console.log(
      `Done! ${Math.round(performance.now() - startTime)} milliseconds.`,
    );
  }
}
