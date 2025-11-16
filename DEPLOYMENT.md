# Deployment Guide

This guide will help you deploy the Knowledge Discovery & Search application to production.

## Quick Deployment Options

### Option 1: Deploy to Render (Recommended for Hackathon)

Render provides free hosting for both frontend and backend with PostgreSQL database.

#### Backend Deployment

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     ```
     DATABASE_URL=<your-postgres-connection-string>
     PORT=5000
     UPLOAD_DIR=uploads
     MAX_FILE_SIZE=52428800
     NODE_ENV=production
     ```

4. Create a PostgreSQL database on Render
5. Copy the internal database URL to `DATABASE_URL`
6. Run the initialization script:
   ```bash
   psql <DATABASE_URL> -f backend/database/init.sql
   ```

#### Frontend Deployment

1. Create a new Static Site on Render
2. Configure:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Environment Variables**:
     ```
     VITE_API_URL=<your-backend-url>/api
     ```

### Option 2: Deploy to Vercel + Railway

#### Backend on Railway

1. Create new project on Railway
2. Add PostgreSQL database
3. Deploy from GitHub
4. Set root directory to `backend`
5. Add environment variables
6. Run database initialization

#### Frontend on Vercel

1. Import project from GitHub
2. Set root directory to `frontend`
3. Add environment variable: `VITE_API_URL`
4. Deploy

### Option 3: Deploy to Heroku

#### Backend

```bash
cd backend
heroku create your-app-name
heroku addons:create heroku-postgresql:mini
heroku config:set NODE_ENV=production
git push heroku main
heroku run psql $DATABASE_URL -f database/init.sql
```

#### Frontend

Deploy to Vercel or Netlify as static site.

## Environment Configuration

### Backend Environment Variables

```env
# Server
PORT=5000
NODE_ENV=production

# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname

# File Upload
UPLOAD_DIR=uploads
MAX_FILE_SIZE=52428800

# CORS (if frontend on different domain)
CORS_ORIGIN=https://your-frontend-domain.com
```

### Frontend Environment Variables

```env
VITE_API_URL=https://your-backend-domain.com/api
```

## Database Setup

After deploying, initialize the database:

```bash
# Using psql
psql $DATABASE_URL -f backend/database/init.sql

# Or connect and run manually
psql $DATABASE_URL
\i backend/database/init.sql
```

## Post-Deployment Checklist

- [ ] Database initialized with schema and seed data
- [ ] Backend health check working: `GET /api/health`
- [ ] Frontend can connect to backend API
- [ ] File uploads working (check disk space and permissions)
- [ ] Search functionality working
- [ ] CORS configured correctly
- [ ] SSL/HTTPS enabled
- [ ] Environment variables set correctly

## Performance Optimization

### Backend

1. Enable gzip compression
2. Add rate limiting
3. Implement caching for categories
4. Use connection pooling for database

### Frontend

1. Enable code splitting
2. Optimize images
3. Use CDN for static assets
4. Enable browser caching

## Monitoring

### Health Checks

- Backend: `GET /api/health`
- Database: Check connection pool status
- File Storage: Monitor disk usage

### Logging

Add logging service:
- Papertrail
- Loggly
- CloudWatch (AWS)

## Backup Strategy

### Database Backups

```bash
# Manual backup
pg_dump $DATABASE_URL > backup.sql

# Restore
psql $DATABASE_URL < backup.sql
```

### File Backups

- Use cloud storage (S3, Google Cloud Storage)
- Set up automated backups
- Test restore procedures

## Scaling Considerations

### Horizontal Scaling

- Use load balancer for multiple backend instances
- Shared file storage (S3, Google Cloud Storage)
- Database read replicas

### Vertical Scaling

- Increase server resources
- Optimize database queries
- Add database indexes

## Security Checklist

- [ ] Use HTTPS everywhere
- [ ] Validate file uploads (type, size)
- [ ] Sanitize user inputs
- [ ] Use environment variables for secrets
- [ ] Enable CORS only for trusted domains
- [ ] Implement rate limiting
- [ ] Regular security updates
- [ ] Database connection encryption

## Troubleshooting

### Common Issues

**Database Connection Failed**
- Check DATABASE_URL is correct
- Verify database is running
- Check firewall rules

**File Upload Failed**
- Verify UPLOAD_DIR exists
- Check disk space
- Verify write permissions

**CORS Errors**
- Add frontend domain to CORS whitelist
- Check CORS_ORIGIN environment variable

**Search Not Working**
- Verify database initialization completed
- Check search_vector column exists
- Test with simple queries first

## Demo Video Recording Tips

1. **Prepare Sample Data**: Upload diverse documents before recording
2. **Show Key Features**:
   - Upload multiple files
   - Search with different queries
   - Filter by categories
   - Preview documents
   - Download files
3. **Highlight Innovation**:
   - Automatic categorization
   - Fast full-text search
   - Clean, intuitive UI
4. **Discuss Technical Decisions**:
   - PostgreSQL full-text search
   - React + TypeScript
   - Automatic text extraction
   - Responsive design

## Support

For issues or questions, check:
- README.md for setup instructions
- GitHub Issues for known problems
- Application logs for error details
