#!/usr/bin/env python3
"""
Simple HTTP server to register clients in Google Sheets.
Runs on port 3001 alongside the Vite dev server.

Usage:
    python server/register.py
"""

import importlib.util
import json
import os
import sys
from datetime import datetime
from http.server import HTTPServer, BaseHTTPRequestHandler

# ── Config ──────────────────────────────────────────────────────────────
SPREADSHEET_ID = "1VJQQYndKRoIC4Y9itm57hqGN2yspitCuBMdDHFxbn9M"
SHEET_NAME = "Clientes Registrados"
PORT = 3001

# ── Load Google Helper ──────────────────────────────────────────────────
HELPER_PATH = os.path.expanduser(
    "~/.openclaw/workspace/skills/google-auth/scripts/google_helper.py"
)

def load_google_helper():
    spec = importlib.util.spec_from_file_location("google_helper", HELPER_PATH)
    gh = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(gh)
    return gh

gh = load_google_helper()
sheets_service = gh.build_service("sheets", "v4")


def register_client(name: str, email: str, phone: str, address: str) -> bool:
    """Append a new client row to the Google Sheet."""
    try:
        # Find next empty row (data starts at row 4)
        result = sheets_service.spreadsheets().values().get(
            spreadsheetId=SPREADSHEET_ID,
            range=f"'{SHEET_NAME}'!A4:A1000",
        ).execute()
        existing = result.get("values", [])
        next_row = len(existing) + 4

        # Check if email already exists
        emails_result = sheets_service.spreadsheets().values().get(
            spreadsheetId=SPREADSHEET_ID,
            range=f"'{SHEET_NAME}'!B4:B1000",
        ).execute()
        existing_emails = [
            row[0].strip().lower()
            for row in emails_result.get("values", [])
            if row and row[0].strip()
        ]
        if email.strip().lower() in existing_emails:
            return "duplicate"

        # Append the new client
        sheets_service.spreadsheets().values().update(
            spreadsheetId=SPREADSHEET_ID,
            range=f"'{SHEET_NAME}'!A{next_row}:D{next_row}",
            valueInputOption="RAW",
            body={"values": [[name, email, phone, address]]},
        ).execute()
        return "ok"
    except Exception as e:
        print(f"Error registering client: {e}")
        return "error"


ORDERS_SHEET = "Pedidos del dia"


def save_order(nombre: str, celular: str, direccion: str, fecha: str, hora: str, productos: str, total: int) -> str:
    """Append an order to the Pedidos del dia sheet."""
    try:
        result = sheets_service.spreadsheets().values().get(
            spreadsheetId=SPREADSHEET_ID,
            range=f"'{ORDERS_SHEET}'!A4:A1000",
        ).execute()
        existing = result.get("values", [])
        next_row = len(existing) + 4

        sheets_service.spreadsheets().values().update(
            spreadsheetId=SPREADSHEET_ID,
            range=f"'{ORDERS_SHEET}'!A{next_row}:G{next_row}",
            valueInputOption="RAW",
            body={"values": [[nombre, celular, direccion, fecha, hora, productos, f"${total:,.0f}"]]},
        ).execute()
        return "ok"
    except Exception as e:
        print(f"Error saving order: {e}")
        return "error"


class Handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self._cors_headers()
        self.end_headers()

    def do_POST(self):
        content_length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_length)

        if self.path == "/api/register":
            self._handle_register(body)
        elif self.path == "/api/order":
            self._handle_order(body)
        else:
            self.send_response(404)
            self.end_headers()

    def _handle_register(self, body: bytes):
        try:
            data = json.loads(body)
            name = data.get("name", "").strip()
            email = data.get("email", "").strip()
            phone = data.get("phone", "").strip()
            address = data.get("address", "").strip()

            if not name or not email or not phone:
                self._json_response(400, {"error": "Campos requeridos: nombre, correo, celular"})
                return

            result = register_client(name, email, phone, address)

            if result == "ok":
                self._json_response(200, {"success": True, "message": "Cliente registrado"})
            elif result == "duplicate":
                self._json_response(200, {"success": True, "message": "Bienvenido de nuevo", "returning": True})
            else:
                self._json_response(500, {"error": "Error al registrar"})

        except json.JSONDecodeError:
            self._json_response(400, {"error": "JSON inválido"})

    def _handle_order(self, body: bytes):
        try:
            data = json.loads(body)
            nombre = data.get("nombre", "").strip()
            celular = data.get("celular", "").strip()
            direccion = data.get("direccion", "").strip()
            fecha = data.get("fecha", "").strip()
            hora = data.get("hora", "").strip()
            productos = data.get("productos", "").strip()
            total = data.get("total", 0)

            if not all([nombre, celular, direccion, fecha, hora]):
                self._json_response(400, {"error": "Los 5 campos son obligatorios"})
                return

            result = save_order(nombre, celular, direccion, fecha, hora, productos, total)

            if result == "ok":
                self._json_response(200, {"success": True, "message": "Pedido registrado"})
            else:
                self._json_response(500, {"error": "Error al guardar pedido"})

        except json.JSONDecodeError:
            self._json_response(400, {"error": "JSON inválido"})

    def _cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

    def _json_response(self, code: int, data: dict):
        self.send_response(code)
        self._cors_headers()
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())

    def log_message(self, format, *args):
        print(f"[{datetime.now().strftime('%H:%M:%S')}] {args[0]}")


if __name__ == "__main__":
    print(f"Entre Peces API server running on http://localhost:{PORT}")
    print(f"  POST /api/register -> Google Sheets '{SHEET_NAME}'")
    print(f"  POST /api/order   -> Google Sheets '{ORDERS_SHEET}'")
    server = HTTPServer(("", PORT), Handler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
