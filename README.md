<div align="center">
  <img src="logo.png" alt="Tabby Logo" width="150" />
  <h1>Tabby</h1>
  <p><strong>Your personal AI assistant for any webpage.</strong></p>
</div>

Tabby is an intelligent Chrome extension that acts as your sidekick while you browse. It allows you to have a conversation with any webpage, ask specific questions, get summaries of long articles, and find information instantly.

<div align="center">
  <img src="demo.gif" alt="Tabby Demo" width="400" />
</div>

## ✨ Features

* **Interactive Chat:** Open Tabby on any site and start a conversation with the content.
* **Instant Summaries:** Get the gist of long articles or documents in seconds.
* **Ask Anything:** Ask specific questions about the webpage and get concise, AI-powered answers.
* **Sleek & Intuitive UI:** A beautiful and easy-to-use chat interface that stays out of your way.
* **Session-Aware:** Remembers the context of your current page as you chat.

## ⚙️ How It Works

Tabby uses a Retrieval-Augmented Generation (RAG) architecture to provide accurate answers based on the content of the current webpage.

1.  The **Chrome Extension** (frontend) grabs the URL of your active tab.
2.  When you ask a question, the URL and your query are sent to the **FastAPI Server** (backend).
3.  The backend uses a document loader to fetch and process the content from the URL.
4.  The content is converted into searchable embeddings and stored.
5.  When you ask a question, the RAG pipeline finds the most relevant parts of the content.
6.  This context, along with your question, is passed to a **Large Language Model (LLM)**.
7.  The LLM generates a relevant answer, which is sent back to the chat UI.

## 🛠️ Tech Stack

* **Frontend:**
    * HTML5
    * CSS3
    * Vanilla JavaScript
    * Chrome Extension APIs
* **Backend:**
    * Python 3.10+
    * FastAPI
    * Uvicorn (ASGI Server)
    * LangChain / LlamaIndex (for RAG pipeline)
    * Ollama / OpenAI (for LLMs and embeddings)

## 🚀 Installation and Setup

To get Tabby running on your local machine, you'll need to set up both the backend server and the Chrome extension.

### 1. Setting Up the Backend Server for running locally

First, let's get the brains of the operation running.

```bash
# 1. Clone the repository
git clone [https://github.com/Shreyank02/Tabby.git](https://github.com/Shreyank02/Tabby.git)

# 2. Navigate to the backend directory (you might need to create this structure)
cd Tabby/backend

# 3. Install the required Python packages
pip install -r requirements.txt

# 4. Run the FastAPI server
uvicorn main:app --reload
```

Your AI backend should now be running on `http://127.0.0.1:8000`.

### 2. Installing the Chrome Extension (using globally deployed server)

Now, follow these steps precisely to install the extension in your browser.

1.  **Download the Code:** Click on the green `Code` button on the main GitHub page and select **Download ZIP**.

2.  **Unzip the File:** Find the downloaded `Tabby-main.zip` file and unzip it. You will now have a folder named `Tabby-main`.

3.  **Open Chrome Extensions:** Open your Google Chrome browser and navigate to `chrome://extensions`. You can also do this by clicking the three-dot menu > Extensions > Manage Extensions.

4.  **Enable Developer Mode:** In the top-right corner of the Extensions page, find the **Developer mode** toggle and turn it **on**.

5.  **Load the Extension:** You should now see a button that says **Load unpacked**. Click on it.

6.  **Select the Folder:** A file selection window will open. Navigate to and select the `frontend` folder that is inside the `Tabby-main` folder you unzipped earlier.

7.  **Run It!** Tabby should now appear in your list of extensions! Pin it to your toolbar for easy access, navigate to any webpage, and click the Tabby icon to start chatting.

## 🤝 Contributing

Contributions are welcome! If you have ideas for new features or improvements, feel free to fork the repository, make your changes, and open a pull request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for more details.
