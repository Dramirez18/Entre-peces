@echo off
REM ===============================================================
REM Generar PDF corporativo de disponibilidad desde PDF de Pedraza
REM
REM USO:
REM   1. Arrastra el PDF de Pedraza sobre este .bat, O
REM   2. Doble-click y te pide la ruta del PDF
REM
REM Solo genera el PDF. No crea ni necesita ningun Excel: si hay un
REM Listado*.xlsx a mano lo usa para los nombres canonicos, y si no,
REM usa los nombres tal cual vienen del PDF de Pedraza.
REM Resultado: PDF sobrio en C:\Users\drami\Downloads\Entre-peces-listados\
REM ===============================================================

setlocal

set "SCRIPT_DIR=%~dp0"
set "PROJECT_DIR=%SCRIPT_DIR%.."
set "PY_SCRIPT=%SCRIPT_DIR%generar_pdf_semanal.py"

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

echo.
echo ============================================
echo  GENERAR PDF DE DISPONIBILIDAD
echo ============================================
echo  PDF entrada: %PDF_PATH%
echo ============================================
echo.

cd /d "%PROJECT_DIR%"
python "%PY_SCRIPT%" "%PDF_PATH%"

echo.
echo ============================================
echo  PDF listo en: C:\Users\drami\Downloads\Entre-peces-listados\
echo ============================================
pause
