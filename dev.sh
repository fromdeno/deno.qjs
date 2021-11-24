deno run --unstable --allow-read=Deno.ts,qjs.d.ts build.ts Deno.ts > Deno.js
deno bundle test.js > test_bundle.js
deno run -A test_bundle.js "$@"
./qjs --unhandled-rejection test_bundle.js "$@"
