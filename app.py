from flask import Flask, render_template, request, redirect, url_for, flash
import sqlite3
from pathlib import Path

app = Flask(__name__)
app.secret_key = "change-this-secret-key"
DB_PATH = Path(__file__).with_name("portfolio.db")

def init_db():
    with sqlite3.connect(DB_PATH) as con:
        con.execute("""CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL, email TEXT NOT NULL, message TEXT NOT NULL
        )""")
        con.execute("""CREATE TABLE IF NOT EXISTS visits (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            visited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )""")
        con.execute("INSERT INTO visits DEFAULT VALUES")

@app.route("/", methods=["GET", "POST"])
def home():
    if request.method == "POST":
        name = request.form.get("name", "").strip()
        email = request.form.get("email", "").strip()
        message = request.form.get("message", "").strip()
        if name and email and message:
            with sqlite3.connect(DB_PATH) as con:
                con.execute("INSERT INTO messages (name, email, message) VALUES (?, ?, ?)",
                            (name, email, message))
            flash("Thanks for reaching out! Your message has been saved.", "success")
        else:
            flash("Please complete every field.", "error")
        return redirect(url_for("home") + "#contact")

    with sqlite3.connect(DB_PATH) as con:
        visits = con.execute("SELECT COUNT(*) FROM visits").fetchone()[0]
    return render_template("index.html", visits=visits)

if __name__ == "__main__":
    init_db()
    app.run(debug=True)
