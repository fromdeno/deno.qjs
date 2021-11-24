deno run --unstable --allow-read=Deno.ts,qjs.d.ts build.ts Deno.ts > Deno.js
echo 'import * as Deno from "./Deno.js";' > test_bundle.js
deno bundle test.js >> test_bundle.js
./qjs --unhandled-rejection test_bundle.js "$@"
