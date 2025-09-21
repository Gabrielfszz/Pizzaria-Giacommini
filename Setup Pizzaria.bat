@echo off
:: ============================================================================
:: PASSO 0: CONFIGURAR AMBIENTE E VARIAVEIS
:: ============================================================================
chcp 65001 > nul
setlocal
set "REPO_URL=https://github.com/Gabrielfszz/Pizzaria-Giacommini"
set "PROJECT_FOLDER=Pizzaria-Giacommini"

:: ============================================================================
:: LOGICA PRINCIPAL: VERIFICA SE O PROJETO JA ESTA INSTALADO
:: Se o arquivo final 'js\index.js' existe, executa o programa imediatamente.
:: ============================================================================
if exist "js\index.js" (
    echo Iniciando Pizzaria Giacommini...
    call node js/index.js
    goto :eof
)

:: ============================================================================
:: ROTINA DE PRIMEIRA EXECUCAO / INSTALACAO COMPLETA
:: So executa esta parte se o arquivo 'js\index.js' nao for encontrado.
:: ============================================================================

echo.
echo =====================================================
echo    SETUP INICIAL - PIZZARIA GIACOMMINI
echo =====================================================
echo Aguarde, estamos preparando tudo para o primeiro uso...
echo.

:: 1. Clonar Repositorio
if not exist "%PROJECT_FOLDER%" (
    echo Clonando o repositorio...
    git clone %REPO_URL% "%PROJECT_FOLDER%"
    if %errorlevel% neq 0 ( 
        echo ***** ERRO AO CLONAR O REPOSITORIO! *****
        pause & goto :eof 
    )
)
cd "%PROJECT_FOLDER%"

:: 2. Criar Atalho na Area de Trabalho
echo Criando atalho na Area de Trabalho...
set "SCRIPT_PATH=%~f0"
set "SHORTCUT_NAME=Pizzaria Giacommini.lnk"
set "ICON_PATH=%CD%\pizza.ico"
set "WORKING_DIR=%CD%"

powershell -ExecutionPolicy Bypass -Command "$DesktopPath = [System.Environment]::GetFolderPath('Desktop'); $ShortcutPath = Join-Path -Path $DesktopPath -ChildPath '%SHORTCUT_NAME%'; $WshShell = New-Object -com WScript.Shell; $Shortcut = $WshShell.CreateShortcut($ShortcutPath); $Shortcut.TargetPath = '%SCRIPT_PATH%'; $Shortcut.WorkingDirectory = '%WORKING_DIR%'; if (Test-Path '%ICON_PATH%') { $Shortcut.IconLocation = '%ICON_PATH%,0' }; $Shortcut.Save()"

:: 3. Instalar Dependencias do Node.js
echo Instalando dependencias do Node.js (isso pode demorar alguns minutos)...
call npm i -D typescript ts-node @types/node @types/readline-sync > nul

:: 4. Organizar Arquivos e Pastas
if not exist "ts" mkdir ts
if not exist "js" mkdir js
if exist "index.ts" ( robocopy . ts index.ts /MOV > nul )

:: 5. Compilar TypeScript
echo Compilando o codigo...
call npx tsc ts/index.ts
if %errorlevel% neq 0 ( 
    echo ***** ERRO AO COMPILAR O TYPESCRIPT! VERIFIQUE O CODIGO. *****
    pause & goto :eof 
)

:: 6. Mover JavaScript Compilado
if exist "ts\index.js" ( robocopy ts js index.js /MOV > nul )

echo.
echo =====================================================
echo    Setup concluido! Iniciando o aplicativo...
echo =====================================================
echo.

:: 7. Executar o Programa
call node js/index.js