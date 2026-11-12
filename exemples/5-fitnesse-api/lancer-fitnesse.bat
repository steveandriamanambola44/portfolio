@echo off
setlocal
cd /d "%~dp0"

set PORT=9090
set HSAC_VERSION=4.32.0
set RUNTIME=runtime

if not exist "%RUNTIME%\fitnesse-standalone.jar" (
  echo Premier lancement : telechargement de FitNesse + HSAC %HSAC_VERSION%...
  powershell -NoProfile -Command ^
    "$ErrorActionPreference='Stop';" ^
    "$zip=Join-Path $env:TEMP 'hsac-%HSAC_VERSION%-standalone.zip';" ^
    "if (-not (Test-Path $zip)) { Invoke-WebRequest -UseBasicParsing 'https://repo1.maven.org/maven2/nl/hsac/hsac-fitnesse-fixtures/%HSAC_VERSION%/hsac-fitnesse-fixtures-%HSAC_VERSION%-standalone.zip' -OutFile $zip };" ^
    "Expand-Archive $zip -DestinationPath '%RUNTIME%' -Force;" ^
    "Remove-Item -Recurse -Force '%RUNTIME%\webdrivers','%RUNTIME%\FitNesseRoot'"
  if errorlevel 1 (
    echo Echec du telechargement.
    exit /b 1
  )
)

rem Java n'utilise pas le proxy systeme de Windows : on le lui transmet s'il y en a un.
for /f "usebackq delims=" %%P in (`powershell -NoProfile -Command "$u=[uri]'https://restful-booker.herokuapp.com'; $p=[System.Net.WebRequest]::GetSystemWebProxy().GetProxy($u); if ($p.Host -ne $u.Host) { '-Dhttp.proxyHost={0} -Dhttp.proxyPort={1} -Dhttps.proxyHost={0} -Dhttps.proxyPort={1}' -f $p.Host, $p.Port }"`) do set JAVA_TOOL_OPTIONS=%%P
if defined JAVA_TOOL_OPTIONS echo Proxy detecte : %JAVA_TOOL_OPTIONS%

echo FitNesse demarre sur http://localhost:%PORT%/RestfulBookerApi
start "" "http://localhost:%PORT%/RestfulBookerApi"
java -Dfile.encoding=UTF-8 -cp "%RUNTIME%\fitnesse-standalone.jar;%RUNTIME%\plugins\*" fitnesseMain.FitNesseMain -p %PORT% -d . -r FitNesseRoot -e 0 -o
