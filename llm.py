from langchain_community.document_loaders import UnstructuredURLLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import OllamaEmbeddings
from langchain_community.vectorstores import Chroma
from langchain.prompts import PromptTemplate
from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory
from langchain_community.chat_models import ChatOllama


embeddings = OllamaEmbeddings(model="llama3.2-vision:11b", base_url="http://91.107.230.57:11434/")


def add_url_to_chroma(url: str):
    loader = UnstructuredURLLoader(urls=[url])
    docs = loader.load()
    if not docs:
        raise ValueError("No documents loaded — check page content or login requirement.")

    splitter = RecursiveCharacterTextSplitter(chunk_size=5000, chunk_overlap=200)
    chunks = splitter.split_documents(docs)

    vectorstore = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings
    )
    return vectorstore


def query_rag_with_history(vectorstore, question: str, memory: ConversationBufferMemory):
    retriever = vectorstore.as_retriever(search_kwargs={"k": 8})

    template = """
    You are an AI assistant with access to webpage content.
    Use only the retrieved context and previous conversation to answer the question.
    If the context does not contain the answer, say "I couldn't find that in the provided content."

    Context:
    {context}

    Chat History:
    {chat_history}

    Question:
    {question}

    Answer:
    """
    prompt = PromptTemplate(template=template, input_variables=["context", "chat_history", "question"])

    llm = ChatOllama(model="llama3.2-vision:11b", base_url="http://91.107.230.57:11434/")

    qa = ConversationalRetrievalChain.from_llm(
        llm=llm,
        retriever=retriever,
        memory=memory,
        combine_docs_chain_kwargs={"prompt": prompt}
    )

    result = qa({"question": question})
    return result["answer"]


# Example usage
if __name__ == "__main__":
    test_url = "https://en.wikipedia.org/wiki/Nikola_Tesla"
    vs = add_url_to_chroma(test_url)

    # Create a memory object for the chat session
    chat_memory = ConversationBufferMemory(
        memory_key="chat_history",
        return_messages=True
    )

    print(query_rag_with_history(vs, "Who is Nikola Tesla?", chat_memory))
    print(query_rag_with_history(vs, "When was he born?", chat_memory))
    print(query_rag_with_history(vs, "What was his biggest invention?", chat_memory))
