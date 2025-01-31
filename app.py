from flask import Flask, request, jsonify
import requests
import os
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env file

app = Flask(__name__)

EBAY_APP_ID = os.environ.get("EBAY_APP_ID")  # Get API key from environment variables

@app.route('/api/search')
def search():
    query = request.args.get('q')

    if not query:
        return jsonify({"error": "Search query is required"}), 400

    try:
        headers = {
            "Authorization": f"Bearer {EBAY_APP_ID}",
            "Accept": "application/json"
        }
        params = {
            "q": query,
            "limit": 15,  # Adjust as needed
            "fieldgroups": "FULL"
        }

        response = requests.get("https://api.ebay.com/buy/browse/v1/item_summary/search", 
                                headers=headers, params=params)
        response.raise_for_status()  # Raise an exception for bad status codes (4xx or 5xx)
        listings = response.json().get('itemSummaries', [])  # Extract listings or empty list

        return jsonify(listings)

    except requests.exceptions.RequestException as e:
        print(f"Error fetching from eBay API: {e}")
        return jsonify({"error": "Error fetching listings"}), 500
    except Exception as e:  # Catch other potential errors
        print(f"An unexpected error occurred: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500


if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))  # Get port from environment or use 5000
    app.run(debug=True, host='0.0.0.0', port=port) # host='0.0.0.0' for Vercel