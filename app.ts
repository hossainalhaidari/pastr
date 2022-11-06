#!/usr/bin/env -S deno run --allow-net --allow-read --allow-write

import { serve } from "https://deno.land/std@0.161.0/http/server.ts";

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
  const buf = new Uint8Array(2);
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
  return code;
};

const handler = async (req: Request): Promise<Response> => {
  const { pathname } = new URL(req.url, "http://127.0.0.1/");

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
