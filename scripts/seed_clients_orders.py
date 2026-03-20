#!/usr/bin/env python3
"""
Read 'Clientes Registrados' and 'Pedidos del dia' from Google Sheets
and print SQL INSERT statements for Client, Order, and OrderItem tables.

Usage:
    python scripts/seed_clients_orders.py
"""

import importlib.util
import os
import re
import sys

SPREADSHEET_ID = "1VJQQYndKRoIC4Y9itm57hqGN2yspitCuBMdDHFxbn9M"

# ── Load Google Helper ──
HELPER_PATH = os.path.expanduser(
    "~/.openclaw/workspace/skills/google-auth/scripts/google_helper.py"
)

def load_google_helper():
    spec = importlib.util.spec_from_file_location("google_helper", HELPER_PATH)
    gh = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(gh)
    return gh

def escape_sql(s):
    """Escape single quotes for SQL."""
    if s is None:
        return "NULL"
    return "'" + str(s).replace("'", "''").strip() + "'"

def main():
    gh = load_google_helper()
    sheets_service = gh.build_service("sheets", "v4")

    # ── Read Clientes Registrados ──
    print("=== CLIENTES REGISTRADOS ===")
    result = sheets_service.spreadsheets().values().get(
        spreadsheetId=SPREADSHEET_ID,
        range="'Clientes Registrados'!A4:D1000",
    ).execute()
    client_rows = result.get("values", [])

    print(f"Found {len(client_rows)} client rows")
    for i, row in enumerate(client_rows):
        while len(row) < 4:
            row.append("")
        name, email, phone, address = row[0].strip(), row[1].strip(), row[2].strip(), row[3].strip()
        if not name or not email:
            continue
        print(f"  Client {i+1}: {name} | {email} | {phone} | {address}")

    # Generate SQL
    print("\n--- CLIENT SQL ---")
    for row in client_rows:
        while len(row) < 4:
            row.append("")
        name, email, phone, address = row[0].strip(), row[1].strip(), row[2].strip(), row[3].strip()
        if not name or not email:
            continue
        sql = f"""INSERT INTO "Client" ("name","email","phone","address","createdAt","updatedAt") VALUES ({escape_sql(name)},{escape_sql(email)},{escape_sql(phone)},{escape_sql(address)},NOW(),NOW()) ON CONFLICT ("email") DO NOTHING;"""
        print(sql)

    # ── Read Pedidos del dia ──
    print("\n=== PEDIDOS DEL DIA ===")
    result = sheets_service.spreadsheets().values().get(
        spreadsheetId=SPREADSHEET_ID,
        range="'Pedidos del dia'!A4:G1000",
    ).execute()
    order_rows = result.get("values", [])

    print(f"Found {len(order_rows)} order rows")
    for i, row in enumerate(order_rows):
        while len(row) < 7:
            row.append("")
        nombre, celular, direccion, fecha, hora, productos, total = [c.strip() for c in row]
        if not nombre:
            continue
        print(f"  Order {i+1}: {nombre} | {celular} | {direccion} | {fecha} | {hora} | {productos[:50]}... | {total}")

    # Generate Order SQL (we'll need client IDs, so we reference by subquery)
    print("\n--- ORDER SQL ---")
    for i, row in enumerate(order_rows):
        while len(row) < 7:
            row.append("")
        nombre, celular, direccion, fecha, hora, productos_str, total_str = [c.strip() for c in row]
        if not nombre:
            continue
        # Parse total - remove non-numeric chars
        total_clean = re.sub(r'[^\d]', '', total_str)
        total = int(total_clean) if total_clean else 0

        print(f"-- Order from {nombre}")
        print(f"""INSERT INTO "Order" ("clientId","address","date","time","total","createdAt")
SELECT c."id", {escape_sql(direccion)}, {escape_sql(fecha)}, {escape_sql(hora)}, {total}, NOW()
FROM "Client" c WHERE c."phone" = {escape_sql(celular)}
LIMIT 1;""")

        # Parse products string - format like "Producto1 x2, Producto2 x1"
        if productos_str:
            print(f"-- Items: {productos_str}")

if __name__ == "__main__":
    main()
