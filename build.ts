console.log(
  Object.entries(
    (await Deno.emit(Deno.args[0], {
      check: false,
    })).files,
  ).find(([k, v]) => k.endsWith(".js"))![1],
);
