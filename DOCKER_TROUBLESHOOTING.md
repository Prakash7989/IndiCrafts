# Docker Troubleshooting Guide for IndiCrafts

This guide addresses common Docker build and runtime issues specific to the IndiCrafts project.

## 🔧 **Common Build Issues & Solutions**

### 1. Backend Build Failures

#### Issue: `npm ci` fails with package-lock.json sync errors

```
npm error `npm ci` can only install packages when your package.json and package-lock.json are in sync
```

**Solution:**

```bash
# Option 1: Use the fixed Dockerfile (already updated)
docker build -t indicrafts-backend ./server

# Option 2: Rebuild package-lock.json
cd server
rm package-lock.json
npm install
docker build -t indicrafts-backend .
```

#### Issue: Missing dependencies in production build

**Solution:** The Dockerfile now uses `npm install --omit=dev` instead of `npm ci --only=production`

### 2. Frontend Build Failures

#### Issue: `vite: not found` during build

```
sh: vite: not found
```

**Solution:** The Dockerfile now installs all dependencies (including dev dependencies) in the builder stage:

```dockerfile
# Install all dependencies (including dev dependencies for build)
RUN npm install
```

#### Issue: Build context too large

**Solution:** Ensure `.dockerignore` is properly configured to exclude unnecessary files.

### 3. Runtime Issues

#### Issue: Health check failures

**Solution:** Added health check endpoint to server.js:

```javascript
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
});
```

## 🚀 **Quick Fix Commands**

### For Windows Users:

```cmd
# Use the batch file
build-docker.bat

# Or manually:
cd server
docker build -t indicrafts-backend .
cd ..\frontend
docker build -t indicrafts-frontend .
```

### For Linux/Mac Users:

```bash
# Use the shell script
./build-docker.sh

# Or manually:
cd server && docker build -t indicrafts-backend . && cd ..
cd frontend && docker build -t indicrafts-frontend . && cd ..
```

### Using Makefile:

```bash
# Build individual images (recommended)
make build-individual

# Fix and rebuild everything
make build-fix
```

## 🔍 **Debugging Steps**

### 1. Check Docker Status

```bash
docker info
docker-compose ps
```

### 2. View Build Logs

```bash
# Build with verbose output
docker build --no-cache -t indicrafts-backend ./server
docker build --no-cache -t indicrafts-frontend ./frontend
```

### 3. Test Individual Services

```bash
# Test backend only
docker run -p 5000:5000 indicrafts-backend

# Test frontend only
docker run -p 3000:80 indicrafts-frontend
```

### 4. Check Environment Variables

```bash
# Verify .env file exists and has correct values
cat .env

# Test with environment variables
docker run -e NODE_ENV=development -p 5000:5000 indicrafts-backend
```

## 🛠️ **Advanced Troubleshooting**

### Clean Docker Environment

```bash
# Remove all containers, networks, and volumes
docker-compose down -v

# Remove all images
docker system prune -a

# Remove specific images
docker rmi indicrafts-backend indicrafts-frontend
```

### Rebuild from Scratch

```bash
# 1. Clean everything
make clean-all

# 2. Rebuild package-lock.json files
cd server && rm package-lock.json && npm install && cd ..
cd frontend && rm package-lock.json && npm install && cd ..

# 3. Build images
make build-individual

# 4. Start services
make dev
```

### Check Resource Usage

```bash
# Monitor Docker resource usage
docker stats

# Check disk usage
docker system df
```

## 📋 **Prevention Tips**

### 1. Keep package-lock.json in sync

```bash
# Always run npm install after changing package.json
npm install

# Commit package-lock.json to version control
git add package-lock.json
git commit -m "Update package-lock.json"
```

### 2. Use .dockerignore effectively

```dockerignore
node_modules
npm-debug.log
.git
.env
*.log
dist
build
coverage
```

### 3. Test builds locally first

```bash
# Test backend build
cd server && docker build -t test-backend . && cd ..

# Test frontend build
cd frontend && docker build -t test-frontend . && cd ..
```

## 🆘 **Still Having Issues?**

### 1. Check Docker Desktop

- Ensure Docker Desktop is running
- Check if virtualization is enabled
- Verify sufficient disk space (at least 2GB free)

### 2. Network Issues

```bash
# Check if ports are available
netstat -an | findstr :3000
netstat -an | findstr :5000
netstat -an | findstr :27017
```

### 3. Permission Issues (Linux/Mac)

```bash
# Fix Docker permissions
sudo usermod -aG docker $USER
# Log out and log back in
```

### 4. Windows-Specific Issues

- Ensure Windows Subsystem for Linux (WSL2) is enabled
- Check if Hyper-V is enabled
- Verify Docker Desktop settings

## 📞 **Getting Help**

If you're still experiencing issues:

1. **Check the logs:**

   ```bash
   docker-compose logs backend
   docker-compose logs frontend
   ```

2. **Verify your environment:**

   ```bash
   docker --version
   docker-compose --version
   node --version
   npm --version
   ```

3. **Create a minimal test:**

   ```bash
   # Test with minimal setup
   docker run hello-world
   ```

4. **Check system resources:**
   - Available RAM (minimum 4GB recommended)
   - Available disk space (minimum 2GB)
   - CPU usage during builds

Remember: Docker builds can take several minutes, especially on first run when downloading base images. Be patient and monitor the output for any specific error messages.
