from flask import Flask, render_template, jsonify, request

import shutil
import datetime

from ForwardParser import ForwardParser

FZ_FILE = "C:\\Users\\esa\\PycharmProjects\\DNSGui\\named.ikioma"

app = Flask(__name__)


@app.route('/')
def view_main():
    return render_template("main.html")

@app.route('/read')
def view_read():
    fp = ForwardParser(FZ_FILE)
    d = fp.parse().to_dict()

    return jsonify(forward=d)

@app.route('/write', methods=['POST'])
def view_write():
    if request.method == "POST":
        text = list(request.form.items())[0][0]

        shutil.copyfile(FZ_FILE, FZ_FILE+"-"+datetime.datetime.now().strftime("%Y%m%d-%H%M"))
        with open(FZ_FILE, "w") as file:
            file.write(text)
    return ''

@app.route('/restart')
def view_restart():
    return ''

if __name__ == '__main__':
    app.debug = True
    app.run()

