from flask import Flask, request, jsonify
from flask_cors import CORS
import traceback

from crew import crew
from database import SessionLocal
from models.history import SearchHistory

from tools.serp_shopping import (
    search_google,
    search_amazon,
    search_walmart,
    search_ebay
)

from tools.youtube_tool import get_youtube_reviews
from tools.news_tool import get_news

app = Flask(__name__)
CORS(app)


# HOME ROUTE
@app.route("/")
def home():
    return {
        "message": "AI Ecommerce API Running Successfully"
    }


# IMPROVED FILTER FUNCTION
def filter_products(results, product, result_key):
    filtered = []

    product_words = list(
        set(
            product.lower()
            .replace("-", " ")
            .replace(",", " ")
            .split()
        )
    )

    for item in results.get(result_key, []):
        title = item.get("title", "").lower().replace("-", " ")

        score = 0

        for word in product_words:
            if word in title:
                score += 1

        # minimum 1 keyword match enough
        if score >= 1:
            filtered.append(item)

    return filtered


# SEARCH PRODUCT
@app.route("/search", methods=["POST"])
def search_product_api():
    db = None
    try:
        data = request.get_json(force=True)
        product = data.get("product")

        if not product:
            return jsonify({
                "status": "error",
                "message": "Product name required"
            }), 400

        invalid_keywords = [
            "weather",
            "movie",
            "song",
            "sports",
            "politics",
            "cricket",
            "football"
        ]

        if any(word in product.lower() for word in invalid_keywords):
            return jsonify({
                "status": "error",
                "message": "Please enter product-related queries only"
            }), 400

        search_query = product.strip()

        # SERP API CALLS
        google_results = search_google(search_query)
        amazon_results = search_amazon(search_query)
        walmart_results = search_walmart(search_query)
        ebay_results = search_ebay(search_query)

        # RAW COUNTS
        print("\n========= RAW RESULTS =========")
        print("GOOGLE:", len(google_results.get("shopping_results", [])))
        print("AMAZON:", len(amazon_results.get("organic_results", [])))
        print("WALMART:", len(walmart_results.get("organic_results", [])))
        print("EBAY:", len(ebay_results.get("organic_results", [])))

        # FILTERED
        filtered_google = google_results.get("shopping_results", [])[:5]
        filtered_amazon = amazon_results.get("organic_results", [])[:5]
        filtered_walmart = walmart_results.get("organic_results", [])[:5]
        filtered_ebay = ebay_results.get("organic_results", [])[:5]

        
        print("\n========= FILTERED RESULTS =========")
        print("GOOGLE:", len(filtered_google))
        print("AMAZON:", len(filtered_amazon))
        print("WALMART:", len(filtered_walmart))
        print("EBAY:", len(filtered_ebay))

        # FALLBACK TO RAW IF FILTER FAILS
        if not filtered_google:
            filtered_google = google_results.get("shopping_results", [])[:5]

        if not filtered_amazon:
            filtered_amazon = amazon_results.get("organic_results", [])[:5]

        if not filtered_walmart:
            filtered_walmart = walmart_results.get("organic_results", [])[:5]

        if not filtered_ebay:
            filtered_ebay = ebay_results.get("organic_results", [])[:5]

        shopping_data = {
            "google": filtered_google[:5],
            "amazon": filtered_amazon[:5],
            "walmart": filtered_walmart[:5],
            "ebay": filtered_ebay[:5]
        }

        # FINAL CHECK
        if all(len(v) == 0 for v in shopping_data.values()):
            return jsonify({
                "status": "success",
                "product": product,
                "recommendation": "No products found",
                "youtube_reviews": "",
                "news_analysis": "No news available",
                "youtube_links": []
            })

        # YOUTUBE
        youtube_data = get_youtube_reviews(product)

        # NEWS
        news_data = get_news(product)

        # CREW AI
        result = crew.kickoff(
            inputs={
                "product": product,
                "shopping_data": str(shopping_data),
                "youtube_data": str(youtube_data),
                "news_data": str(news_data)
            }
        )

        # YOUTUBE LINKS
        youtube_links = []

        if youtube_data and "video_results" in youtube_data:
            for video in youtube_data["video_results"][:5]:
                if video.get("link"):
                    youtube_links.append(video["link"])

        # TASK OUTPUTS
        product_result = ""
        youtube_result = ""
        news_result = ""

        if hasattr(result, "tasks_output"):
            if len(result.tasks_output) > 0:
                product_result = str(result.tasks_output[0])

            if len(result.tasks_output) > 1:
                youtube_result = str(result.tasks_output[1])

            if len(result.tasks_output) > 2:
                news_result = str(result.tasks_output[2])

        # SAVE HISTORY
        db = SessionLocal()

        history = SearchHistory(
            product_name=product,
            recommendation=product_result,
            youtube_links=",".join(youtube_links),
            news_analysis=news_result
        )

        db.add(history)
        db.commit()

        return jsonify({
            "status": "success",
            "product": product,
            "recommendation": product_result,
            "youtube_reviews": youtube_result,
            "news_analysis": news_result,
            "youtube_links": youtube_links
        })

    except Exception as e:
        traceback.print_exc()

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

    finally:
        if db:
            db.close()


# GET YOUTUBE REVIEWS
@app.route("/youtube/<product>", methods=["GET"])
def youtube_reviews(product):
    try:
        videos = get_youtube_reviews(product)

        return jsonify({
            "status": "success",
            "product": product,
            "videos": videos
        })

    except Exception as e:
        traceback.print_exc()
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


# GET HISTORY
@app.route("/history", methods=["GET"])
def get_history():
    db = None
    try:
        db = SessionLocal()
        searches = db.query(SearchHistory).all()

        history = []

        for item in searches:
            history.append({
                "id": item.id,
                "recommendation": item.recommendation,
                "youtube_link": item.youtube_links,
                "timestamp": str(item.created_at)
            })

        return jsonify({
            "status": "success",
            "history": history
        })

    except Exception as e:
        traceback.print_exc()
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

    finally:
        if db:
            db.close()


# DELETE HISTORY
@app.route("/history/delete/<int:id>", methods=["DELETE"])
def delete_history(id):
    db = None
    try:
        db = SessionLocal()

        record = db.query(SearchHistory).filter(
            SearchHistory.id == id
        ).first()

        if not record:
            return jsonify({
                "status": "error",
                "message": "History not found"
            }), 404

        db.delete(record)
        db.commit()

        return jsonify({
            "status": "success",
            "message": "History deleted successfully"
        })

    except Exception as e:
        traceback.print_exc()
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

    finally:
        if db:
            db.close()


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=False,
        use_reloader=False
    )