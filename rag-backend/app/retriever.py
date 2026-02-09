from typing import List
from app.vectordb import VectorStore

def retrieve_context(query: str, vector_store: VectorStore, top_k: int = 3) -> List[str]:
    """
    Retrieves the most semantically relevant text chunks for a given query.
    
    Args:
        query (str): The search term or user question.
        vector_store (VectorStore): The initialized ChromaDB wrapper.
        top_k (int): Number of chunks to retrieve.
        
    Returns:
        List[str]: A list of retrieved text documents.
    """
    # ChromaDB built-in embedding handles the query vectorization automatically
    search_results = vector_store.query(
        query_texts=[query], 
        top_k=top_k
    )
    
    # Safely extract documents from the response structure
    # ChromaDB returns a list of lists: results['documents'][0]
    if search_results and "documents" in search_results and search_results["documents"]:
        return search_results["documents"][0]
    
    return []

if __name__ == "__main__":
    # Test logic
    # store = VectorStore()
    # print(retrieve_context("test query", store))
    pass
