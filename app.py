from flask import Flask, request, jsonify, render_template
import requests

app = Flask(__name__)

# Replace with your OpenWeatherMap API key
API_KEY = "****************"

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/forecast")
def forecast():
    return render_template("forecast.html")

@app.route("/map")
def map_page():
    return render_template("map.html")

@app.route("/analytics")
def analytics():
    return render_template("analytics.html")

@app.route("/weather", methods=["GET"])
def get_weather():
    city = request.args.get("city")
    lat = request.args.get("lat")
    lon = request.args.get("lon")

    if city:
        url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric"
    elif lat and lon:
        url = f"http://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API_KEY}&units=metric"
    else:
        return jsonify({"error": "City or coordinates are required"}), 400

    response = requests.get(url)
    if response.status_code != 200:
        return jsonify({"error": "Failed to fetch weather data"}), response.status_code

    return jsonify(response.json())

@app.route("/forecast_data", methods=["GET"])
def get_forecast():
    city = request.args.get("city")
    if not city:
        return jsonify({"error": "City is required"}), 400

    url = f"http://api.openweathermap.org/data/2.5/forecast?q={city}&appid={API_KEY}&units=metric"
    response = requests.get(url)
    if response.status_code != 200:
        return jsonify({"error": "Failed to fetch forecast data"}), response.status_code

    return jsonify(response.json())

if __name__ == "__main__":
    app.run(debug=True)
