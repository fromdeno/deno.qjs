import {
  iterateReader,
  writeAll,
} from "https://deno.land/std@0.115.1/streams/conversion.ts";

(async () => {
  // code to conditionally import deno.qjs
  // #region
  /** @type {typeof globalThis.Deno} */
  const Deno = "Deno" in globalThis
    ? globalThis.Deno
    : await import("./Deno.js");
  "Deno" in globalThis || (globalThis.Deno = Deno);
  // #endregion

  const file = await Deno.open("test.txt", { write: true });
  for await (const buf of iterateReader(Deno.stdin, { bufSize: 10 })) {
    await writeAll(file, buf);
  }
})();
