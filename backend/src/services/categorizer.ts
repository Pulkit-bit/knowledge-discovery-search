import pool from '../config/database';

interface CategoryKeywords {
  [key: string]: string[];
}

const categoryKeywords: CategoryKeywords = {
  'Marketing': ['marketing', 'brand', 'promotion', 'advertising', 'market', 'branding'],
  'Sales': ['sales', 'revenue', 'deal', 'customer', 'prospect', 'pipeline', 'quota'],
  'Product': ['product', 'feature', 'roadmap', 'development', 'release', 'sprint'],
  'Design': ['design', 'ui', 'ux', 'mockup', 'wireframe', 'prototype', 'visual'],
  'Strategy': ['strategy', 'strategic', 'plan', 'planning', 'goal', 'objective', 'vision'],
  'Campaign': ['campaign', 'launch', 'initiative', 'program', 'event'],
  'Research': ['research', 'analysis', 'study', 'survey', 'data', 'insight', 'findings'],
  'Analytics': ['analytics', 'metrics', 'kpi', 'performance', 'report', 'dashboard', 'statistics'],
  'Content': ['content', 'blog', 'article', 'copy', 'writing', 'editorial'],
  'Social Media': ['social', 'twitter', 'facebook', 'instagram', 'linkedin', 'post', 'engagement'],
};

export class Categorizer {
  async categorizeDocument(filename: string, content: string): Promise<string[]> {
    const text = `${filename} ${content}`.toLowerCase();
    const matchedCategories: string[] = [];

    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      const hasMatch = keywords.some(keyword => text.includes(keyword));
      if (hasMatch) {
        matchedCategories.push(category);
      }
    }

    // If no categories matched, assign a default
    if (matchedCategories.length === 0) {
      matchedCategories.push('Content');
    }

    return matchedCategories;
  }

  async getCategoryIds(categoryNames: string[]): Promise<number[]> {
    if (categoryNames.length === 0) return [];
    
    const placeholders = categoryNames.map(() => '?').join(',');
    const query = `SELECT id FROM categories WHERE name IN (${placeholders})`;
    const [rows]: any = await pool.execute(query, categoryNames);
    return rows.map((row: any) => row.id);
  }

  async assignCategoriesToDocument(documentId: string, categoryNames: string[]): Promise<void> {
    const categoryIds = await this.getCategoryIds(categoryNames);
    
    if (categoryIds.length === 0) return;

    const values = categoryIds.map(catId => [documentId, catId]);
    const query = `
      INSERT IGNORE INTO document_categories (document_id, category_id)
      VALUES ?
    `;
    
    await pool.query(query, [values]);
  }

  async getAllCategories(): Promise<string[]> {
    const query = 'SELECT name FROM categories ORDER BY name';
    const [rows]: any = await pool.execute(query);
    return rows.map((row: any) => row.name);
  }
}

export const categorizer = new Categorizer();
