@echo off
echo [%date% %time%] Iniciando sync semanal de productos...
cd /d C:\Users\drami\projects\Entre-peces
python scripts\sync_products.py
echo [%date% %time%] Sync completado. Subiendo a GitHub...
git add public\products.json
git commit -m "Sync semanal: productos actualizados desde Google Sheet [%date%]"
git push origin main
echo [%date% %time%] Push a GitHub completado.
