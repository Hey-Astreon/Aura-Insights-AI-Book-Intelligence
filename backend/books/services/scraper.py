import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from ..models import Book

class ScraperService:
    """
    Handles automated web scraping operations using Selenium.
    Specially optimized for headless execution to minimize resource overhead.
    """
    @staticmethod
    def scrape_books(base_url="http://books.toscrape.com"):
        """
        Main entry point for scraping book metadata.
        Target: books.toscrape.com (Demo platform)
        """
        # Configure headless chrome options
        options = Options()
        options.add_argument("--headless")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        
        # Initialize the webdriver with automatic driver management
        driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
        
        try:
            driver.get(base_url)
            time.sleep(2) # Initial load buffer
            
            # Locate product pods on the dashboard
            book_elements = driver.find_elements(By.CSS_SELECTOR, "article.product_pod")
            scraped_count = 0
            
            # Process a subset of books for the demo limit
            for element in book_elements[:10]:
                title = element.find_element(By.CSS_SELECTOR, "h3 a").get_attribute("title")
                url = element.find_element(By.CSS_SELECTOR, "h3 a").get_attribute("href")
                
                # NEW: Capture the image URL
                try:
                    thumbnail = element.find_element(By.CSS_SELECTOR, "div.image_container img").get_attribute("src")
                except:
                    thumbnail = None
                
                # Check for existing records to prevent duplicates
                book, created = Book.objects.get_or_create(
                    book_url=url,
                    defaults={
                        'title': title,
                        'image_url': thumbnail
                    }
                )
                
                if created:
                    scraped_count += 1
                elif not book.image_url and thumbnail:
                    # Update image if missing on existing records
                    book.image_url = thumbnail
                    book.save()
                
            return scraped_count
        finally:
            # Ensure the driver is destroyed to prevent resource leaks
            driver.quit()
