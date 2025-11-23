from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# Para pruebas, dejamos CORS abierto (luego lo cerramos)
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class LoginRequest(BaseModel):
    username: str
    password: str

@app.post("/api/login")
def login(data: LoginRequest):
    # VALIDACIÓN DE PRUEBA
    if data.username == "admin" and data.password == "1234":
        return {"success": True, "detail": "Login exitoso desde Python 😎"}
    else:
        return {"success": False, "detail": "Usuario o contraseña incorrectos"}
