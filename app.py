from flask import Flask, render_template, request
import logging
import os

app = Flask(__name__)
app.logger.setLevel(logging.INFO)

@app.route("/", methods=["GET", "POST"])
def homepage():
    if request.method == "POST":
        minutes = request.form.get("minutes")
        interval = request.form.get("interval") 
        bigInter = request.form.get("bigInter") 

        app.logger.info("Values acquired") #checking interaction

        if minutes and interval and bigInter and minutes.isdigit() and interval.isdigit() and bigInter.isdigit():
            minutes = int(minutes)
            interval = int(interval)
            bigInter = int(bigInter)

            app.logger.info("values converted") #checking interaction

            if 60 > minutes > 0 and 60 > interval > 0 and 60 > bigInter > 0:
                app.logger.info("Valadition succeded")
                return render_template("index.html", minutes=minutes, interval=interval, bigInter=bigInter)

            else:
                app.logger.warning("validation failed") #warning
                return render_template("home.html")
        else:
            app.logger.warning("Failed to convert") #warning
            return render_template("home.html")
    else:
        return render_template("home.html")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)