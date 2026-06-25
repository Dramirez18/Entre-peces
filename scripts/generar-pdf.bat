@echo off
REM ===============================================================
REM Generar PDF corporativo de disponibilidad desde PDF de Pedraza
REM
REM USO:
REM   1. Arrastra el PDF de Pedraza sobre este .bat, O
REM   2. Doble-click y te pide la ruta del PDF
REM
REM Usa Listado 2025.xlsx como fuente de nombres canonicos.
REM Resultado: PDF sobrio en C:\Users\drami\Downloads\Entre-peces-listados\
REM ===============================================================

setlocal

set "SCRIPT_DIR=%~dp0"
set "PROJECT_DIR=%SCRIPT_DIR%.."
set "PY_SCRIPT=%SCRIPT_DIR%generar_pdf_semanal.py"
set "XLSX_BASE=C:\Users\drami\Downloads\Listado 2025 (1).xlsx"

if "%~1"=="" (
    set /p PDF_PATH="Arrastra o escribe la ruta completa del PDF de Pedraza: "
) else (
    set "PDF_PATH=%~1"
)

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
    echo.
    pause
    exit /b 1
)

echo.
echo ============================================
echo  GENERAR PDF DE DISPONIBILIDAD
echo ============================================
echo  PDF entrada:  %PDF_PATH%
echo  Excel fuente: %XLSX_BASE%
echo ============================================
echo.

cd /d "%PROJECT_DIR%"
python "%PY_SCRIPT%" "%PDF_PATH%" "%XLSX_BASE%"

echo.
echo ============================================
echo  PDF listo en: C:\Users\drami\Downloads\Entre-peces-listados\
echo ============================================
pause
