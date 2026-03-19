#!/usr/bin/env python3
"""
Sync products from Google Sheet (ENTREPECES) to public/products.json.

Usage:
    python scripts/sync_products.py

Reads the ENTREPECES sheet, auto-classifies products into categories,
and generates a JSON file that the React app consumes.
"""

import importlib.util
import json
import os
import re
import sys
import unicodedata

# ── Config ──────────────────────────────────────────────────────────────
SPREADSHEET_ID = "1VJQQYndKRoIC4Y9itm57hqGN2yspitCuBMdDHFxbn9M"
SHEET_NAME = "ENTREPECES"
DATA_RANGE = f"{SHEET_NAME}!A3:I1000"  # Cols A-I (incl TALLA, STOCK, LINK DE IMAGEN)
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "public")
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "products.json")

DEFAULT_STOCK = 10

# ── Load Google Helper ──────────────────────────────────────────────────
HELPER_PATH = os.path.expanduser(
    "~/.openclaw/workspace/skills/google-auth/scripts/google_helper.py"
)

def load_google_helper():
    spec = importlib.util.spec_from_file_location("google_helper", HELPER_PATH)
    gh = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(gh)
    return gh

# ── Category Classification ────────────────────────────────────────────
CATEGORY_KEYWORDS = {
    "Camarones": [
        "camaron", "camarones", "cherry", "amano", "neocaridina", "caridina",
        "cristal red", "crystal",
    ],
    "Plantas": [
        "anubias", "helecho", "musgo", "vallisneria", "planta ", "bucephalandra",
        "java moss", "cryptocoryne", "echinodorus", "amazonica", "sagittaria",
    ],
    "Filtros": [
        "filtro", "bomba", "esponja", "cascada", "canister", "motor",
        "cabeza de poder", "power head", "aireador",
    ],
    "Termostatos": [
        "termostato", "calentador", "termometro", "calefactor", "heater",
    ],
    "Alimentos": [
        "alimento", "hojuela", "pellet", "artemia", "comida", "spirulina",
        "tubifex", "dafnia", "bloodworm", "escama",
    ],
    "Acondicionadores": [
        "acondicionador", "anticloro", "bacteria", "azul de metileno",
        "metileno", "sal para", "prime", "stress coat", "medicamento",
        "verde malaquita",
    ],
    "Gravilla": [
        "grava", "arena", "piedra", "gravilla", "roca", "decoracion",
    ],
    "Medidores": [
        "medidor", " ph ", "test ", "tds", "reactivo",
    ],
    "Lamparas": [
        "lampara", " led ", "luz ", "iluminacion", "pantalla led",
    ],
    "Plantados": [
        " co2", "fertilizante", "tijera", "pinza", "sustrato",
        "difusor co2", "regulador co2",
    ],
    # Peces is the default / catch-all, but also has keywords for precision
    "Peces": [
        "betta", "corydora", "tetra", "goldfish", "escalar", "disco",
        "guppy", "molly", "platy", "barbo", "cucha", "pleco", "angel",
        "oscar", "arawana", "arowana", "ciclido", "neon", "ramirezi",
        "apistogramma", "killifish", "colisa", "gurami", "locha", "botia",
        "pangasio", "bailarina", "cola espada", "danio", "rasbora",
        "cory ", "pez ", "shark", "tiburon", "pareja", "labeo",
        "otocinclus", "ancistrus", "sturisoma", "pimelodus", "synodontis",
        "acara", "agujones", "anguila", "arari", "cardenal", "coridora",
        "fantasma", "gato", "hacha", "kuhli", "marmol", "mono", "payaso",
        "pirata", "priscilla", "red cherry", "rey", "rosa", "tiger",
    ],
}

# Images per category (Unsplash placeholders)
CATEGORY_IMAGES = {
    "Peces": "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&q=80&w=400",
    "Plantas": "https://images.unsplash.com/photo-1585095595205-e68428a9e205?auto=format&fit=crop&q=80&w=400",
    "Camarones": "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&q=80&w=400",
    "Plantados": "https://images.unsplash.com/photo-1585095595205-e68428a9e205?auto=format&fit=crop&q=80&w=400",
    "Termostatos": "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&q=80&w=400",
    "Filtros": "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&q=80&w=400",
    "Alimentos": "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&q=80&w=400",
    "Acondicionadores": "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&q=80&w=400",
    "Gravilla": "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&q=80&w=400",
    "Medidores": "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&q=80&w=400",
    "Lamparas": "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&q=80&w=400",
}


