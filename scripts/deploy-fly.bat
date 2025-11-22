@echo off
REM Deployment script for iDegin Cloud Frontend on Fly.io (Windows)

echo ================================
echo iDegin Cloud Frontend - Deploy
echo ================================
echo.

REM Check if fly CLI is installed
where fly >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: Fly.io CLI is not installed!
    echo Install from: https://fly.io/docs/hands-on/install-flyctl/
    exit /b 1
)

REM Check if logged in
fly auth whoami >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: Not logged in to Fly.io
    echo Run: fly auth login
    exit /b 1
)

REM Check if app exists
fly apps list | findstr /C:"idegin-cloud-frontend" >nul
if %ERRORLEVEL% NEQ 0 (
    echo Creating new Fly.io app...
    fly apps create idegin-cloud-frontend --org personal
    
    echo.
    echo Setting up secrets...
    echo Please enter the following secrets:
    
    set /p "nextauth_secret=NEXTAUTH_SECRET (or press Enter to use default): "
    if "%nextauth_secret%"=="" set "nextauth_secret=CHANGE_THIS_SECRET_IN_PRODUCTION"
    
    set /p "api_url=NEXT_PUBLIC_API_URL: "
    
    fly secrets set NEXTAUTH_SECRET="%nextauth_secret%" NEXT_PUBLIC_API_URL="%api_url%" -a idegin-cloud-frontend
) else (
    echo App 'idegin-cloud-frontend' already exists
)

echo.
echo Building and deploying...
fly deploy -a idegin-cloud-frontend

echo.
echo Deployment complete!
echo Your app is available at: https://idegin-cloud-frontend.fly.dev
echo.
echo Useful commands:
echo   fly logs -a idegin-cloud-frontend        - View logs
echo   fly status -a idegin-cloud-frontend      - Check status
echo   fly ssh console -a idegin-cloud-frontend - SSH into machine
