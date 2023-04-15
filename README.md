# pastr

**pastr** is a super-minimal URL shortener and paste tool that uses a flat-file storage and has no dependencies.

## Usage

- (Optional) Set `PASTR_HOST` to `http://localhost:3000`.
- (Optional) Set `PASTR_KEY_LENGTH` to a number between 4 and 12 (default: 4).
- Run `go run .` to start the server locally at `http://localhost:3000`.
- Now you can either use the frontend by opening the server URL in a browser, or call the API by sending a POST request to it:

```sh
curl -X POST http://localhost:3000 -d "Hello, World"
```

- If you used a URL as the content, then by opening the shortened link you will be redirected to the original URL; otherwise it will be displayed as plain text.
- For docker usage, check the `docker-compose.yml` file.
