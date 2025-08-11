from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from llm import add_url_to_chroma, query_rag_with_history
from langchain.memory import ConversationBufferMemory
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

sessions = {}

class LoadURLRequest(BaseModel):
    session_id: str
    url: str

class AskRequest(BaseModel):
    session_id: str
    question: str


@app.post("/load-url")
def load_url(request: LoadURLRequest):
    try:
        print(f"[DEBUG] Received /load-url: session_id={request.session_id}, url={request.url}")
        vectorstore = add_url_to_chroma(request.url)
        memory = ConversationBufferMemory(
            memory_key="chat_history",
            return_messages=True
        )
        sessions[request.session_id] = {
            "vectorstore": vectorstore,
            "memory": memory
        }
        print(f"[DEBUG] Successfully loaded URL for session {request.session_id}")
        return {"message": "URL loaded and session initialized"}
    except Exception as e:
        import traceback
        print(f"[ERROR] Exception in /load-url: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/ask")
def ask_question(request: AskRequest):
    if request.session_id not in sessions:
        raise HTTPException(status_code=400, detail="Session not found. Load a URL first.")

    try:
        vectorstore = sessions[request.session_id]["vectorstore"]
        memory = sessions[request.session_id]["memory"]

        answer = query_rag_with_history(vectorstore, request.question, memory)
        return {"answer": answer}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/")
def home():
    return {"message": "RAG Chatbot API is running"}
