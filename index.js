#!/usr/bin/env node

const crypto = require("crypto");
const { createServer } = require("http");
const { existsSync, readFileSync, writeFileSync } = require("fs");

const getPath = (code) => `data/${code}`;

const find = (code) => {
  const file = getPath(code);
  return existsSync(file) ? readFileSync(file, "utf8") : null;
};

const getCode = () => {
  do {
    code = crypto.randomBytes(2).toString("hex");
  } while (existsSync(getPath(code)));
  return code;
};

const isURL = (content) => {
  try {
    const url = new URL(content);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

const create = (content) => {
  const code = getCode();
  writeFileSync(getPath(code), content);
  return code;
};

const ok = (res, content) => {
  res.writeHead(200);
  res.write(content);
  res.end();
};

const notFound = (res) => {
  res.writeHead(404);
  res.write("Not Found!");
  res.end();
};

const redirect = (res, to) => {
  res.writeHead(307, {
    Location: to,
  });
  res.end();
};

createServer((req, res) => {
  const { pathname } = new URL(req.url, "http://127.0.0.1/");

  if (pathname === "/") {
    ok(res, "Hi!");
  } else if (pathname.startsWith("/=")) {
    ok(res, create(pathname.substring(2)));
  } else {
    const content = find(pathname.substring(1));

    if (!content) {
      notFound(res);
    } else if (isURL(content)) {
      redirect(res, content);
    } else {
      ok(res, content);
    }
  }
}).listen(3000);
