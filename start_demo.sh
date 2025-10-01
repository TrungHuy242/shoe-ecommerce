#!/bin/bash

echo "🚀 Starting Shoe Store Demo..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f docker-compose.demo.yml down

# Build and start containers
echo "🔨 Building and starting containers..."
docker-compose -f docker-compose.demo.yml up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Check if backend is running
echo "🔍 Checking backend health..."
if curl -f http://localhost:8000/api/health/ > /dev/null 2>&1; then
    echo "✅ Backend is running!"
else
    echo "⚠️ Backend might still be starting..."
fi

# Check if frontend is running
echo "🔍 Checking frontend..."
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend is running!"
else
    echo "⚠️ Frontend might still be starting..."
fi

echo ""
echo "🎉 Demo is starting up!"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:8000/api/"
echo "👤 Admin Login: username=admin, password=admin123"
echo "👤 Customer Login: username=customer, password=customer123"
echo ""
echo "📝 To stop the demo, run: docker-compose -f docker-compose.demo.yml down"