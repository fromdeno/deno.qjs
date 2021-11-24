import {
  iterateReader,
  writeAll,
} from "https://deno.land/std@0.115.1/streams/conversion.ts";

(async () => {
  const file = await Deno.open("test.txt", { write: true });
  for await (const buf of iterateReader(Deno.stdin, { bufSize: 10 })) {
    await writeAll(file, buf);
  }
})();
