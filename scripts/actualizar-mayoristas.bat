@echo off
REM ===============================================================
REM Actualizar hoja Mayoristas de Listado 2025.xlsx con PDF Pedraza
REM
REM USO:
REM   1. Arrastra el PDF de Pedraza encima de este .bat, O
REM   2. Doble-click y te pedirá el path del PDF
REM
REM El Excel "Listado 2025.xlsx" se toma de C:\Users\drami\Downloads\
REM El resultado se guarda en C:\Users\drami\Downloads\Entre-peces-listados\
REM ===============================================================

setlocal

set "SCRIPT_DIR=%~dp0"
set "PROJECT_DIR=%SCRIPT_DIR%.."
set "PY_SCRIPT=%SCRIPT_DIR%actualizar_mayoristas_xlsx.py"
set "XLSX_BASE=C:\Users\drami\Downloads\Listado 2025 (1).xlsx"

REM Si se pasa un PDF como argumento (drag-and-drop), úsalo. Si no, pide uno.
if "%~1"=="" (
    set /p PDF_PATH="Arrastra o escribe la ruta completa del PDF de Pedraza: "
) else (
    set "PDF_PATH=%~1"
)

REM Limpiar comillas si vienen en el path
set "PDF_PATH=%PDF_PATH:"=%"

if not exist "%PDF_PATH%" (
    echo.
    echo ERROR: No encontre el archivo PDF: %PDF_PATH%
    echo.
    pause
    exit /b 1
)

if not exist "%XLSX_BASE%" (
    echo.
    echo ERROR: No encontre el Excel base: %XLSX_BASE%
    echo Verifica que "Listado 2025 (1).xlsx" este en tu carpeta Downloads.
    echo.
    pause
    exit /b 1
)

echo.
echo ============================================
echo  ACTUALIZAR MAYORISTAS
echo ============================================
echo  PDF:   %PDF_PATH%
echo  Excel: %XLSX_BASE%
echo ============================================
echo.

cd /d "%PROJECT_DIR%"
python "%PY_SCRIPT%" "%PDF_PATH%" "%XLSX_BASE%"

echo.
echo ============================================
echo  Archivo listo en: C:\Users\drami\Downloads\Entre-peces-listados\
echo ============================================
pause
