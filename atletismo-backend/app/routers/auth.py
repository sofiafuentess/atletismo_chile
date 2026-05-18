from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.usuario import Usuario
from app.schemas.usuario import UsuarioCreate, UsuarioOut, LoginRequest, Token
from app.utils.auth import hashear_password, autenticar_usuario, crear_token, decodificar_token

router = APIRouter(prefix="/auth", tags=["Auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = decodificar_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Token inválido")
    usuario = db.query(Usuario).filter(Usuario.email == payload.get("sub")).first()
    if not usuario or not usuario.activo:
        raise HTTPException(status_code=401, detail="Usuario no encontrado")
    return usuario

def requiere_admin(usuario: Usuario = Depends(get_current_user)):
    if usuario.rol != "admin":
        raise HTTPException(status_code=403, detail="Se requiere rol admin")
    return usuario

def requiere_entrenador(usuario: Usuario = Depends(get_current_user)):
    if usuario.rol not in ["admin", "entrenador"]:
        raise HTTPException(status_code=403, detail="Se requiere rol entrenador o admin")
    return usuario

@router.post("/registro", response_model=UsuarioOut)
def registrar(usuario: UsuarioCreate, db: Session = Depends(get_db)):
    existente = db.query(Usuario).filter(Usuario.email == usuario.email).first()
    if existente:
        raise HTTPException(status_code=400, detail="Email ya registrado")
    nuevo = Usuario(
        email=usuario.email,
        nombre=usuario.nombre,
        hashed_password=hashear_password(usuario.password),
        rol=usuario.rol
    )
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo

@router.post("/login", response_model=Token)
def login(datos: LoginRequest, db: Session = Depends(get_db)):
    usuario = autenticar_usuario(db, datos.email, datos.password)
    if not usuario:
        raise HTTPException(status_code=401, detail="Email o contraseña incorrectos")
    token = crear_token({"sub": usuario.email, "rol": usuario.rol})
    return {
        "access_token": token,
        "token_type": "bearer",
        "rol": usuario.rol,
        "nombre": usuario.nombre
    }

@router.get("/me", response_model=UsuarioOut)
def me(usuario: Usuario = Depends(get_current_user)):
    return usuario