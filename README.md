# Anirudh Singh — Python Portfolio

A responsive, animated personal portfolio built with **Python, Flask, HTML, CSS and JavaScript**.

## Features
- Gen-Z inspired dark design with animated gradient accents
- Smooth scrolling, reveal-on-scroll animations and hover interactions
- Responsive layout for mobile, tablet and desktop
- Skills, projects, about and contact sections
- Flask contact form backed by SQLite
- Simple visitor counter backed by SQLite

## Run locally
1. Install Python 3.10 or newer.
2. Open a terminal in this folder.
3. Create and activate a virtual environment (recommended).
4. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

5. Start the website:

   ```bash
   python app.py
   ```

6. Open `http://127.0.0.1:5000` in your browser.

The SQLite database (`portfolio.db`) is created automatically.

## Before publishing
- Replace the sample project descriptions with your real work.
- Add your GitHub, LinkedIn and email links in `templates/index.html`.
- Change the Flask `secret_key` in `app.py`.
- Do not commit private credentials or personal data.

## Publish on GitHub
Create a repository named `anirudh-python-portfolio`, then upload this folder. Add a screenshot of the site to the README after running it locally.

> Note: GitHub Pages hosts static sites only. This Flask version needs a Python hosting service to run the backend and contact form.
