# from flask import Flask, request, jsonify
# import requests
# import os
# from dotenv import load_dotenv

# load_dotenv()  # Load environment variables from .env file

# app = Flask(__name__)

# EBAY_APP_ID = os.environ.get("EBAY_APP_ID")  # Get API key from environment variables

# @app.route('/api/search')
# def search():
#     query = request.args.get('q')

#     if not query:
#         return jsonify({"error": "Search query is required"}), 400

#     try:
#         headers = {
#             "Authorization": f"Bearer {EBAY_APP_ID}",
#             "Accept": "application/json"
#         }
#         params = {
#             "q": query,
#             "limit": 15,  # Adjust as needed
#             "fieldgroups": "FULL"
#         }

#         response = requests.get("https://api.ebay.com/buy/browse/v1/item_summary/search", 
#                                 headers=headers, params=params)
#         response.raise_for_status()  # Raise an exception for bad status codes (4xx or 5xx)
#         listings = response.json().get('itemSummaries', [])  # Extract listings or empty list

#         return jsonify(listings)

#     except requests.exceptions.RequestException as e:
#         print(f"Error fetching from eBay API: {e}")
#         return jsonify({"error": "Error fetching listings"}), 500
#     except Exception as e:  # Catch other potential errors
#         print(f"An unexpected error occurred: {e}")
#         return jsonify({"error": "An unexpected error occurred"}), 500


# if __name__ == '__main__':
#     port = int(os.environ.get("PORT", 5000))  # Get port from environment or use 5000
#     app.run(debug=True, host='0.0.0.0', port=port) # host='0.0.0.0' for Vercel


from flask import Flask, request, jsonify
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_cors import CORS
import requests
import os
import logging
import base64
from functools import wraps
from datetime import datetime, timedelta
from cachetools import TTLCache
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Set up rate limiting
limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["100 per day", "10 per minute"]
)

# Cache for access token with 1-hour TTL
token_cache = TTLCache(maxsize=1, ttl=3600)

# Configuration
class Config:
    EBAY_CLIENT_ID = os.environ.get("EBAY_APP_ID")
    EBAY_CLIENT_SECRET = os.environ.get("EBAY_CERT_ID")
    EBAY_OAUTH_URL = "https://api.ebay.com/identity/v1/oauth2/token"
    EBAY_API_URL = "https://api.ebay.com/buy/browse/v1/item_summary/search"
    
    @classmethod
    def validate(cls):
        if not all([cls.EBAY_CLIENT_ID, cls.EBAY_CLIENT_SECRET]):
            raise EnvironmentError("Missing required eBay API credentials")

# Custom exception for API errors
class EbayAPIError(Exception):
    def __init__(self, message, status_code=None, error_details=None):
        super().__init__(message)
        self.status_code = status_code
        self.error_details = error_details

def error_handler(func):
    """Decorator to handle errors consistently"""
    @wraps(func)
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except EbayAPIError as e:
            logger.error(f"eBay API Error: {str(e)}, Status: {e.status_code}, Details: {e.error_details}")
            return jsonify({
                "error": str(e),
                "status_code": e.status_code,
                "details": e.error_details
            }), e.status_code or 500
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}", exc_info=True)
            return jsonify({
                "error": "An unexpected error occurred",
                "details": str(e)
            }), 500
    return wrapper

def get_access_token():
    """Get OAuth access token from cache or eBay API"""
    if "token" in token_cache:
        return token_cache["token"]

    try:
        credentials = base64.b64encode(
            f"{Config.EBAY_CLIENT_ID}:{Config.EBAY_CLIENT_SECRET}".encode()
        ).decode()

        response = requests.post(
            Config.EBAY_OAUTH_URL,
            headers={
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": f"Basic {credentials}"
            },
            data={
                "grant_type": "client_credentials",
                "scope": "https://api.ebay.com/oauth/api_scope"
            }
        )
        
        if response.status_code != 200:
            raise EbayAPIError(
                "Failed to obtain access token",
                status_code=response.status_code,
                error_details=response.text
            )

        token_data = response.json()
        token = token_data.get("access_token")
        if not token:
            raise EbayAPIError("No access token in response")

        token_cache["token"] = token
        return token

    except requests.exceptions.RequestException as e:
        raise EbayAPIError(f"Request failed: {str(e)}", status_code=500)

@app.route('/api/search')
@limiter.limit("5 per minute")  # Rate limit for search endpoint
@error_handler
def search():
    """Search eBay listings with enhanced error handling and validation"""
    query = request.args.get('q', '').strip()
    limit = request.args.get('limit', 15, type=int)
    
    # Input validation
    if not query:
        raise EbayAPIError("Search query is required", status_code=400)
    if not 1 <= limit <= 50:
        raise EbayAPIError("Limit must be between 1 and 50", status_code=400)

    # Log search request
    logger.info(f"Search request - Query: {query}, Limit: {limit}")
    
    access_token = get_access_token()
    
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json",
        "X-EBAY-C-MARKETPLACE-ID": "EBAY_US"
    }
    
    params = {
        "q": query,
        "limit": limit,
        "fieldgroups": "FULL"
    }

    try:
        response = requests.get(
            Config.EBAY_API_URL,
            headers=headers,
            params=params,
            timeout=10  # Add timeout
        )
        
        response.raise_for_status()
        data = response.json()
        
        # Process and validate response
        listings = data.get('itemSummaries', [])
        total_items = len(listings)
        logger.info(f"Search completed - Found {total_items} items")

        # Transform response to include additional metadata
        return jsonify({
            "success": True,
            "query": query,
            "total_items": total_items,
            "items": listings,
            "timestamp": datetime.utcnow().isoformat()
        })

    except requests.exceptions.RequestException as e:
        raise EbayAPIError(f"eBay API request failed: {str(e)}", status_code=502)

@app.route('/api/health')
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "1.0.0"
    })

if __name__ == '__main__':
    # Validate configuration on startup
    Config.validate()
    
    # Get port from environment or use default
    port = int(os.environ.get("PORT", 5000))
    
    # Start server
    app.run(debug=False, host='0.0.0.0', port=port)