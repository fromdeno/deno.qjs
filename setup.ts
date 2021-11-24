import {
  copy,
  readerFromStreamReader,
} from "https://deno.land/std@0.115.1/streams/conversion.ts";

const baseURL = "https://bellard.org/quickjs/binary_releases/";

const vres = await fetch(
  new URL("LATEST.json", baseURL),
);
const { version } = await vres.json();

const os = Deno.build.os === "windows" ? "win" : "linux";

const filename = `quickjs-${os}-x86_64-${version}.zip`;
const res = await fetch(new URL(filename, baseURL));
const file = await Deno.open(filename, {
  create: true,
  write: true,
  truncate: true,
});
await copy(readerFromStreamReader(res.body!.getReader()), file);
const result = (await Deno.run({
    cmd: ["unzip", filename],
  }).status()).success
  ? "OK"
  : "ERR";

console.log(result);

await Deno.remove(filename);

if (result === "ERR") Deno.exit(1);
