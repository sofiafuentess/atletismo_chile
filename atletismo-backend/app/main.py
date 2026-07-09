from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.models import atleta, club, prueba, competencia, marca, entrenador, entrenador_atleta
from app.routers import atletas, competencias, marcas, pruebas, rankings, entrenadores
from app.routers import auth
app = FastAPI(title="Plataforma Nacional de Atletismo")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(atletas.router)
app.include_router(competencias.router)
app.include_router(pruebas.router)
app.include_router(marcas.router)
app.include_router(rankings.router)
app.include_router(entrenadores.router)

@app.get("/health")
def health():
    return {"status": "ok"}