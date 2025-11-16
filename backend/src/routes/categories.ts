import express from 'express';
import { categorizer } from '../services/categorizer';
import { ApiResponse } from '../types';

const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await categorizer.getAllCategories();
    
    res.json({
      success: true,
      data: { categories },
    } as ApiResponse);
  } catch (error: any) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'FETCH_FAILED',
        message: 'Failed to fetch categories',
        details: error.message,
      },
    } as ApiResponse);
  }
});

export default router;
