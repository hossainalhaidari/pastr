#!/usr/bin/env -S deno run --allow-net --allow-read --allow-write --allow-env

import { serve } from "https://deno.land/std/http/server.ts";
import * as path from "https://deno.land/std/path/mod.ts";

const PASTR_HOST = Deno.env.get("PASTR_HOST");
const PASTR_KEY_LENGTH = Deno.env.get("PASTR_KEY_LENGTH") ?? "4";

const getPath = (code: string) => `data/${code}`;

const exists = async (filename: string) => {
  try {
    await Deno.stat(filename);
    return true;
  } catch {
    return false;
  }
};

const rand = () => {
  const length = parseInt(PASTR_KEY_LENGTH) / 2;
  const buf = new Uint8Array(length);
  crypto.getRandomValues(buf);
  let ret = "";
  for (let i = 0; i < buf.length; ++i) {
    ret += ("0" + buf[i].toString(16)).slice(-2);
  }
  return ret;
};

const find = async (code: string) => {
  const file = getPath(code);
  return (await exists(file)) ? await Deno.readTextFile(file) : null;
};

const getCode = async () => {
  let code;
  do {
    code = rand();
  } while (await exists(getPath(code)));
  return code;
};

const isURL = (content: string) => {
  try {
    const url = new URL(content);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

const create = async (content: string) => {
  const code = await getCode();
  await Deno.writeTextFile(getPath(code), content);
  return path.join(PASTR_HOST, code);
};

const handler = async (req: Request): Promise<Response> => {
  const { pathname } = new URL(req.url, PASTR_HOST);

  if (pathname === "/") {
    return new Response("Hi!", { status: 200 });
  } else if (pathname.startsWith("/=")) {
    return new Response(await create(pathname.substring(2)), { status: 200 });
  } else {
    const content = await find(pathname.substring(1));

    if (!content) {
      return new Response("Not Found!", { status: 404 });
    } else if (isURL(content)) {
      return Response.redirect(content);
    } else {
      return new Response(content, { status: 200 });
    }
  }
};

await serve(handler, { port: 3000 });