def normalize(text: str) -> str:
    """Remove accents and lowercase for matching."""
    nfkd = unicodedata.normalize("NFKD", text)
    return "".join(c for c in nfkd if not unicodedata.combining(c)).lower()


def classify_product(name: str) -> str:
    """Auto-classify a product name into a category."""
    name_norm = " " + normalize(name) + " "

    # Check specific categories first (before Peces catch-all)
    for category in [
        "Camarones", "Plantas", "Filtros", "Termostatos", "Alimentos",
        "Acondicionadores", "Gravilla", "Medidores", "Lamparas", "Plantados",
    ]:
        keywords = CATEGORY_KEYWORDS[category]
        for kw in keywords:
            if normalize(kw) in name_norm:
                return category

    # Check Peces keywords
    for kw in CATEGORY_KEYWORDS["Peces"]:
        if normalize(kw) in name_norm:
            return "Peces"

    # Default to Peces (most products in the sheet are fish)
    return "Peces"


def slugify(text: str) -> str:
    """Create a URL-safe slug from text."""
    text = normalize(text).strip()
    text = re.sub(r"[^a-z0-9]+", "_", text)
    text = text.strip("_")
    return text[:60]


def parse_price(raw: str) -> int | None:
    """Parse Colombian peso price string to integer.

    Handles:
        " $  35,000 " -> 35000
        "$92.781"     -> 92781
        " $  6,000 "  -> 6000
    """
    if not raw or not raw.strip():
        return None

    cleaned = raw.strip().replace("$", "").strip()

    # Skip non-numeric strings (headers like "PRECIO")
    if not any(c.isdigit() for c in cleaned):
        return None

    # Extract only numeric parts (digits, commas, dots)
    cleaned = re.sub(r"[^\d.,]", "", cleaned)
    if not cleaned:
        return None

    try:
        # Remove thousand separators (both , and .)
        if "," in cleaned and "." in cleaned:
            cleaned = cleaned.replace(",", "")
            result = float(cleaned)
        elif "," in cleaned:
            cleaned = cleaned.replace(",", "")
            result = float(cleaned)
        elif "." in cleaned:
            parts = cleaned.split(".")
            if len(parts) == 2 and len(parts[1]) == 3:
                cleaned = cleaned.replace(".", "")
                result = float(cleaned)
            else:
                result = float(cleaned)
        else:
            result = float(cleaned)
    except ValueError:
        return None

    return int(result) if result and result > 0 else None


def fetch_sheet_data(gh):
    """Fetch product data from Google Sheet."""
    sheets = gh.build_service("sheets", "v4")
    result = sheets.spreadsheets().values().get(
        spreadsheetId=SPREADSHEET_ID,
        range=DATA_RANGE,
    ).execute()
    return result.get("values", [])


# Map section headers to app categories
SECTION_TO_CATEGORY = {
    "FERTILIZANTES": "Plantados",
    "HERRAMIENTAS": "Plantados",
    "HERRAMIENTAS Y ACCESORIOS": "Plantados",
    "ROCAS, RAICES, MADERAS, MATERIALES Y HARD SCAPE": "Gravilla",
    "SUSTRATOS": "Plantados",
    "API": "Medidores",
    "TEST DE PARAMETROS": "Medidores",
    "ACONDICIONADORES Y REGULADORES DE AGUA": "Acondicionadores",
    "ACLARADORES DE AGUA PARA ACUARIOS Y ESTANQUES": "Acondicionadores",
    "TRATAMIENTO PARA ALGAS EN ACUARIOS Y ESTANQUES": "Acondicionadores",
    "BACTERIAS NITRIFICANTES": "Acondicionadores",
    "PRODUCTOS PARA MEJORAR FILTRACION": "Filtros",
    "MEDICAMENTOS PARA PECES": "Acondicionadores",
    "PRODUCTOS PARA PLANTAS": "Plantados",
    "CHIHIROS": "Lamparas",
    "LAMPARAS": "Lamparas",
    "ACCESORIOS PARA COLGAR Y BASES DE LAMPARAS": "Lamparas",
    "SOMBRAS PARA LAMPARAS": "Lamparas",
    "ACCESORIOS ELECTRONICOS": "Lamparas",
    "EQUIPOS Y ACCESORIOS DE CO2": "Plantados",
    "ACCESORIOS PARA FILTROS CANISTER": "Filtros",
    "SISTEMA DE DOSIFICACION": "Plantados",
    "FILTROS CANISTER": "Filtros",
    "FILTROS INTERNOS": "Filtros",
    "FILTROS VARIOS": "Filtros",
    "FILTROS Y ACCESORIOS PARA FILTROS": "Filtros",
    "CALENTADORES": "Termostatos",
    "UP AQUA": "Plantados",
    "SISTEMAS DE CO2": "Plantados",
    "ACONDICIONADORES DE AGUA Y BACTERIAS LIMPIADORAS": "Acondicionadores",
    "PRODUCTOS PARA GAMBAS": "Camarones",
    "MEDIDORES DE PARAMETROS": "Medidores",
    "BOMBAS SUMERGIBLES DE ALTO CAUDAL AHORRADORAS": "Filtros",
    "PRODUCTOS SEACHEM": "Acondicionadores",
}


