from app.database import SessionLocal
from app.models.prueba import Prueba

pruebas = [
    # pista - segundos
    {"nombre": "60m",       "tipo": "pista", "unidad": "s"},
    {"nombre": "100m",      "tipo": "pista", "unidad": "s"},
    {"nombre": "200m",      "tipo": "pista", "unidad": "s"},
    {"nombre": "400m",      "tipo": "pista", "unidad": "s"},
    {"nombre": "800m",      "tipo": "pista", "unidad": "s"},
    {"nombre": "1500m",     "tipo": "pista", "unidad": "s"},
    {"nombre": "3000m",     "tipo": "pista", "unidad": "s"},
    {"nombre": "5000m",     "tipo": "pista", "unidad": "s"},
    {"nombre": "10000m",    "tipo": "pista", "unidad": "s"},
    {"nombre": "110m vallas","tipo": "pista", "unidad": "s"},
    {"nombre": "100m vallas","tipo": "pista", "unidad": "s"},
    {"nombre": "400m vallas","tipo": "pista", "unidad": "s"},
    {"nombre": "3000m obstaculos","tipo": "pista", "unidad": "s"},
    {"nombre": "4x100m",    "tipo": "pista", "unidad": "s"},
    {"nombre": "4x400m",    "tipo": "pista", "unidad": "s"},
    # campo - metros
    {"nombre": "salto largo",    "tipo": "campo", "unidad": "m"},
    {"nombre": "triple salto",   "tipo": "campo", "unidad": "m"},
    {"nombre": "salto alto",     "tipo": "campo", "unidad": "m"},
    {"nombre": "salto con garrocha","tipo": "campo", "unidad": "m"},
    {"nombre": "lanzamiento bala",  "tipo": "campo", "unidad": "m"},
    {"nombre": "lanzamiento disco", "tipo": "campo", "unidad": "m"},
    {"nombre": "lanzamiento jabalina","tipo": "campo", "unidad": "m"},
    {"nombre": "lanzamiento martillo","tipo": "campo", "unidad": "m"},
    # ruta
    {"nombre": "media maraton", "tipo": "ruta", "unidad": "s"},
    {"nombre": "maraton",       "tipo": "ruta", "unidad": "s"},
    {"nombre": "10km ruta",     "tipo": "ruta", "unidad": "s"},
]

def seed():
    db = SessionLocal()
    try:
        existentes = db.query(Prueba).count()
        if existentes > 0:
            print(f"Ya existen {existentes} pruebas, omitiendo seed.")
            return
        for p in pruebas:
            db.add(Prueba(**p))
        db.commit()
        print(f"{len(pruebas)} pruebas insertadas correctamente.")
    finally:
        db.close()

if __name__ == "__main__":
    seed()