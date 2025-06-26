from flask import Flask, render_template, request, redirect, url_for, session
import  os
import json

app = Flask(__name__)
app.secret_key = os.urandom(24)

VALID_USERNAME = 'admin'
VALID_PASSWORD = 'admin'

@app.route('/')
def login():
    return render_template('login.html')

@app.route('/login', methods=['POST'])
def do_login():
    username = request.form.get('username')
    password = request.form.get('password')
    if username == VALID_USERNAME and password == VALID_PASSWORD:
        session['logged_in'] = True
        return redirect(url_for('config'))
    return render_template('login.html', error="Invalid credentials")

@app.route('/config')
def config():
    if not session.get('logged_in'):
        return redirect(url_for('login'))
    return render_template('config.html')

@app.route('/submit', methods=['POST'])
def submit():
    if not session.get('logged_in'):
        return redirect(url_for('login'))
    
    data = {
        'wifi_name': request.form.get('wifi_name'),
        'wifi_password': request.form.get('wifi_password'),
        'username': request.form.get('username'),
        'password': request.form.get('password')
    }

    with open('data.json', 'w') as f:
        json.dump(data, f, indent=4)

    return render_template('config.html', data=data)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80)