def is_section_header(row: list) -> str | None:
    """Check if a row is a section header. Returns header text or None."""
    if not row or not row[0].strip():
        return None
    a = row[0].strip()
    # Section headers: text in col A only, mostly uppercase, no price nearby
    has_other = any(
        cell.strip() and any(c.isdigit() for c in cell)
        for cell in row[1:6] if len(row) > 1
    )
    if not has_other and len(a) < 60:
        # Check if it's uppercase or starts with uppercase word
        a_upper = normalize(a).upper()
        if a == a.upper() and len(a) > 3:
            return a
    return None


def get_section_category(header: str) -> str | None:
    """Map a section header to an app category."""
    h_norm = normalize(header).upper()
    for key, cat in SECTION_TO_CATEGORY.items():
        if normalize(key).upper() in h_norm or h_norm in normalize(key).upper():
            return cat
    return None


def clean_name(name: str, talla: str) -> str:
    """Clean up product name: remove embedded size, fix capitalization, fix typos."""
    cleaned = name.strip()

    # Remove size from name if talla is already extracted
    if talla:
        # Remove patterns like "4cm", "7 cm", "(3cm)", "2.5cm"
        cleaned = re.sub(r"\s*\(?\d+(?:[.,]\d+)?\s*cm\)?\s*", " ", cleaned)

    # Remove trailing "x 12", "x 1", "(pareja)" quantity indicators
    cleaned = re.sub(r"\s*[xX]\s*\d+\s*$", "", cleaned)
    cleaned = re.sub(r"\s*\(pareja\)\s*$", " (Pareja)", cleaned, flags=re.IGNORECASE)

    # Fix double spaces
    cleaned = re.sub(r"\s+", " ", cleaned).strip()

    # Title case for product names (capitalize first letter of each word)
    if cleaned == cleaned.lower() or cleaned == cleaned.upper():
        words = cleaned.split()
        capitalized = []
        skip_caps = {"de", "del", "la", "las", "los", "el", "en", "y", "x", "para", "con", "por"}
        for i, w in enumerate(words):
            if i == 0 or w.lower() not in skip_caps:
                capitalized.append(w.capitalize())
            else:
                capitalized.append(w.lower())
        cleaned = " ".join(capitalized)

    return cleaned


def clean_scientific_name(name: str) -> str | None:
    """Clean and format scientific name (italic style: Genus species)."""
    if not name or not name.strip():
        return None
    cleaned = name.strip()
    # Remove trailing spaces and newlines
    cleaned = re.sub(r"\s+", " ", cleaned).strip()
    # Scientific names: first word capitalized, rest lowercase
    parts = cleaned.split()
    if parts:
        parts[0] = parts[0].capitalize()
        for i in range(1, len(parts)):
            if not parts[i].startswith("("):
                parts[i] = parts[i].lower()
    return " ".join(parts) if parts else None


def extract_talla_from_name(name: str) -> str:
    """Extract size from product name if not already in TALLA column."""
    match = re.search(r"(\d+(?:[.,]\d+)?)\s*cm", name, re.IGNORECASE)
    if match:
        return match.group(1).replace(",", ".") + " cm"
    return ""


