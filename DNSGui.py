from flask import Flask, render_template, jsonify, request

import shutil
import datetime

from ForwardParser import ForwardParser
from ReverseParser import ReverseParser

FZ_FILE = "C:\\Users\\esa\\PycharmProjects\\DNSGui\\named.ikioma"
RZ_FILE = "C:\\Users\\esa\\PycharmProjects\\DNSGui\\revp.192.168.0"

app = Flask(__name__)


@app.route('/')
def view_main():
    return render_template("main.html")

@app.route('/read')
def view_read():
    fp = ForwardParser(FZ_FILE)
    fp_d = fp.parse().to_dict()

    rp = ReverseParser(RZ_FILE)
    rp_d = rp.parse().to_dict()

    return jsonify(forward=fp_d, reverse=rp_d)

@app.route('/writefz', methods=['POST'])
def view_write_fz():
    if request.method == "POST":
        text = list(request.form.items())[0][0]

        shutil.copyfile(FZ_FILE, FZ_FILE+"-"+datetime.datetime.now().strftime("%Y%m%d-%H%M"))
        with open(FZ_FILE, "w") as file:
            file.write(text)
    return ''

@app.route('/writerz', methods=['POST'])
def view_write_rz():
    if request.method == "POST":
        text = list(request.form.items())[0][0]

        shutil.copyfile(RZ_FILE, RZ_FILE+"-"+datetime.datetime.now().strftime("%Y%m%d-%H%M"))
        with open(RZ_FILE, "w") as file:
            file.write(text)
    return ''

@app.route('/restart')
def view_restart():
    return ''

if __name__ == '__main__':
    app.debug = True
    app.run()

