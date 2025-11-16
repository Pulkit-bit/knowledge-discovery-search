import express from 'express';
import { upload } from '../middleware/upload';
import pool from '../config/database';
import { textExtractor } from '../services/textExtractor';
import { categorizer } from '../services/categorizer';
import { ApiResponse, Document } from '../types';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Upload documents
router.post('/upload', upload.array('files', 10), async (req, res) => {
  try {
    const files = req.files as Express.Multer.File[];
    
    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'NO_FILES',
          message: 'No files provided',
        },
      } as ApiResponse);
    }

    const uploadedDocuments: Document[] = [];

    for (const file of files) {
      // Extract text content
      const contentText = await textExtractor.extractText(file.path, file.mimetype);
      
      // Generate UUID for document
      const documentId = uuidv4();
      
      // Insert document into database
      const insertQuery = `
        INSERT INTO documents (id, filename, original_filename, file_path, file_size, mime_type, content_text)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      
      await pool.execute(insertQuery, [
        documentId,
        file.filename,
        file.originalname,
        file.path,
        file.size,
        file.mimetype,
        contentText,
      ]);
      
      // Get the inserted document
      const [rows]: any = await pool.execute(
        'SELECT * FROM documents WHERE id = ?',
        [documentId]
      );
      const document = rows[0];
      
      // Categorize document
      const categories = await categorizer.categorizeDocument(file.originalname, contentText);
      await categorizer.assignCategoriesToDocument(document.id, categories);
      
      uploadedDocuments.push({
        id: document.id,
        filename: document.filename,
        originalFilename: document.original_filename,
        filePath: document.file_path,
        fileSize: document.file_size,
        mimeType: document.mime_type,
        categories,
        uploadedAt: document.uploaded_at,
      });
    }

    res.json({
      success: true,
      data: { documents: uploadedDocuments },
    } as ApiResponse);
  } catch (error: any) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'UPLOAD_FAILED',
        message: 'Failed to upload documents',
        details: error.message,
      },
    } as ApiResponse);
  }
});

// Search documents
router.get('/search', async (req, res) => {
  try {
    const { q = '', categories, page = '1', pageSize = '20' } = req.query;
    
    const pageNum = parseInt(page as string);
    const pageSizeNum = parseInt(pageSize as string);
    const offset = (pageNum - 1) * pageSizeNum;
    
    // Build base query
    let query = `
      SELECT 
        d.id, 
        d.filename, 
        d.original_filename, 
        d.file_path, 
        d.file_size, 
        d.mime_type, 
        d.uploaded_at,
        d.content_text,
        GROUP_CONCAT(DISTINCT c.name) as categories
      FROM documents d
      LEFT JOIN document_categories dc ON d.id = dc.document_id
      LEFT JOIN categories c ON dc.category_id = c.id
    `;
    
    const params: any[] = [];
    const conditions: string[] = [];
    
    // Full-text search if query provided
    if (q && q.trim() !== '') {
      conditions.push(`MATCH(d.original_filename, d.content_text) AGAINST(? IN NATURAL LANGUAGE MODE)`);
      params.push(q);
    }
    
    // Category filter
    if (categories) {
      const categoryArray = Array.isArray(categories) ? categories : [categories];
      const placeholders = categoryArray.map(() => '?').join(',');
      conditions.push(`c.name IN (${placeholders})`);
      params.push(...categoryArray);
    }
    
    // Add WHERE clause if there are conditions
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }
    
    query += ` GROUP BY d.id`;
    
    // Order by date (simpler, no relevance scoring for now)
    query += ` ORDER BY d.uploaded_at DESC`;
    
    // Get total count first
    let countQuery = `
      SELECT COUNT(DISTINCT d.id) as total
      FROM documents d
      LEFT JOIN document_categories dc ON d.id = dc.document_id
      LEFT JOIN categories c ON dc.category_id = c.id
    `;
    
    if (conditions.length > 0) {
      countQuery += ` WHERE ${conditions.join(' AND ')}`;
    }
    
    const [countRows]: any = await pool.query(countQuery, params);
    const total = countRows[0].total;
    
    // Add pagination to main query
    query += ` LIMIT ? OFFSET ?`;
    const queryParams = [...params, pageSizeNum, offset];
    
    const [rows]: any = await pool.query(query, queryParams);
    
    const documents: Document[] = rows.map((row: any) => {
      const excerpt = row.content_text 
        ? row.content_text.substring(0, 200) + (row.content_text.length > 200 ? '...' : '')
        : '';
      
      return {
        id: row.id,
        filename: row.filename,
        originalFilename: row.original_filename,
        filePath: row.file_path,
        fileSize: row.file_size,
        mimeType: row.mime_type,
        categories: row.categories ? row.categories.split(',') : [],
        uploadedAt: row.uploaded_at,
        excerpt,
        relevanceScore: 1,
      };
    });
    
    res.json({
      success: true,
      data: {
        results: documents,
        total,
        page: pageNum,
        pageSize: pageSizeNum,
      },
    } as ApiResponse);
  } catch (error: any) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SEARCH_FAILED',
        message: 'Failed to search documents',
        details: error.message,
      },
    } as ApiResponse);
  }
});

// Get document by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = `
      SELECT 
        d.id, 
        d.filename, 
        d.original_filename, 
        d.file_path, 
        d.file_size, 
        d.mime_type, 
        d.uploaded_at,
        d.content_text,
        GROUP_CONCAT(DISTINCT c.name) as categories
      FROM documents d
      LEFT JOIN document_categories dc ON d.id = dc.document_id
      LEFT JOIN categories c ON dc.category_id = c.id
      WHERE d.id = ?
      GROUP BY d.id
    `;
    
    const [rows]: any = await pool.execute(query, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Document not found',
        },
      } as ApiResponse);
    }
    
    const row = rows[0];
    const document: Document = {
      id: row.id,
      filename: row.filename,
      originalFilename: row.original_filename,
      filePath: row.file_path,
      fileSize: row.file_size,
      mimeType: row.mime_type,
      categories: row.categories ? row.categories.split(',') : [],
      uploadedAt: row.uploaded_at,
      contentText: row.content_text,
    };
    
    res.json({
      success: true,
      data: document,
    } as ApiResponse);
  } catch (error: any) {
    console.error('Get document error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'FETCH_FAILED',
        message: 'Failed to fetch document',
        details: error.message,
      },
    } as ApiResponse);
  }
});

// Download document
router.get('/:id/download', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [rows]: any = await pool.execute(
      'SELECT file_path, original_filename, mime_type FROM documents WHERE id = ?',
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Document not found',
        },
      } as ApiResponse);
    }
    
    const { file_path, original_filename, mime_type } = rows[0];
    
    if (!fs.existsSync(file_path)) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'FILE_NOT_FOUND',
          message: 'File not found on disk',
        },
      } as ApiResponse);
    }
    
    res.setHeader('Content-Type', mime_type);
    res.setHeader('Content-Disposition', `attachment; filename="${original_filename}"`);
    res.sendFile(path.resolve(file_path));
  } catch (error: any) {
    console.error('Download error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'DOWNLOAD_FAILED',
        message: 'Failed to download document',
        details: error.message,
      },
    } as ApiResponse);
  }
});

// Delete document
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get file path before deleting
    const [rows]: any = await pool.execute(
      'SELECT file_path FROM documents WHERE id = ?',
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Document not found',
        },
      } as ApiResponse);
    }
    
    const { file_path } = rows[0];
    
    // Delete from database
    await pool.execute('DELETE FROM documents WHERE id = ?', [id]);
    
    // Delete file from disk
    if (fs.existsSync(file_path)) {
      fs.unlinkSync(file_path);
    }
    
    res.json({
      success: true,
      data: { message: 'Document deleted successfully' },
    } as ApiResponse);
  } catch (error: any) {
    console.error('Delete error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'DELETE_FAILED',
        message: 'Failed to delete document',
        details: error.message,
      },
    } as ApiResponse);
  }
});

export default router;
