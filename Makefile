# IndiCrafts Docker Management Makefile
# Provides convenient commands for Docker operations

.PHONY: help build up down restart logs clean dev prod status shell backup restore

# Default target
help: ## Show this help message
	@echo "IndiCrafts Docker Management Commands:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# Development commands
dev: ## Start development environment
	docker-compose -f docker-compose.dev.yml up -d
	@echo "🚀 Development environment started!"
	@echo "Frontend: http://localhost:3000"
	@echo "Backend: http://localhost:5000"

dev-logs: ## Show development logs
	docker-compose -f docker-compose.dev.yml logs -f

dev-down: ## Stop development environment
	docker-compose -f docker-compose.dev.yml down

# Production commands
prod: ## Start production environment
	docker-compose up -d
	@echo "🚀 Production environment started!"
	@echo "Frontend: http://localhost:3000"
	@echo "Backend: http://localhost:5000"

prod-logs: ## Show production logs
	docker-compose logs -f

prod-down: ## Stop production environment
	docker-compose down

# Build commands
build: ## Build all Docker images
	docker-compose build

build-dev: ## Build development images
	docker-compose -f docker-compose.dev.yml build

build-individual: ## Build individual images (fixes package-lock issues)
	@echo "Building backend image..."
	cd server && docker build -t indicrafts-backend .
	@echo "Building frontend image..."
	cd frontend && docker build -t indicrafts-frontend .
	@echo "✅ All images built successfully!"

build-fix: ## Fix and rebuild all images
	docker system prune -f
	docker-compose build --no-cache

# Service management
up: ## Start all services
	docker-compose up -d

down: ## Stop all services
	docker-compose down

restart: ## Restart all services
	docker-compose restart

# Logs and monitoring
logs: ## Show logs for all services
	docker-compose logs -f

logs-backend: ## Show backend logs
	docker-compose logs -f backend

logs-frontend: ## Show frontend logs
	docker-compose logs -f frontend

logs-db: ## Show database logs
	docker-compose logs -f mongodb

# Status and health
status: ## Show service status
	docker-compose ps

health: ## Check service health
	@echo "Checking service health..."
	@curl -f http://localhost:5000/api/health && echo "✅ Backend healthy" || echo "❌ Backend unhealthy"
	@curl -f http://localhost:3000 && echo "✅ Frontend healthy" || echo "❌ Frontend unhealthy"

# Shell access
shell-backend: ## Access backend container shell
	docker-compose exec backend sh

shell-frontend: ## Access frontend container shell
	docker-compose exec frontend sh

shell-db: ## Access database shell
	docker-compose exec mongodb mongosh

# Database operations
backup: ## Backup database
	@echo "Creating database backup..."
	docker-compose exec mongodb mongodump --out /backup/$(shell date +%Y%m%d_%H%M%S)
	@echo "✅ Database backup created"

restore: ## Restore database (usage: make restore BACKUP_PATH=/backup/20240101_120000)
	@echo "Restoring database from $(BACKUP_PATH)..."
	docker-compose exec mongodb mongorestore $(BACKUP_PATH)
	@echo "✅ Database restored"

# Cleanup commands
clean: ## Remove containers, networks, and volumes
	docker-compose down -v
	@echo "🧹 Cleaned up containers, networks, and volumes"

clean-images: ## Remove all Docker images
	docker-compose down --rmi all
	@echo "🧹 Cleaned up Docker images"

clean-all: ## Remove everything (containers, images, volumes, networks)
	docker system prune -a -f
	@echo "🧹 Cleaned up everything"

# Setup commands
setup: ## Initial setup (copy env file and start services)
	@if [ ! -f .env ]; then \
		cp env.example .env; \
		echo "📝 Created .env file from template"; \
		echo "⚠️  Please edit .env file with your configuration"; \
	fi
	@echo "🚀 Starting services..."
	docker-compose up -d
	@echo "✅ Setup complete!"

# Update commands
update: ## Update application (pull latest and rebuild)
	git pull
	docker-compose build
	docker-compose up -d
	@echo "✅ Application updated!"

# Development helpers
dev-backend: ## Start only backend in development mode
	docker-compose -f docker-compose.dev.yml up backend

dev-frontend: ## Start only frontend in development mode
	docker-compose -f docker-compose.dev.yml up frontend

dev-db: ## Start only database services
	docker-compose up -d mongodb redis

# Production helpers
prod-backend: ## Start only backend in production mode
	docker-compose up -d backend

prod-frontend: ## Start only frontend in production mode
	docker-compose up -d frontend

# Monitoring
monitor: ## Show resource usage
	docker stats

# Security
security-scan: ## Run security scan on images
	docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
		aquasec/trivy image indicrafts-backend
	docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
		aquasec/trivy image indicrafts-frontend
