# Colección de Autos Deportivos

Stack: **Django + Django REST Framework** (backend/API) · **React + Vite** (dashboard) · **MySQL** (datos).

## Qué se agregó/corrigió en esta pasada

- **Bug de migraciones**: `garage/models.py` ya definía `Propietario`, `Mantenimiento` y el campo `propietario` en `AutoDeportivo`, pero la migración `0001_initial.py` no los incluía (faltaban esas tablas/columnas en la base de datos). Se generó `garage/migrations/0002_propietario_alter_autodeportivo_table_and_more.py` para sincronizar la base de datos con los modelos. Corre `python manage.py migrate` para aplicarla.
- **`seed_data`** ahora también carga propietarios y mantenimientos de ejemplo (antes solo cargaba marcas y autos).
- **Nuevo endpoint `/api/consulta/`**: una vista de solo lectura que une las 4 tablas (marca, propietario, auto, mantenimiento) para la sección "Consulta" del dashboard, con filtros por marca, propietario, categoría y ciudad del propietario.
- **Frontend completo en `frontend/`** (no existía): dashboard con las 4 tablas (crear, editar, borrar) y una sección de consulta relacionada.

## 1. Backend (Django + MySQL)

```bash
cd backend
python -m venv venv
source venv/bin/activate        # en Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # y coloca tus datos reales de MySQL
python manage.py migrate
python manage.py seed_data       # opcional: carga datos de ejemplo
python manage.py runserver       # http://127.0.0.1:8000
```

La API queda disponible en `http://127.0.0.1:8000/api/`:

- `/api/marcas/`, `/api/propietarios/`, `/api/autos/`, `/api/mantenimientos/` — CRUD completo (GET, POST, PUT/PATCH, DELETE).
- `/api/consulta/` — vista unida de las 4 tablas (solo lectura), con filtros `?marca=`, `?propietario=`, `?categoria=`, `?propietario__ciudad__icontains=` y `?search=`.
- `/admin/` — admin de Django (crea un superusuario con `python manage.py createsuperuser` si lo necesitas).

## 2. Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev               # http://localhost:5173
```

En desarrollo, Vite hace proxy de `/api` hacia `http://127.0.0.1:8000` (ver `vite.config.js`), así que solo necesitas tener el backend corriendo en el puerto 8000. El backend ya trae CORS configurado para `localhost:5173`.

Para producción: `npm run build` genera `frontend/dist/`, que puedes servir con Django (whitenoise) o cualquier servidor estático.

## Estructura de la página

- **Dashboard**: pestañas para Marcas, Propietarios, Autos y Mantenimientos. Cada tabla permite agregar, editar y borrar registros mediante un formulario modal.
- **Consulta relacionada**: tabla de autos con su marca y propietario completos, historial de mantenimientos desplegable por auto, totales calculados (costo de mantenimiento, valor total) y filtros combinables.
