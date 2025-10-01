#!/bin/bash

echo "🚀 Starting Shoe Store Locally..."

# Function to check if port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "⚠️ Port $1 is already in use"
        return 1
    else
        return 0
    fi
}

# Check ports
if ! check_port 8000; then
    echo "Please stop the service running on port 8000 first"
    exit 1
fi

if ! check_port 3000; then
    echo "Please stop the service running on port 3000 first"
    exit 1
fi

# Start Backend
echo "🔧 Starting Backend..."
cd shoe_store

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "📦 Installing Python dependencies..."
pip install -r ../requirements.txt

# Set Django settings for demo
export DJANGO_SETTINGS_MODULE=shoe_store.settings_demo

# Run migrations
echo "🗄️ Running database migrations..."
python manage.py migrate

# Setup demo data
echo "📊 Setting up demo data..."
python setup_demo_data.py

# Collect static files
echo "📁 Collecting static files..."
python manage.py collectstatic --noinput

# Start Django server in background
echo "🚀 Starting Django server..."
python manage.py runserver 0.0.0.0:8000 &
BACKEND_PID=$!

cd ..

# Start Frontend
echo "🎨 Starting Frontend..."
cd frontend

# Install dependencies
echo "📦 Installing Node.js dependencies..."
npm install

# Start React server in background
echo "🚀 Starting React server..."
npm start &
FRONTEND_PID=$!

cd ..

# Wait a bit for servers to start
sleep 5

echo ""
echo "🎉 Demo is running!"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:8000/api/"
echo "👤 Admin Login: username=admin, password=admin123"
echo "👤 Customer Login: username=customer, password=customer123"
echo ""
echo "📝 To stop the demo, press Ctrl+C"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Demo stopped"
    exit 0
}

# Trap Ctrl+C
trap cleanup SIGINT

# Wait for user to stop
wait