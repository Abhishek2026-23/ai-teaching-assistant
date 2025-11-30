#!/usr/bin/env bash
# Render build script for installing dependencies

echo "📦 Installing Node dependencies..."
npm install

echo "🌐 Installing Chromium for Puppeteer..."
# Puppeteer will download Chromium automatically
# But we need to ensure it has the right permissions

echo "✅ Build complete!"
