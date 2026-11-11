# HireMe AI — Personal Career Assistant

An AI chatbot that lets recruiters and HR professionals ask questions about my education, skills, projects, and certifications and get answers grounded in my resume.

**Live demo:** https://hireme-ai-seven.vercel.app
**API docs:** https://hireme-ai-a5ls.onrender.com/docs

> The backend runs on a free Render instance, so the first request after a period of inactivity can take up to a minute while it wakes up.

## Features

- Chat interface with quick-question buttons (skills, projects, education)
- Answers generated only from the information in the resume, with instructions to say so when something is not available
- Resume parsing from PDF (and DOCX) into structured data using Pydantic models
- REST API built with FastAPI, with automatic interactive docs at `/docs`
- CORS configured so the Vercel frontend can call the Render backend
- API keys kept on the server in environment variables, never exposed to the browser

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js, React, TypeScript, Tailwind CSS |
| Backend | Python, FastAPI, Uvicorn |
| AI | Groq API (`openai/gpt-oss-120b`) |
| Resume parsing | pypdf, python-docx, Pydantic |
| Deployment | Vercel (frontend), Render (backend) |

## Architecture

```
Recruiter / HR
      |
Next.js chat UI (Vercel)
      |  POST /chat  { "question": "..." }
FastAPI backend (Render)
      |
Resume text + Groq LLM
```

## Project Structure

```
hireme/
├── backend/
│   ├── main.py             # FastAPI app, resume parsing, chat endpoint
│   ├── requirements.txt    # Python dependencies for deployment
│   └── <resume>.pdf        # Resume used as the knowledge base
├── frontend/
│   ├── app/page.tsx        # Chat UI
│   └── package.json
└── README.md
```

## API

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Health check |
| POST | `/chat` | Ask a question about the candidate |

Example request:

```bash
curl -X POST https://hireme-ai-a5ls.onrender.com/chat \
  -H "Content-Type: application/json" \
  -d '{"question": "Does Rishav know Python?"}'
```

## Run Locally

### Prerequisites

- Python 3.12 or newer
- Node.js 20 or newer
- A free [Groq API key](https://console.groq.com)

### Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Create a `.env` file (this file is git-ignored and must never be committed):

```
GROQ_API_KEY=your_key_here
```

Start the server:

```bash
uvicorn main:app --reload
```

The API runs at http://127.0.0.1:8000 and the docs at http://127.0.0.1:8000/docs.

### Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:

```
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

Start the dev server:

```bash
npm run dev
```

Open http://localhost:3000.

## Deployment

**Backend on Render**

- Root directory: `backend`
- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Environment variable: `GROQ_API_KEY`

**Frontend on Vercel**

- Root directory: `frontend`
- Framework preset: Next.js
- Environment variable: `NEXT_PUBLIC_API_URL` set to the Render backend URL (no trailing slash)

After deploying the frontend, add its URL to the `allow_origins` list in `backend/main.py` so the browser is allowed to call the API.

## What I Learned

- Building and deploying a full-stack AI application end to end
- Prompting an LLM to stay grounded in provided context and avoid inventing information
- Structured extraction with Pydantic models and JSON mode
- Configuring CORS between separately hosted frontend and backend
- Managing secrets with environment variables

## Possible Improvements

- Streaming responses for a faster-feeling chat
- Conversation memory so follow-up questions have context
- Rate limiting to protect the free-tier API quota
- Embeddings and a vector database for larger knowledge bases

## Author

**Rishav Dev**
GitHub: [rishavdev01](https://github.com/rishavdev01)
LinkedIn: [rishav-dev26](https://linkedin.com/in/rishav-dev26)
