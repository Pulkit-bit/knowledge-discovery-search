import express from 'express';
import { upload } from '../middleware/upload';
import pool from '../config/database';
import { textExtractor } from '../services/textExtractor';
import { categorizer } from '../services/categorizer';
import { ApiResponse, Document } from '../types';
import path from 'path';
import fs from 'fs';

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
      
      // Insert document into database
      const insertQuery = `
        INSERT INTO documents (filename, original_filename, file_path, file_size, mime_type, content_text)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, filename, original_filename, file_path, file_size, mime_type, uploaded_at
      `;
      
      const result = await pool.query(insertQuery, [
        file.filename,
        file.originalname,
        file.path,
        file.size,
        file.mimetype,
        contentText,
      ]);
      
      const document = result.rows[0];
      
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
        COALESCE(
          array_agg(DISTINCT c.name) FILTER (WHERE c.name IS NOT NULL),
          ARRAY[]::VARCHAR[]
        ) as categories,
        ts_rank(d.search_vector, query) as rank
      FROM documents d
      LEFT JOIN document_categories dc ON d.id = dc.document_id
      LEFT JOIN categories c ON dc.category_id = c.id
    `;
    
    const params: any[] = [];
    const conditions: string[] = [];
    
    if (q) {
      params.push(q);
      query += `, plainto_tsquery('english', $${params.length}) as query`;
      conditions.push(`d.search_vector @@ plainto_tsquery('english', $${params.length})`);
    } else {
      query += `, to_tsquery('') as query`;
    }
    
    if (categories) {
      const categoryArray = Array.isArray(categories) ? categories : [categories];
      params.push(categoryArray);
      conditions.push(`c.name = ANY($${params.length})`);
    }
    
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }
    
    query += ` GROUP BY d.id, d.search_vector, query`;
    
    if (q) {
      query += ` ORDER BY rank DESC, d.uploaded_at DESC`;
    } else {
      query += ` ORDER BY d.uploaded_at DESC`;
    }
    
    // Get total count
    const countQuery = `
      SELECT COUNT(DISTINCT d.id) as total
      FROM documents d
      LEFT JOIN document_categories dc ON d.id = dc.document_id
      LEFT JOIN categories c ON dc.category_id = c.id
      ${conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''}
    `;
    
    const countResult = await pool.query(countQuery, params);
    const total = parseInt(countResult.rows[0].total);
    
    // Add pagination
    params.push(pageSizeNum, offset);
    query += ` LIMIT $${params.length - 1} OFFSET $${params.length}`;
    
    const result = await pool.query(query, params);
    
    const documents: Document[] = result.rows.map(row => {
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
        categories: row.categories || [],
        uploadedAt: row.uploaded_at,
        excerpt,
        relevanceScore: row.rank || 0,
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
        COALESCE(
          array_agg(DISTINCT c.name) FILTER (WHERE c.name IS NOT NULL),
          ARRAY[]::VARCHAR[]
        ) as categories
      FROM documents d
      LEFT JOIN document_categories dc ON d.id = dc.document_id
      LEFT JOIN categories c ON dc.category_id = c.id
      WHERE d.id = $1
      GROUP BY d.id
    `;
    
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Document not found',
        },
      } as ApiResponse);
    }
    
    const row = result.rows[0];
    const document: Document = {
      id: row.id,
      filename: row.filename,
      originalFilename: row.original_filename,
      filePath: row.file_path,
      fileSize: row.file_size,
      mimeType: row.mime_type,
      categories: row.categories || [],
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
    
    const query = 'SELECT file_path, original_filename, mime_type FROM documents WHERE id = $1';
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Document not found',
        },
      } as ApiResponse);
    }
    
    const { file_path, original_filename, mime_type } = result.rows[0];
    
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
    const query = 'SELECT file_path FROM documents WHERE id = $1';
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Document not found',
        },
      } as ApiResponse);
    }
    
    const { file_path } = result.rows[0];
    
    // Delete from database
    await pool.query('DELETE FROM documents WHERE id = $1', [id]);
    
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
