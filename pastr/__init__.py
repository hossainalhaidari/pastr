from flask import Flask, request, redirect, Response
from urllib.parse import urlparse
import random
import os.path

app = Flask(__name__)
data = app.root_path + "/data/"
mime = "text/plain; charset=utf-8"
max_num = 1001

def create(content):
    code = get_new_code()
    file = open(data + code, "w+")
    file.write(content)
    file.close()
    return code

def find(code):
    if os.path.exists(data + code):
        file = open(data + code, "r")
        return file.read()
    else:
        return ""

def get_new_code():
    code = random.randint(1, max_num)

    while os.path.exists(data + str(code)):
        code = random.randint(1, max_num)

    return str(code)

def is_url(content):
    try:
        result = urlparse(content)
        return all([result.scheme, result.netloc])
    except:
        return False

@app.route("/", methods = ['GET', 'POST'])
def index():
    if request.method == 'POST':
        try:
            data = request.get_data().decode("utf-8")
            if data:
                code = create(data)
                return Response(request.url_root + code, mimetype=mime)
        except:
            pass
    
    return Response("", mimetype=mime)

@app.route("/=<path:subpath>")
def shorten(subpath):
    subpath = subpath.replace("http:/", "http://")
    subpath = subpath.replace("https:/", "https://")
    code = create(subpath)
    return Response(request.url_root + code, mimetype=mime)

@app.route("/<int:code>")
def load(code):
    content = find(str(code))
    if is_url(content):
        return redirect(content)
    else:
        return Response(content, mimetype=mime)