def process_rows(rows: list) -> list:
    """Process raw sheet rows into Product objects.

    The ENTREPECES sheet has TWO data layouts:
      1. Fish section (rows 3-98):  Col A=Scientific, Col C=Name, Col F=Price,
         Col G=Talla, Col H=Stock, Col I=Image URL
      2. Products section (row 99+): Col A=Name, Col D=Price
         With section headers in ALL CAPS (e.g., "FERTILIZANTES")
    """
    products = []
    seen_ids = set()
    current_section = None
    current_section_category = None

    # Load existing image map from constants.ts (fallback images)
    image_map = {}
    image_map_path = os.path.join(
        os.path.dirname(os.path.abspath(__file__)), "image_map.json"
    )
    if os.path.exists(image_map_path):
        import json as _json
        with open(image_map_path, "r", encoding="utf-8") as f:
            for item in _json.load(f):
                image_map[item["name"]] = item["image"]

    for row in rows:
        # Pad row to 9 columns (A-I)
        while len(row) < 9:
            row.append("")

        # Check for section header
        header = is_section_header(row)
        if header:
            current_section = header
            current_section_category = get_section_category(header)
            continue

        # Read all columns
        col_a = row[0].strip()
        col_c = row[2].strip()
        col_d = row[3].strip()
        col_f = row[5].strip()
        col_g = row[6].strip()  # TALLA
        col_h = row[7].strip()  # STOCK
        col_i = row[8].strip()  # LINK DE IMAGEN

        name = None
        scientific_name = None
        price_raw = None

        if col_c and col_f and any(c.isdigit() for c in col_f):
            # Layout 1: fish section
            name = col_c
            scientific_name = col_a if col_a else None
            price_raw = col_f
        elif col_a and col_d and any(c.isdigit() for c in col_d):
            # Layout 2: products section (name in A, price in D)
            name = col_a
            scientific_name = None
            price_raw = col_d

        if not name:
            continue

        # Skip header rows
        name_upper = name.upper().strip()
        if name_upper in ("NOMBRE COMUN", "NOMBRE COMUN\n", "COMMON NAME", "PRECIO"):
            continue

        price = parse_price(price_raw)
        if price is None or price <= 0:
            continue

        # Extract talla from Sheet column or from name
        talla = col_g if col_g else extract_talla_from_name(name)

        # Clean names
        cleaned_name = clean_name(name, talla)
        cleaned_scientific = clean_scientific_name(scientific_name) if scientific_name else None

        # Stock from Sheet column or default
        stock = DEFAULT_STOCK
        if col_h and col_h.isdigit():
            stock = int(col_h)

        # Generate unique ID
        base_id = slugify(cleaned_name)
        if not base_id:
            continue
        product_id = base_id
        counter = 2
        while product_id in seen_ids:
            product_id = f"{base_id}_{counter}"
            counter += 1
        seen_ids.add(product_id)

        # Classify: use section category if available, else auto-classify
        if current_section_category:
            category = current_section_category
        else:
            category = classify_product(name)  # Use original name for better matching

        # Image priority: Sheet > image_map (constants.ts) > category default
        image = col_i if col_i else None
        if not image:
            name_lower = cleaned_name.lower().strip()
            image = image_map.get(name_lower)
        if not image:
            # Try fuzzy match on image_map
            for map_name, map_img in image_map.items():
                if map_name in name_lower or name_lower in map_name:
                    image = map_img
                    break
        if not image:
            image = CATEGORY_IMAGES.get(category, CATEGORY_IMAGES["Peces"])

        # Build description
        desc_parts = [cleaned_name]
        if talla:
            desc_parts.append(f"Talla: {talla}.")
        if cleaned_scientific:
            desc_parts.append(f"{cleaned_scientific}.")
        description = " ".join(desc_parts)

        product = {
            "id": product_id,
            "name": cleaned_name,
            "scientificName": cleaned_scientific,
            "description": description,
            "price": price,
            "category": category,
            "image": image,
            "stock": stock,
            "size": talla if talla else None,
        }
        products.append(product)

    return products


def print_stats(products: list):
    """Print classification statistics."""
    cats = {}
    for p in products:
        cat = p["category"]
        cats[cat] = cats.get(cat, 0) + 1

    print(f"\nTotal productos: {len(products)}")
    print("-" * 35)
    for cat, count in sorted(cats.items(), key=lambda x: -x[1]):
        print(f"  {cat:20s} {count:4d}")
    print("-" * 35)


def main():
    print("Conectando con Google Sheets...")
    gh = load_google_helper()

    print(f"Leyendo hoja {SHEET_NAME}...")
    rows = fetch_sheet_data(gh)
    print(f"  Filas encontradas: {len(rows)}")

    print("Procesando productos...")
    products = process_rows(rows)

    print_stats(products)

    # Write output
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(products, f, ensure_ascii=False, indent=2)

    print(f"\nGuardado en: {OUTPUT_FILE}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
