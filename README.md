# pastr
**pastr** is a minimal URL shortener and paste tool that has a dead-simple convention for using it

## Requirements

- Python 3.5+
- python-dotenv

## Installing

- Install [python-dotenv](https://github.com/theskumar/python-dotenv#installation).
- Create your own [virtualenv](https://virtualenv.pypa.io/en/latest/) and activate it.
- Install the requirements: `pip install -r requirements.txt`
- Create a `.env` file in root path and add the following lines to it:
```
SECRET_KEY=your_super_secret_key
PASTR_PATH=/path/to/pastr/root
```
- [Deploy the app](http://flask.pocoo.org/docs/1.0/deploying/#deployment) or run in [debug mode](http://flask.pocoo.org/docs/1.0/quickstart/#debug-mode).

## Usage

> Note: All responses are in `text/plain` format.

- Using GET request or just the browser (note the `=` symbol):

`https://example.com/=Hello, World!`  
`https://example.com/=http://mysite.com`

- Using POST request:

`curl -d "Hello, World" -X POST https://example.com`  
`curl -d "http://mysite.com" -X POST https://example.com`

In response, you will see something like the following; which is your shortened URL:

`https://example.com/104`  
`https://example.com/85`

If you used a URL as the content, then by opening the shortened link you will be redirected to the original URL; otherwise it will be displayed as plain text.
