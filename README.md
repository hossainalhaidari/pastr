# pastr
**pastr** is a minimal URL shortener and paste tool that has a dead-simple convention for using it.

## Usage

- Run `go run .` to start the server locally at `http://localhost:3000`.
- Call the API by prepending `=` before the content you want to shorten:
```
    http://localhost:3000/=Hello, World!
    http://localhost:3000/=http://mysite.com
```
- In response, you will see something like the following; which is your shortened URL:
```
    http://localhost:3000/6e17
    http://localhost:3000/e85c
```
- If you used a URL as the content, then by opening the shortened link you will be redirected to the original URL; otherwise it will be displayed as plain text.
