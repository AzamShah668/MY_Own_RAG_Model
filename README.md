# AXM Enterprises: Premium RAG Intelligence Platform

A production-grade Retrieval Augmented Generation (RAG) platform designed for high-performance document intelligence. Powered by **Groq LPU** acceleration and **ChromaDB** vector memory.

## 🏗️ Architecture

This repository is organized as a monorepo containing:
- **/rag-backend**: FastAPI server with asynchronous document processing, semantic chunking, and vector database integration.
- **/rag-frontend**: Next.js 14+ dashboard featuring persistent state management (Zustand), real-time job tracking, and a premium glassmorphism UI.

## 🚀 Key Features

### Intelligence Core
- **Sub-second Inference**: Optimized Groq Llama 3.1 integration.
- **Background Ingestion**: Asynchronous multi-stage indexing (Extracting → Chunking → Indexing).
- **Multi-Format Support**: Native handling of `.pdf` and `.pptx` (PowerPoint) files.

### Engineering Excellence
- **Persistent Memory**: Chat history and upload status survive navigation and page refreshes.
- **Enterprise UI**: Custom-built dashboard with dark mode and smooth micro-animations.
- **Scalable Backend**: Efficient vector storage and retrieval using ChromaDB.

## 🛠️ Setup Instructions

### Backend (Python)
1. Navigate to `/rag-backend`.
2. Install dependencies: `pip install -r requirements.txt`.
3. Configure your `.env` with `GROQ_API_KEY`.
4. Start the server: `uvicorn app.main:app --port 8001`.

### Frontend (Next.js)
1. Navigate to `/rag-frontend`.
2. Install dependencies: `npm install`.
3. Start the dev server: `npm run dev`.
4. Open `http://localhost:3000`.

---
*Built for AXM Enterprises • Accelerated by Groq • Structured by ChromaDB*
