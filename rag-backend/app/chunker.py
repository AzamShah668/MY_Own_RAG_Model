from typing import List
from langchain_text_splitters import RecursiveCharacterTextSplitter

def create_chunks(text: str, chunk_size: int = 600, chunk_overlap: int = 100) -> List[str]:
    """
    Creates overlapping chunks of text using a hierarchical recursive splitting method.
    This preserves semantic context by splitting at natural boundaries like paragraphs and sentences.
    
    Args:
        text (str): The raw text to split.
        chunk_size (int): Max characters per chunk.
        chunk_overlap (int): Overlap between chunks for context.
        
    Returns:
        List[str]: List of semantically split text chunks.
    """
    if not text:
        return []

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        length_function=len,
        separators=["\n\n", "\n", ".", "?", "!", " ", ""]
    )
    
    return splitter.split_text(text)

if __name__ == "__main__":
    sample_text = "This is a test document. " * 50
    chunks = create_chunks(sample_text)
    print(f"Created {len(chunks)} chunks using recursive splitting.")
    if chunks:
        print(f"Sample chunk: {chunks[0][:50]}...")
