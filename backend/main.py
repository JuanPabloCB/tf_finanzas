# backend/main.py
from hashlib import sha256
from typing import Dict

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="TF Finanzas API")

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# "Base de datos" en memoria
users_db: Dict[str, Dict] = {}
clients_db: Dict[str, Dict] = {}  # 👈 para clientes


def hash_password(password: str) -> str:
    return sha256(password.encode("utf-8")).hexdigest()


class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    password2: str


class LoginRequest(BaseModel):
    email: str
    password: str


class BasicResponse(BaseModel):
    success: bool
    detail: str
    name: str | None = None
    email: str | None = None

class ClientRequest(BaseModel):
    dni: str
    first_name: str
    last_name_p: str
    last_name_m: str
    birth_date: str
    email: str
    phone: str
    occupation: str
    company: str | None = None
    years_at_job: int
    months_at_job: int
    monthly_income: float
    marital_status: str
    dependents: int

@app.post("/api/register", response_model=BasicResponse)
async def register(data: RegisterRequest):
    # Normalizamos datos
    name = data.name.strip()
    email = data.email.strip().lower()
    password = data.password.strip()
    password2 = data.password2.strip()

    # DEBUG: ver qué llega
    print("=== REGISTER ===")
    print("name   :", repr(name))
    print("email  :", repr(email))
    print("pass   :", repr(password))
    print("pass2  :", repr(password2))

    if not name or not email or not password or not password2:
        return BasicResponse(success=False, detail="Todos los campos son obligatorios.")

    if password != password2:
        return BasicResponse(success=False, detail="Las contraseñas no coinciden.")

    if email in users_db:
        return BasicResponse(success=False, detail="El correo ya está registrado.")

    # Guardamos en la "BD" en memoria
    users_db[email] = {
        "name": name,
        "password_hash": hash_password(password),
    }

    # DEBUG: mostrar cómo queda la BD
    print("users_db después de registrar:", users_db)

    return BasicResponse(
        success=True,
        detail="Usuario registrado correctamente.",
        name=name,
        email=email,
    )


@app.post("/api/login", response_model=BasicResponse)
async def login(data: LoginRequest):
    email = data.email.strip().lower()
    password = data.password.strip()

    # DEBUG: ver qué llega y qué hay en la BD
    print("=== LOGIN ===")
    print("email recibido   :", repr(email))
    print("password recibido:", repr(password))
    print("users_db actual  :", users_db)

    if not email or not password:
        return BasicResponse(
            success=False,
            detail="Correo y contraseña son obligatorios.",
        )

    user = users_db.get(email)
    if not user:
        print(">> No se encontró usuario con ese correo")
        return BasicResponse(
            success=False,
            detail="Usuario o contraseña incorrectos.",
        )

    if user["password_hash"] != hash_password(password):
        print(">> Hash distinto")
        print("hash_bd   :", user["password_hash"])
        print("hash_login:", hash_password(password))
        return BasicResponse(
            success=False,
            detail="Usuario o contraseña incorrectos.",
        )

    print(">> LOGIN OK para", email)

    # OJO: Problema en guardar users_db actual, no se estan guardando los datos al registrar


    return BasicResponse(
        success=True,
        detail="Login exitoso desde Python 😎",
        name=user["name"],
        email=email,
    )

@app.post("/api/clients", response_model=BasicResponse)
async def register_client(data: ClientRequest):
    # Normalización básica
    dni = data.dni.strip()
    email = data.email.strip().lower()
    first_name = data.first_name.strip()
    last_name_p = data.last_name_p.strip()
    last_name_m = data.last_name_m.strip()

    # Validaciones backend
    if not dni.isdigit() or len(dni) != 8:
        return BasicResponse(success=False, detail="El DNI debe tener 8 dígitos.")

    if not first_name or not last_name_p or not last_name_m:
        return BasicResponse(success=False, detail="Nombre y apellidos son obligatorios.")

    if not email:
        return BasicResponse(success=False, detail="El correo es obligatorio.")

    if dni in clients_db:
        return BasicResponse(success=False, detail="Ya existe un cliente con ese DNI.")

    if data.monthly_income <= 0:
        return BasicResponse(success=False, detail="El ingreso mensual debe ser mayor a 0.")

    if data.years_at_job < 0 or data.months_at_job < 0:
        return BasicResponse(success=False, detail="El tiempo en el trabajo no puede ser negativo.")

    # Guardar en "BD" en memoria
    clients_db[dni] = data.dict()

    print("=== CLIENTE REGISTRADO ===")
    print(clients_db[dni])

    return BasicResponse(
        success=True,
        detail="Cliente registrado correctamente.",
        name=f"{first_name} {last_name_p}",
        email=email,
    )
