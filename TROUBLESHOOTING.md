# Troubleshooting Guide

Common issues and their solutions for the Knowledge Discovery & Internal Search application.

## Installation Issues

### Issue: `npm install` fails

**Symptoms:**
```
npm ERR! code ENOENT
npm ERR! syscall open
```

**Solutions:**
1. Ensure Node.js is installed: `node --version`
2. Clear npm cache: `npm cache clean --force`
3. Delete `node_modules` and try again:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### Issue: TypeScript errors during development

**Symptoms:**
```
Cannot find module 'express'
Cannot find module 'react'
```

**Solutions:**
1. Install dependencies in both directories:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```
2. Restart your IDE/editor
3. Check that `node_modules` exists in both directories

## Database Issues

### Issue: Cannot connect to PostgreSQL

**Symptoms:**
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solutions:**
1. Check if PostgreSQL is running:
   ```bash
   # Windows
   pg_isready
   
   # Or check services
   services.msc
   ```

2. Start PostgreSQL:
   ```bash
   # Windows
   net start postgresql-x64-14
   ```

3. Verify connection string in `backend/.env`:
   ```env
   DATABASE_URL=postgresql://postgres:password@localhost:5432/knowledge_search
   ```

### Issue: Database does not exist

**Symptoms:**
```
Error: database "knowledge_search" does not exist
```

**Solutions:**
1. Create the database:
   ```bash
   psql -U postgres
   CREATE DATABASE knowledge_search;
   \q
   ```

2. Initialize the schema:
   ```bash
   psql -U postgres -d knowledge_search -f backend/database/init.sql
   ```

### Issue: Permission denied for database

**Symptoms:**
```
Error: permission denied for database
```

**Solutions:**
1. Check PostgreSQL user permissions
2. Use the correct username in DATABASE_URL
3. Grant permissions:
   ```sql
   GRANT ALL PRIVILEGES ON DATABASE knowledge_search TO postgres;
   ```

### Issue: Search not working

**Symptoms:**
- Search returns no results
- Search is very slow

**Solutions:**
1. Verify search_vector column exists:
   ```sql
   \d documents
   ```

2. Check if trigger is working:
   ```sql
   SELECT search_vector FROM documents LIMIT 1;
   ```

3. Rebuild search vectors:
   ```sql
   UPDATE documents SET content_text = content_text;
   ```

4. Verify GIN index exists:
   ```sql
   \di
   ```

## Backend Issues

### Issue: Port already in use

**Symptoms:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solutions:**
1. Change port in `backend/.env`:
   ```env
   PORT=5001
   ```

2. Or kill the process using the port:
   ```bash
   # Windows
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   ```

### Issue: File upload fails

**Symptoms:**
```
Error: ENOENT: no such file or directory
```

**Solutions:**
1. Create uploads directory:
   ```bash
   mkdir backend/uploads
   ```

2. Check permissions on uploads directory

3. Verify UPLOAD_DIR in `.env`:
   ```env
   UPLOAD_DIR=uploads
   ```

### Issue: Text extraction fails

**Symptoms:**
```
Error: Failed to extract text from PDF
```

**Solutions:**
1. Verify file is not corrupted
2. Check file size (< 50MB)
3. Try with a different PDF
4. Check pdf-parse is installed:
   ```bash
   cd backend
   npm list pdf-parse
   ```

### Issue: Categories not showing

**Symptoms:**
- No categories in filter panel
- Documents have no categories

**Solutions:**
1. Verify categories table has data:
   ```sql
   SELECT * FROM categories;
   ```

2. Re-run seed data:
   ```sql
   INSERT INTO categories (name) VALUES
     ('Marketing'), ('Sales'), ('Product'), ('Design'),
     ('Strategy'), ('Campaign'), ('Research'), ('Analytics'),
     ('Content'), ('Social Media')
   ON CONFLICT (name) DO NOTHING;
   ```

## Frontend Issues

### Issue: Frontend won't start

**Symptoms:**
```
Error: Cannot find module 'vite'
```

**Solutions:**
1. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Clear Vite cache:
   ```bash
   rm -rf node_modules/.vite
   ```

### Issue: API calls fail (CORS error)

**Symptoms:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solutions:**
1. Verify backend is running on port 5000
2. Check Vite proxy configuration in `frontend/vite.config.ts`
3. Ensure CORS is enabled in backend:
   ```typescript
   app.use(cors());
   ```

### Issue: Blank page / White screen

**Symptoms:**
- Page loads but shows nothing
- Console shows errors

**Solutions:**
1. Check browser console for errors
2. Verify API_URL is correct
3. Check if backend is running
4. Clear browser cache
5. Try in incognito mode

### Issue: Upload not working

**Symptoms:**
- Files don't upload
- Upload button does nothing

**Solutions:**
1. Check file size (< 50MB)
2. Verify file type is supported
3. Check browser console for errors
4. Verify backend upload endpoint is working:
   ```bash
   curl -X POST http://localhost:5000/api/health
   ```

### Issue: Search not updating

**Symptoms:**
- Typing in search bar doesn't trigger search
- Results don't update

**Solutions:**
1. Check browser console for errors
2. Verify debounce is working (300ms delay)
3. Check network tab for API calls
4. Verify backend search endpoint is working

## Deployment Issues

### Issue: Environment variables not working

**Symptoms:**
```
Error: DATABASE_URL is undefined
```

**Solutions:**
1. Create `.env` file in backend directory
2. Set environment variables in deployment platform
3. Verify variable names match exactly
4. Restart application after changing variables

### Issue: File uploads fail in production

**Symptoms:**
- Uploads work locally but not in production
- Permission denied errors

**Solutions:**
1. Check disk space on server
2. Verify upload directory exists and has write permissions
3. Check file size limits on hosting platform
4. Use cloud storage (S3, Google Cloud Storage) for production

### Issue: Database connection fails in production

**Symptoms:**
```
Error: Connection terminated unexpectedly
```

**Solutions:**
1. Verify DATABASE_URL is correct
2. Check if database allows external connections
3. Verify SSL settings if required
4. Check firewall rules
5. Use connection pooling

### Issue: Static files not loading

**Symptoms:**
- CSS not loading
- Images not showing
- JavaScript errors

**Solutions:**
1. Build frontend: `npm run build`
2. Check build output in `frontend/dist`
3. Verify static file serving configuration
4. Check Content-Type headers
5. Clear CDN cache if using one

## Performance Issues

### Issue: Search is slow

**Symptoms:**
- Search takes > 5 seconds
- Database queries timeout

**Solutions:**
1. Verify GIN index exists on search_vector
2. Check database query plan:
   ```sql
   EXPLAIN ANALYZE SELECT * FROM documents 
   WHERE search_vector @@ plainto_tsquery('test');
   ```
3. Add more database resources
4. Implement caching
5. Optimize search query

### Issue: Upload is slow

**Symptoms:**
- File upload takes very long
- Upload times out

**Solutions:**
1. Check network speed
2. Reduce file size
3. Implement chunked uploads
4. Use CDN for uploads
5. Compress files before upload

### Issue: High memory usage

**Symptoms:**
- Application crashes
- Out of memory errors

**Solutions:**
1. Implement pagination
2. Limit file sizes
3. Use streaming for large files
4. Increase server memory
5. Optimize database queries

## Common Error Messages

### `ECONNREFUSED`
**Meaning:** Cannot connect to database/server
**Fix:** Ensure PostgreSQL/backend is running

### `EADDRINUSE`
**Meaning:** Port is already in use
**Fix:** Change port or kill process using it

### `ENOENT`
**Meaning:** File or directory not found
**Fix:** Create missing directory or check file path

### `CORS policy`
**Meaning:** Cross-origin request blocked
**Fix:** Enable CORS in backend or use proxy

### `Cannot find module`
**Meaning:** Dependency not installed
**Fix:** Run `npm install`

### `Permission denied`
**Meaning:** Insufficient permissions
**Fix:** Check file/directory permissions

## Testing Checklist

If something isn't working, verify:

- [ ] PostgreSQL is running
- [ ] Database exists and is initialized
- [ ] Backend is running on port 5000
- [ ] Frontend is running on port 3000
- [ ] Environment variables are set
- [ ] Dependencies are installed
- [ ] No console errors
- [ ] Network requests are successful
- [ ] File permissions are correct
- [ ] Ports are not blocked by firewall

## Getting Help

If you're still stuck:

1. **Check Logs:**
   - Backend: Terminal where backend is running
   - Frontend: Browser console (F12)
   - Database: PostgreSQL logs

2. **Verify Setup:**
   - Follow QUICKSTART.md step by step
   - Ensure all prerequisites are installed
   - Check environment variables

3. **Test Components:**
   - Test database connection separately
   - Test backend API with curl/Postman
   - Test frontend in isolation

4. **Common Fixes:**
   - Restart all services
   - Clear all caches
   - Reinstall dependencies
   - Check for typos in configuration

## Debug Mode

Enable debug logging:

### Backend
Add to `backend/.env`:
```env
DEBUG=*
LOG_LEVEL=debug
```

### Frontend
Check browser console (F12) for:
- Network requests
- Console errors
- React warnings

### Database
Enable query logging in PostgreSQL:
```sql
SET log_statement = 'all';
```

## Still Having Issues?

1. Review all documentation files
2. Check that you followed setup steps exactly
3. Verify all prerequisites are installed
4. Test with sample data
5. Try on a different machine/environment

## Quick Reset

If everything is broken, start fresh:

```bash
# Stop all services
# Delete node_modules
rm -rf node_modules backend/node_modules frontend/node_modules

# Delete database
psql -U postgres
DROP DATABASE knowledge_search;
CREATE DATABASE knowledge_search;
\q

# Reinstall
npm install
cd backend && npm install
cd ../frontend && npm install

# Reinitialize database
psql -U postgres -d knowledge_search -f backend/database/init.sql

# Restart
npm run dev
```

## Prevention Tips

- Always commit working code
- Test after each change
- Keep dependencies updated
- Use version control
- Document custom changes
- Backup database regularly
- Monitor logs
- Test in production-like environment

---

**Remember:** Most issues are configuration-related. Double-check your environment variables and ensure all services are running!
