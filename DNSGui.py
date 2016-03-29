
import shutil
import datetime
import subprocess
import re

import sys
sys.path.append("/var/www/dnsgui/")
sys.path.append("/usr/lib/python2.6/site-packages/Jinja2-2.6-py2.6.egg")

from flask import Flask, render_template, jsonify, request

from ForwardParser import ForwardParser
from ReverseParser import ReverseParser

FZ_FILE = "/var/named/named.ikioma"
RZ_FILE = "/var/named/revp.192.168.0"

app = Flask(__name__)
app.config['PROPAGATE_EXCEPTIONS'] = True
app.debug = True


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
    p = subprocess.Popen(['sudo', 'service', 'named', 'restart'], stdout=subprocess.PIPE)
    #print(p.communicate()[0])
    return p.communicate()[0] #re.sub("\[[^m\[]+[mG]", "", p.communicate()[0])

if __name__ == '__main__':
    app.debug = True
    app.run(host="0.0.0.0")

