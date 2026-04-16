<div align="center">
  <img src="./docs/screenshots/dashboard.png" alt="AuraInsights Dashboard Header" width="100%" />
  
  <h1>📚 AuraInsights</h1>
  <p><strong>An Intelligent, AI-Powered Document Analysis & RAG Platform</strong></p>
</div>

---

## 🌟 About The Project

Welcome to **AuraInsights**—a next-generation document intelligence platform designed to seamlessly bridge the gap between static text and conversational AI. 

In today's fast-paced world, extracting meaningful context from vast libraries of books or documents is challenging. AuraInsights solves this by automatically scraping book metadata, analyzing it using advanced natural language processing (NLP), and exposing all of this data through a beautiful, glassmorphic dashboard. But it doesn't stop there. Through our Retrieval-Augmented Generation (RAG) pipeline, you can actually *converse* with your library, asking deeply contextual questions and receiving accurate, cited answers.

Whether you're a voracious reader, a researcher, or a data enthusiast, AuraInsights turns static collections into an interactive knowledge base.

<div align="center">
  <img src="./docs/screenshots/dashboard-action.png" alt="AuraInsights Visual Hierarchy" width="100%" />
  <p><em>Sleek, responsive discovery feeds built for intuitive exploration.</em></p>
</div>

---

## 🛠 Why This Tech Stack?

We meticulously selected modern, robust technologies to ensure the platform is not only blazing fast but also scalable and highly intelligent.

### Frontend: 
*   **Next.js 14:** Powers the sleek frontend. Its server-side rendering (SSR) capabilities ensure lightning-fast initial page loads and exceptional SEO performance. 
*   **Tailwind CSS:** Enables our custom, "glassmorphic" design scheme. By utilizing utility classes, we achieved pixel-perfect, highly responsive layouts that look stunning on any device.
*   **Lucide React & Framer Motion:** Used for premium iconography and buttery-smooth micro-animations that elevate the user experience.

### Backend & AI Intelligence:
*   **Django & Django REST Framework:** Provides a rock-solid, secure, and easily extensible backend architecture to handle complex routing and database processing.
*   **ChromaDB:** Our vector database of choice. It acts as the "long-term memory" of our AI, storing high-dimensional embeddings of book texts so they can be instantly retrieved during a semantic search.
*   **Sentence-Transformers (`all-MiniLM-L6-v2`):** A lightweight yet incredibly powerful model used to instantly convert text chunks into vector embeddings locally, without relying on paid APIs for standard indexing.
*   **OpenRouter (Claude 3.5 / Gemini 2.0):** Drives our conversational RAG interface, synthesizing the vector results into human-like, intelligent responses.
*   **Selenium Headless Automation:** Operates in the background as a digital librarian, stealthily navigating web pages to extract comprehensive book metadata, titles, and cover imagery without human intervention.

<div align="center">
  <img src="./docs/screenshots/detail-view.png" alt="AuraInsights Book Detail" width="100%" />
  <p><em>Deep AI semantic intelligence rendered seamlessly for every book.</em></p>
</div>

---

## 🧠 How It Works Under The Hood

AuraInsights operates through a sophisticated, 3-phase pipeline:

1.  **The Gathering (Selenium Scraper):** You provide a target, and our headless browser securely navigates the site, scraping metadata and high-fidelity cover imagery into our SQLite database.
2.  **The Analysis (AI Brain):** The text is chunked and analyzed. We extract a core Summary, classify the Genre, calculate the Sentiment (e.g., "Empowering & Action-Oriented"), and develop personalized Recommendation Logic.
3.  **The Chat (RAG Pipeline):** When you ask a question in the AI Chat, your prompt is converted into an embedding. ChromaDB performs a "cosine similarity search" to find the most relevant book snippets. These snippets are fed to our LLM, which then generates a conversational, highly accurate response.

---

## 💬 The Interactive Experience

<div align="center">
  <img src="./docs/screenshots/chat-interface.png" alt="AuraInsights Chat UI" width="100%" />
  <p><em>Persistent, context-aware RAG discussions about your library.</em></p>
</div>

---

## 🚀 Getting Started

Follow these instructions to get your local copy of AuraInsights up and running in minutes.

### Prerequisites
Before you begin, ensure you have the following installed on your machine:
*   **Python (3.9+)**
*   **Node.js (18+)**
*   **npm** or **yarn**

### 1. Environment Variable Setup (`.env`)
The intelligence of this application is powered by OpenRouter. You'll need to configure your environment variables first.

1. Navigate to the `backend/` directory.
2. Create a file named `.env` in the root of the backend folder.
3. Add the following keys (replace `your_openrouter_api_key` with your actual key):
```env
# /backend/.env
OPENROUTER_API_KEY=your_openrouter_api_key_here
RECOMMENDED_MODEL=anthropic/claude-3.5-sonnet
```
*(Note: If you do not have OpenRouter, any OpenAI-compliant endpoint can be adapted in the settings).*

### 2. Backend Initialization
Open your terminal and initialize the Django intelligence layer:

```bash
cd backend
# Install Python dependencies
python -m pip install -r requirements.txt

# Migrate the database and setup the schema
python manage.py makemigrations
python manage.py migrate

# (Optional) Seed the database with our 'Gold Standard' sample data
python seed_data.py

# Launch the backend server mapped to port 8000
python manage.py runserver 0.0.0.0:8000
```

### 3. Frontend Initialization
Open a parallel terminal window to start the Next.js aesthetic layer:

```bash
cd frontend
# Install Node dependencies
npm install

# Start the dev server
npm run dev -- --port 3000
```

### 🎉 You're Live!
Open [http://localhost:3000](http://localhost:3000) in your favorite browser. Dive in, sync your library, and start exploring the future of reading!

---
*Built with ❤️ and dedication by Antigravity for the Ergosphere Solutions Pvt. Ltd. Internship Assignment.*
