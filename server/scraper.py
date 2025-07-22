from playwright.sync_api import sync_playwright

def get_djpunjab_song_link(query):
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        search_url = f"https://djpunjab.is/search?q={query.replace(' ', '+')}"
        page.goto(search_url)

        # Wait for search results
        page.wait_for_selector("a.font-weight-bold", timeout=8000)

        # Click on the first song link
        song_page_url = page.query_selector("a.font-weight-bold").get_attribute("href")
        page.goto(song_page_url)

        # Wait for download links
        page.wait_for_selector("a.btn.btn-success", timeout=8000)

        # Get the first mp3 link
        streaming_link = page.query_selector("a.btn.btn-success").get_attribute("href")

        browser.close()
        return streaming_link
