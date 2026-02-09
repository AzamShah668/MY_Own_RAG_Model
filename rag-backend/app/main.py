import os
import shutil
import uuid
from fastapi import FastAPI, UploadFile, File, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict

from app.ingest import extract_text
from app.chunker import create_chunks
from app.vectordb import VectorStore
from app.retriever import retrieve_context
from app.llm import LLMInterface
from app.schemas import QueryRequest, QueryResponse, UploadResponse

# --- Initialization ---
app = FastAPI(
    title="AXM Enterprises RAG Engine",
    description="High-performance RAG backend powered by Groq and ChromaDB",
    version="1.3.0"
)

# CORS Configuration
app.add_middleware(
 CORSMiddleware,
 allow_origins=[
     "http://localhost:3000",
     "http://127.0.0.1:3000"
 ],
 allow_credentials=True,
 allow_methods=["*"],
 allow_headers=["*"],
)

# Core components
vector_store = VectorStore()
llm_interface = LLMInterface()

# In-memory job tracker (Simplified for now)
jobs: Dict[str, Dict] = {}

# Ensure persistence layers are ready
os.makedirs("data/pdfs", exist_ok=True)

# --- Background Worker ---

def process_document_task(job_id: str, local_path: str, filename: str):
    """Heavy lifting background task for indexing."""
    try:
        jobs[job_id]["status"] = "extracting"
        raw_text = extract_text(local_path)
        
        if not raw_text or not raw_text.strip():
             jobs[job_id]["status"] = "error"
             jobs[job_id]["error"] = "No extractable text found."
             return

        jobs[job_id]["status"] = "chunking"
        chunks = create_chunks(raw_text)
        
        if not chunks:
             jobs[job_id]["status"] = "error"
             jobs[job_id]["error"] = "Document too short or unreadable."
             return

        jobs[job_id]["status"] = "indexing"
        doc_ids = [f"{filename}_{uuid.uuid4().hex[:8]}" for _ in range(len(chunks))]
        metadatas = [{"source": filename, "index": i} for i in range(len(chunks))]
        
        vector_store.add_documents(
            ids=doc_ids,
            documents=chunks,
            metadatas=metadatas
        )
        
        jobs[job_id]["status"] = "completed"
        jobs[job_id]["chunks_count"] = len(chunks)
        
    except Exception as e:
        jobs[job_id]["status"] = "error"
        jobs[job_id]["error"] = str(e)
        if os.path.exists(local_path): os.remove(local_path)

# --- API Endpoints ---

@app.get("/", tags=["Health"])
async def root():
    return {"status": "online", "message": "AXM Enterprises RAG Engine is operational"}

@app.post("/upload_pdf", response_model=UploadResponse, tags=["Ingestion"])
async def upload_pdf(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    """Uploads file and starts background indexing."""
    filename_lower = file.filename.lower()
    if not (filename_lower.endswith(".pdf") or filename_lower.endswith(".pptx")):
        raise HTTPException(status_code=400, detail="Invalid format. PDF or PPTX required.")
    
    job_id = f"job_{uuid.uuid4().hex[:12]}"
    local_path = f"data/pdfs/{file.filename}"
    
    try:
        with open(local_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        jobs[job_id] = {
            "id": job_id,
            "filename": file.filename,
            "status": "queued",
            "progress": 0
        }
        
        # Start background task
        background_tasks.add_task(process_document_task, job_id, local_path, file.filename)
        
        return UploadResponse(
            message="Upload successful. Indexing started in background.",
            filename=file.filename,
            chunks_count=0,
            job_id=job_id
        )
        
    except Exception as e:
        if os.path.exists(local_path): os.remove(local_path)
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@app.get("/job/{job_id}", tags=["Ingestion"])
async def get_job_status(job_id: str):
    """Check the status of a background indexing job."""
    if job_id not in jobs:
        raise HTTPException(status_code=404, detail="Job not found")
    return jobs[job_id]

@app.post("/ask", response_model=QueryResponse, tags=["Query"])
async def ask(request: QueryRequest):
    context_chunks = retrieve_context(
        query=request.question,
        vector_store=vector_store,
        top_k=request.top_k
    )
    
    if not context_chunks:
        return QueryResponse(
            answer="I couldn't find any relevant information in your documents.",
            context=[],
            question=request.question
        )
    
    answer = llm_interface.generate_answer(
        query=request.question,
        context_chunks=context_chunks
    )
    
    return QueryResponse(
        answer=answer,
        context=context_chunks,
        question=request.question
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8001, reload=True)
