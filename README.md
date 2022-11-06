# pastr
**pastr** is a minimal URL shortener and paste tool that has a dead-simple convention for using it.

## Usage

- Run `cargo run` to start the server locally at `http://localhost:8000`.
- Call the API by prepending `s/` before the content you want to shorten:
```
    http://localhost:8000/s/Hello, World!
    http://localhost:8000/s/http://mysite.com
```
- In response, you will see something like the following; which is your shortened URL:
```
    http://localhost:8000/Hg5d
    http://localhost:8000/XCUU
```
- If you used a URL as the content, then by opening the shortened link you will be redirected to the original URL; otherwise it will be displayed as plain text.
