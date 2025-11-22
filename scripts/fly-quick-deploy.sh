#!/bin/bash

# Quick deployment script for iDegin Cloud Frontend on Fly.io

set -e

echo "🚀 iDegin Cloud Frontend - Quick Deploy"
echo "========================================"
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

echo "Select an option:"
echo "1. 📦 Deploy application"
echo "2. 📊 Check status"
echo "3. 📝 View logs"
echo "4. 🔍 SSH into machine"
echo "5. 🔄 Restart application"
echo "6. 📈 View metrics"
echo "7. 🔐 Manage secrets"
echo "8. 🌐 Open in browser"
echo ""
read -p "Enter choice (1-8): " choice

case $choice in
    1)
        echo "📦 Deploying application..."
        fly deploy -a idegin-cloud-frontend
        ;;
    2)
        echo "📊 Checking status..."
        fly status -a idegin-cloud-frontend
        ;;
    3)
        echo "📝 Viewing logs..."
        fly logs -a idegin-cloud-frontend
        ;;
    4)
        echo "🔍 Opening SSH console..."
        fly ssh console -a idegin-cloud-frontend
        ;;
    5)
        echo "🔄 Restarting application..."
        fly apps restart idegin-cloud-frontend
        ;;
    6)
        echo "📈 Opening metrics dashboard..."
        fly dashboard idegin-cloud-frontend -o metrics
        ;;
    7)
        echo "🔐 Managing secrets..."
        echo ""
        echo "Current secrets:"
        fly secrets list -a idegin-cloud-frontend
        echo ""
        echo "Options:"
        echo "  1. Set new secret"
        echo "  2. Unset secret"
        read -p "Enter choice (1-2): " secret_choice
        
        if [ "$secret_choice" = "1" ]; then
            read -p "Secret name: " secret_name
            read -sp "Secret value: " secret_value
            echo ""
            fly secrets set "$secret_name=$secret_value" -a idegin-cloud-frontend
        elif [ "$secret_choice" = "2" ]; then
            read -p "Secret name to unset: " secret_name
            fly secrets unset "$secret_name" -a idegin-cloud-frontend
        fi
        ;;
    8)
        echo "🌐 Opening in browser..."
        fly open -a idegin-cloud-frontend
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "✅ Done!"
