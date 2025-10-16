# Docker Setup for IndiCrafts

This document provides comprehensive instructions for setting up and running the IndiCrafts application using Docker.

## 🏗️ Architecture Overview

The IndiCrafts application consists of:

- **Frontend**: React/Vite application with TypeScript
- **Backend**: Node.js/Express API server
- **Database**: MongoDB for data persistence
- **Cache**: Redis for session management and caching
- **Reverse Proxy**: Nginx for serving the frontend

## 📋 Prerequisites

- Docker Desktop installed and running
- Docker Compose v2.0+
- Git (for cloning the repository)

## 🚀 Quick Start

### 1. Clone and Setup Environment

```bash
# Clone the repository
git clone <your-repo-url>
cd IndiCrafts

# Copy environment variables
cp env.example .env

# Edit .env file with your configuration
nano .env
```

### 2. Production Deployment

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 3. Development Setup

```bash
# Start development environment with hot reload
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop development services
docker-compose -f docker-compose.dev.yml down
```

## 🔧 Configuration

### Environment Variables

Edit the `.env` file with your actual values:

```bash
# Database
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=your_secure_password
MONGO_DATABASE=indicrafts

# JWT
JWT_SECRET=your_super_secret_jwt_key

# Email (for notifications)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Default Admin Credentials

After first startup, you can login with:

- **Email**: admin@indicrafts.com
- **Password**: admin123

⚠️ **Important**: Change the default admin password in production!

## 📊 Services Overview

| Service  | Port  | Description        |
| -------- | ----- | ------------------ |
| Frontend | 3000  | React application  |
| Backend  | 5000  | Express API server |
| MongoDB  | 27017 | Database           |
| Redis    | 6379  | Cache and sessions |

## 🛠️ Development Commands

### Individual Service Management

```bash
# Start only the database
docker-compose up -d mongodb redis

# Start backend in development mode
docker-compose -f docker-compose.dev.yml up backend

# Start frontend in development mode
docker-compose -f docker-compose.dev.yml up frontend

# Rebuild a specific service
docker-compose build backend
docker-compose up -d backend
```

### Database Management

```bash
# Access MongoDB shell
docker-compose exec mongodb mongosh

# Backup database
docker-compose exec mongodb mongodump --out /backup

# Restore database
docker-compose exec mongodb mongorestore /backup
```

### Logs and Debugging

```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mongodb

# Follow logs in real-time
docker-compose logs -f backend
```

## 🔍 Health Checks

The application includes health checks for all services:

```bash
# Check service health
docker-compose ps

# Test backend health
curl http://localhost:5000/api/health

# Test frontend
curl http://localhost:3000
```

## 🚀 Production Deployment

### 1. Environment Setup

```bash
# Set production environment
export NODE_ENV=production

# Update .env with production values
nano .env
```

### 2. Build and Deploy

```bash
# Build production images
docker-compose build

# Start production services
docker-compose up -d

# Verify deployment
docker-compose ps
```

### 3. SSL/HTTPS Setup

For production, configure SSL certificates:

```bash
# Add SSL certificates to nginx
# Update nginx.conf with SSL configuration
# Restart nginx container
docker-compose restart frontend
```

## 🔧 Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 3000, 5000, 27017, 6379 are available
2. **Permission issues**: Check Docker daemon is running
3. **Database connection**: Verify MongoDB credentials in .env
4. **Build failures**: Clear Docker cache: `docker system prune -a`

### Debug Commands

```bash
# Check container status
docker-compose ps

# Inspect container logs
docker-compose logs [service-name]

# Access container shell
docker-compose exec [service-name] sh

# Check resource usage
docker stats
```

### Reset Everything

```bash
# Stop and remove all containers, networks, and volumes
docker-compose down -v

# Remove all images
docker-compose down --rmi all

# Clean up everything
docker system prune -a
```

## 📈 Monitoring and Maintenance

### Log Management

```bash
# Configure log rotation
# Add to docker-compose.yml:
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"
```

### Backup Strategy

```bash
# Database backup script
#!/bin/bash
docker-compose exec mongodb mongodump --out /backup/$(date +%Y%m%d_%H%M%S)
```

### Updates

```bash
# Update application
git pull
docker-compose build
docker-compose up -d

# Update database schema (if needed)
docker-compose exec backend npm run migrate
```

## 🔒 Security Considerations

1. **Change default passwords** in production
2. **Use strong JWT secrets** (32+ characters)
3. **Enable MongoDB authentication**
4. **Configure firewall rules** for production
5. **Use HTTPS** in production
6. **Regular security updates** for base images

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/)
- [MongoDB Docker Image](https://hub.docker.com/_/mongo)
- [Node.js Docker Best Practices](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)

## 🆘 Support

If you encounter issues:

1. Check the logs: `docker-compose logs`
2. Verify environment variables in `.env`
3. Ensure all required ports are available
4. Check Docker daemon is running
5. Review the troubleshooting section above

For additional help, please refer to the main project documentation or create an issue in the repository.
