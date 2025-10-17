#!/bin/bash

# IndiCrafts Docker Build Script
# This script builds all Docker images for the IndiCrafts application

set -e  # Exit on any error

echo "🐳 Building IndiCrafts Docker Images..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker Desktop and try again."
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    print_warning ".env file not found. Creating from template..."
    cp env.example .env
    print_warning "Please edit .env file with your configuration before running again."
    exit 1
fi

# Build backend
print_status "Building backend image..."
cd server
if docker build -t indicrafts-backend .; then
    print_success "Backend image built successfully!"
else
    print_error "Failed to build backend image"
    exit 1
fi
cd ..

# Build frontend
print_status "Building frontend image..."
cd frontend
if docker build -t indicrafts-frontend .; then
    print_success "Frontend image built successfully!"
else
    print_error "Failed to build frontend image"
    exit 1
fi
cd ..

print_success "All Docker images built successfully!"
echo ""
echo "🚀 You can now run:"
echo "   docker-compose up -d          # For production"
echo "   docker-compose -f docker-compose.dev.yml up -d  # For development"
echo ""
echo "📊 Check status with:"
echo "   docker-compose ps"
echo ""
echo "📝 View logs with:"
echo "   docker-compose logs -f"
