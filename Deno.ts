///<reference no-default-lib="true" />
///<reference lib="deno.ns" />
///<reference lib="deno.console" />

import type {} from "./qjs.d.ts";
import * as std from "std";
import * as os from "os";

export const args: typeof Deno.args = scriptArgs.slice(1);
export const mainModule: typeof Deno.mainModule = scriptArgs[0];
export const noColor: typeof Deno.noColor =
  typeof std.getenv("NO_COLOR") !== "undefined";

export const exit: typeof Deno.exit = function exit(n) {
  return std.exit(n ?? 1);
};

export const build: typeof Deno.build = {
  target: "",
  arch: "x86_64",
  os: "linux",
  vendor: "unknown",
  env: "gnu",
};
build.target = `${build.arch}-${build.vendor}-${build.os}-${build.env}`;

export const env: typeof Deno.env = {
  get(key) {
    return std.getenv(key);
  },
  set(key, value) {
    return std.setenv(key, value);
  },
  delete(key) {
    return std.unsetenv(key);
  },
  toObject() {
    return std.getenviron();
  },
};

export const errors: typeof Deno.errors = {
  NotFound: class NotFound extends Error {},
  PermissionDenied: class PermissionDenied extends Error {},
  ConnectionRefused: class ConnectionRefused extends Error {},
  ConnectionReset: class ConnectionReset extends Error {},
  ConnectionAborted: class ConnectionAborted extends Error {},
  NotConnected: class NotConnected extends Error {},
  AddrInUse: class AddrInUse extends Error {},
  AddrNotAvailable: class AddrNotAvailable extends Error {},
  BrokenPipe: class BrokenPipe extends Error {},
  AlreadyExists: class AlreadyExists extends Error {},
  InvalidData: class InvalidData extends Error {},
  TimedOut: class TimedOut extends Error {},
  Interrupted: class Interrupted extends Error {},
  WriteZero: class WriteZero extends Error {},
  UnexpectedEof: class UnexpectedEof extends Error {},
  BadResource: class BadResource extends Error {},
  Http: class Http extends Error {},
  Busy: class Busy extends Error {},
};

export const readTextFile: typeof Deno.readTextFile =
  async function readTextFile(path) {
    const file = std.loadFile(typeof path === "object" ? path.href : path);
    if (file == null) {
      throw new errors.NotFound(path + " not found");
    }
    return file;
  };

const files = new Map<number, { path: string; file: std.FILE }>();

export enum SeekMode {
  Start = 0,
  Current = 1,
  End = 2,
}

export const File: typeof Deno.File = class File
  implements
    Deno.Reader,
    Deno.ReaderSync,
    Deno.Writer,
    Deno.WriterSync,
    Deno.Seeker,
    Deno.SeekerSync,
    Deno.Closer {
  #file: std.FILE;
  #closed = false;
  constructor(readonly rid: number) {
    this.#file = files.get(rid)!.file;
  }
  readSync(p: Uint8Array): number | null {
    if (this.#closed || this.#file.eof()) {
      return null;
    }
    return this.#file.read(p.buffer, p.byteOffset, p.byteLength);
  }
  async read(p: Uint8Array): Promise<number | null> {
    return this.readSync(p);
  }
  writeSync(p: Uint8Array): number {
    const nwritten = this.#file.write(p.buffer, p.byteOffset, p.byteLength);
    this.#file.flush();
    return nwritten;
  }
  async write(p: Uint8Array): Promise<number> {
    return this.writeSync(p);
  }
  seekSync(offset: number, whence: SeekMode): number {
    this.#file.seek(
      offset,
      whence === SeekMode.Start
        ? std.SEEK_SET
        : whence === SeekMode.Current
        ? std.SEEK_CUR
        : std.SEEK_END,
    );
    return offset;
  }
  async seek(offset: number, whence: SeekMode): Promise<number> {
    return this.seek(offset, whence);
  }
  close() {
    this.#closed = true;
    this.#file.close();
    files.delete(this.rid);
  }
};

export const open: typeof Deno.open = async function open(path, options) {
  const file = std.open(
    path,
    `${options?.read ? "r" : ""}${
      options?.write ? (options?.read ? "+" : "w") : ""
    }`,
  );
  files.set(file.fileno(), { path, file });
  if (file == null) {
    throw new errors.NotFound(path + " not found");
  }
  return new File(file.fileno());
};

export const stdin: typeof Deno.stdin = {
  rid: std.in.fileno(),
  close() {
    std.in.close();
  },
  readSync(p: Uint8Array): number | null {
    if (std.in.eof()) {
      return null;
    }
    return std.in.read(p.buffer, p.byteOffset, p.byteLength);
  },
  async read(p: Uint8Array): Promise<number | null> {
    return this.readSync(p);
  },
};
