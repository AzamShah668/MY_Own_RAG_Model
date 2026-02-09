import chromadb
from chromadb.utils import embedding_functions
from typing import List, Dict, Any, Optional
from app.config import settings

class VectorStore:
    """
    Persistent Vector Database wrapper using ChromaDB.
    Handles semantic storage and retrieval automatically.
    """
    
    def __init__(self, db_path: Optional[str] = None, collection_name: Optional[str] = None):
        """
        Initializes the persistent storage and embedding engine.
        Uses the 'all-MiniLM-L6-v2' local model for efficient, free embeddings.
        """
        self.db_path = db_path or settings.chroma_db_path
        self.collection_name = collection_name or settings.collection_name
        
        # Configure persistence
        self.client = chromadb.PersistentClient(path=self.db_path)
        
        # Initialize the embedding function (local and automatic)
        self.embedding_fn = embedding_functions.SentenceTransformerEmbeddingFunction(
            model_name="all-MiniLM-L6-v2"
        )
        
        # Persistent collection
        self.collection = self.client.get_or_create_collection(
            name=self.collection_name, 
            embedding_function=self.embedding_fn
        )

    def add_documents(self, ids: List[str], documents: List[str], metadatas: Optional[List[Dict[str, Any]]] = None):
        """
        Adds text documents to the vector store. 
        Note: Embeddings are generated internally by ChromaDB.
        """
        self.collection.add(
            ids=ids,
            documents=documents,
            metadatas=metadatas
        )

    def query(self, query_texts: List[str], top_k: int = 3) -> Dict[str, Any]:
        """
        Performs semantic similarity search.
        
        Args:
            query_texts (List[str]): The text queries to search for.
            top_k (int): Number of nearest neighbors to return.
            
        Returns:
            Dict: ChromaDB query results containing documents, distances, and metadata.
        """
        return self.collection.query(
            query_texts=query_texts,
            n_results=top_k
        )

if __name__ == "__main__":
    # Test stub
    vdb = VectorStore()
    print(f"VectorStore connected to: {vdb.db_path}")
