#!/bin/bash

# Deployment script for iDegin Cloud Frontend on Fly.io

set -e

echo "🚀 Deploying iDegin Cloud Frontend to Fly.io"
echo "=============================================="
echo ""

# Check if fly CLI is installed
if ! command -v fly &> /dev/null; then
    echo "❌ Fly.io CLI is not installed!"
    echo "Install: curl -L https://fly.io/install.sh | sh"
    exit 1
fi

# Check if logged in
if ! fly auth whoami &> /dev/null; then
    echo "❌ Not logged in to Fly.io"
    echo "Run: fly auth login"
    exit 1
fi

# Check if app exists
if ! fly apps list | grep -q "idegin-cloud-frontend"; then
    echo "📝 Creating new Fly.io app..."
    fly apps create idegin-cloud-frontend --org personal
    
    echo ""
    echo "🔐 Setting up secrets..."
    echo "Please enter the following secrets:"
    
    read -p "NEXTAUTH_SECRET (press Enter to generate): " nextauth_secret
    if [ -z "$nextauth_secret" ]; then
        nextauth_secret=$(openssl rand -base64 32)
        echo "Generated: $nextauth_secret"
    fi
    
    read -p "NEXT_PUBLIC_API_URL: " api_url
    
    fly secrets set \
        NEXTAUTH_SECRET="$nextauth_secret" \
        NEXT_PUBLIC_API_URL="$api_url" \
        -a idegin-cloud-frontend
else
    echo "✅ App 'idegin-cloud-frontend' already exists"
fi

echo ""
echo "📦 Building and deploying..."
fly deploy -a idegin-cloud-frontend

echo ""
echo "✅ Deployment complete!"
echo "🌐 Your app is available at: https://idegin-cloud-frontend.fly.dev"
echo ""
echo "Useful commands:"
echo "  fly logs -a idegin-cloud-frontend        # View logs"
echo "  fly status -a idegin-cloud-frontend      # Check status"
echo "  fly ssh console -a idegin-cloud-frontend # SSH into machine"
