declare var console: Console;
declare var print: typeof console["log"];
declare var scriptArgs: string[];

declare module "std" {
  export const SEEK_SET: number;
  export const SEEK_CUR: number;
  export const SEEK_END: number;

  export interface FILE {
    /** Close the file. Return 0 if OK or `-errno` in case of I/O error. */
    close(): number;
    /** Outputs the string with the UTF-8 encoding. */
    puts(str: string): void;
    /** Formatted printf. The same formats as the standard C library `printf` are supported. Integer format types (e.g. `%d`) truncate the Numbers or BigInts to 32 bits. Use the `l` modifier (e.g. `%ld`) to truncate to 64 bits. */
    printf(fmt: string, ...args: any[]): void;

    /** Flush the buffered file. */
    flush(): void;
    /** Seek to a give file position (whence is `std.SEEK_*`). `offset` can be a number or a bigint. Return 0 if OK or `-errno` in case of I/O error. */
    seek(
      offset: number | bigint,
      whence: typeof SEEK_SET | typeof SEEK_CUR | typeof SEEK_END,
    ): void;

    /** Return the current file position. */
    tell(): number;

    /** Return the current file position as a bigint. */
    tello(): bigint;

    /** Return true if end of file. */
    eof(): boolean;

    /** Return the associated OS handle. */
    fileno(): number;

    /** Return true if there was an error. */
    error(): boolean;

    /** Clear the error indication. */
    clearerr(): void;

    /** Read `length` bytes from the file to the ArrayBuffer `buffer` at byte position `position` (wrapper to the libc `fread`). */
    read(buffer: ArrayBuffer, position: number, length: number): number;

    /** Write `length` bytes to the file from the ArrayBuffer `buffer` at byte position `position` (wrapper to the libc `fwrite`). */
    write(buffer: ArrayBuffer, position: number, length: number): number;

    /** Return the next line from the file, assuming UTF-8 encoding, excluding the trailing line feed. */
    getline(): string;

    /** Read `max_size` bytes from the file and return them as a string assuming UTF-8 encoding. If `max_size` is not present, the file is read up its end. */
    readAsString(max_size?: number): string;

    /** Return the next byte from the file. Return -1 if the end of file is reached. */
    getByte(): number;

    /** Write one byte to the file. */
    putByte(c: number): void;
  }

  /** Exit the process. */
  export function exit(n: number): never;

  /** Load the file `filename` and return it as a string assuming UTF-8 encoding. Return `null` in case of I/O error. */
  export function loadFile(filename: string): string | null;

  /** Open a file (wrapper to the libc `fopen()`). Return the FILE object or `null` in case of I/O error. If `errorObj` is not undefined, set its `errno` property to the error code or to 0 if no error occured. */
  export function open(
    filename: string,
    flags: string,
    errorObj?: { errno?: number },
  ): FILE;

  /** Open a file from a file handle (wrapper to the libc `fdopen()`). Return the FILE object or `null` in case of I/O error. If `errorObj` is not undefined, set its `errno` property to the error code or to 0 if no error occured. */
  export function fdopen(
    fd: number,
    flags: string,
    errorObj?: { errno?: number },
  ): FILE;

  const In: FILE;
  export { In as in };
  export const out: FILE;
  export const err: FILE;

  /** Return the value of the environment variable `name` or `undefined` if it is not defined. */
  export function getenv(name: string): string | undefined;
  /** Set the value of the environment variable `name` to the string `value`. */
  export function setenv(name: string, value: string): void;
  /** Delete the environment variable `name`. */
  export function unsetenv(name: string): void;
  /** Return an object containing the environment variables as key-value pairs. */
  export function getenviron(): Record<string, string>;
  /** Download url using the curl command line utility. */
  export function urlGet<Full extends boolean = false>(
    url: string,
    options?: {
      /** Boolean (default = false). If true, the response is an ArrayBuffer instead of a string. When a string is returned, the data is assumed to be UTF-8 encoded. */
      binary?: boolean;
      /** Boolean (default = false). If true, return the an object contains the properties `response` (response content), `responseHeaders` (headers separated by CRLF), `status` (status code). `response` is `null` is case of protocol or network error. If `full` is false, only the response is returned if the status is between 200 and 299. Otherwise `null` is returned. */
      full?: Full;
    },
  ): Full extends true ? {
    /** response content */
    response: string;
    /** headers separated by CRLF */
    responseHeaders: Record<string, string>;
    /** status code */
    status: number;
  }
    : string | null;
}

declare module "os" {
  export function chdir(path: string): number;
}
