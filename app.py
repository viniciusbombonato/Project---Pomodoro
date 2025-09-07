from flask import Flask, render_template, request

app = Flask(__name__)

@app.route("/", methods=["GET", "POST"])
def homepage():
    if request.method == "POST":
        minutes = request.form.get("minutes")
        interval = request.form.get("interval")  

        if minutes and interval and minutes.isdigit() and interval.isdigit():
            minutes = int(minutes)
            interval = int(interval)

            if 0 < minutes <= 60 and 0 < interval <= 60:
                return render_template("index.html", minutes=minutes, interval=interval)

    return render_template("home.html")

if __name__ == "__main__":
    app.run(debug=True)