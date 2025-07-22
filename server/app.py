# backend/app.py

from flask import Flask, request, jsonify, redirect
from flask_cors import CORS
import yt_dlp

app = Flask(__name__)
CORS(app)

# --- CORRECTED: Use 'in_playlist' for the best balance of speed and metadata ---
YDL_SEARCH_OPTS = {
    'quiet': True,
    'default_search': 'ytsearch5',
    'extract_flat': 'in_playlist',  # This is the key change
}

# Options for fetching the specific stream URL (this is unchanged and correct)
YDL_STREAM_OPTS = {
    # This format selector prioritizes a direct M4A audio file, avoiding manifests.
    'format': 'bestaudio[ext=m4a]/bestaudio/best',
    'noplaylist': True,
    'quiet': True,
}

@app.route("/")
def index():
    return "Sonus Backend API is running!"

# --- CORRECTED: /api/search endpoint ---
@app.route('/api/search', methods=['GET'])
def search():
    query = request.args.get('query')
    if not query:
        return jsonify({"error": "Query parameter is required"}), 400

    try:
        with yt_dlp.YoutubeDL(YDL_SEARCH_OPTS) as ydl:
            search_results = ydl.extract_info(query, download=False)
            videos = []
            if 'entries' in search_results:
                for entry in search_results['entries']:
                    # Simplified to only use fields that are reliably present
                    videos.append({
                        'id': entry.get('id'),
                        'title': entry.get('title'),
                        'thumbnail': f"https://i.ytimg.com/vi/{entry.get('id')}/hqdefault.jpg",
                        # 'channel' or 'uploader' should be available
                        'channel': entry.get('channel') or entry.get('uploader', 'Unknown Artist'), 
                        # 'duration' (in seconds) might be available, but we'll omit it for robustness
                    })
            return jsonify(videos)
    except Exception as e:
        # This print statement is crucial for debugging! Check your Flask terminal.
        print(f"Error in /api/search: {e}") 
        return jsonify({"error": str(e)}), 500

# The /api/stream endpoint is unchanged and correct
@app.route('/api/stream/<video_id>', methods=['GET'])
def stream(video_id):
    if not video_id:
        return jsonify({"error": "Video ID is required"}), 400

    try:
        video_url = f"https://www.youtube.com/watch?v={video_id}"
        with yt_dlp.YoutubeDL(YDL_STREAM_OPTS) as ydl:
            # ydl.extract_info will now automatically select the best direct audio file
            # based on the 'format' option we set above.
            info = ydl.extract_info(video_url, download=False)
            
            # We can now directly return the URL from the top-level info dictionary.
            # This is simpler and less error-prone than looping through formats.
            return jsonify({'url': info['url']})

    except Exception as e:
        print(f"Error in /api/stream for video_id {video_id}: {e}")
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)