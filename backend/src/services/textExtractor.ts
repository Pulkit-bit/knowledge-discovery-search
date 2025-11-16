import fs from 'fs/promises';
import pdf from 'pdf-parse';
import mammoth from 'mammoth';
import path from 'path';

export class TextExtractor {
  async extractText(filePath: string, mimeType: string): Promise<string> {
    try {
      switch (mimeType) {
        case 'application/pdf':
          return await this.extractFromPDF(filePath);
        
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
          return await this.extractFromDOCX(filePath);
        
        case 'text/plain':
        case 'text/markdown':
          return await this.extractFromText(filePath);
        
        default:
          return '';
      }
    } catch (error) {
      console.error(`Error extracting text from ${filePath}:`, error);
      return '';
    }
  }

  private async extractFromPDF(filePath: string): Promise<string> {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
  }

  private async extractFromDOCX(filePath: string): Promise<string> {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  }

  private async extractFromText(filePath: string): Promise<string> {
    return await fs.readFile(filePath, 'utf-8');
  }
}

export const textExtractor = new TextExtractor();
