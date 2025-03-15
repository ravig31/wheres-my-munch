from flask import Flask 

app = Flask(__name__)

@app.route("/test")
def tester():
    return {"key": ["arosh","is","stinky"]}

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)