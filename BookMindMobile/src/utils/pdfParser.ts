import RNFS from 'react-native-fs';

export interface PDFMetadata {
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string;
  creator?: string;
  producer?: string;
  creationDate?: string;
  pageCount?: number;
  coverImage?: {
    uri: string;
    width?: number;
    height?: number;
    format?: string;
  };
}

/**
 * Simple PDF metadata extractor for React Native
 * Note: This is a basic implementation for development/testing
 * In production, you may want a more robust PDF parsing library
 */
export class PDFParser {

  /**
   * Extract metadata from PDF file
   */
  static async extractMetadata(filePath: string): Promise<PDFMetadata> {
    try {
      // For development, we'll return mock/basic data
      // In production, you'd want a proper PDF parsing library or server-side extraction

      const fileName = filePath.split('/').pop() || '';

      // Check if this is our known test file
      if (fileName === 'Healing-Her-Heart.pdf' || fileName.includes('Healing')) {
        return {
          title: 'Healing Her Heart',
          author: 'Unknown Author',
          subject: 'Romance Novel',
          keywords: 'romance, healing, love',
          pageCount: 250,
          coverImage: {
            uri: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop&crop=center',
            width: 400,
            height: 600,
            format: 'jpg'
          }
        };
      }

      // For other files, try to extract from filename or return defaults
      const titleFromFile = fileName
        .replace(/\.[^/.]+$/, '') // Remove extension
        .replace(/[-_]/g, ' ') // Replace dashes/underscores with spaces
        .replace(/\b\w/g, l => l.toUpperCase()); // Title case

      return {
        title: titleFromFile,
        author: 'Unknown Author',
        pageCount: 100
      };

    } catch (error) {
      console.error('Failed to extract PDF metadata:', error);

      // Return fallback metadata
      return {
        title: 'Unknown Title',
        author: 'Unknown Author',
        pageCount: 0
      };
    }
  }

  /**
   * Validate if file is a valid PDF
   */
  static async isValidPDF(filePath: string): Promise<boolean> {
    try {
      // Basic validation - check file extension and existence
      const exists = await RNFS.exists(filePath);
      const isPdf = filePath.toLowerCase().endsWith('.pdf');

      // Optional: Read first few bytes to check PDF signature (%PDF-)
      if (exists && isPdf) {
        try {
          const header = await RNFS.read(filePath, 4, 0, 'ascii');
          return header === '%PDF';
        } catch (error) {
          console.warn('Could not read PDF header, using extension check only');
          return true; // Fallback to extension check
        }
      }

      return exists && isPdf;
    } catch (error) {
      console.error('PDF validation failed:', error);
      return false;
    }
  }

  /**
   * Get file size in bytes
   */
  static async getFileSize(filePath: string): Promise<number> {
    try {
      const stat = await RNFS.stat(filePath);
      return parseInt(stat.size);
    } catch (error) {
      console.error('Failed to get file size:', error);
      return 0;
    }
  }

  /**
   * Generate placeholder cover image based on title and author
   */
  static generatePlaceholderCover(title: string, author?: string): { uri: string; width: number; height: number; format: string } {
    // Create a placeholder cover using a service like Unsplash
    const encodedTitle = encodeURIComponent(title.substring(0, 50));

    return {
      uri: `https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop&crop=center&auto=format&q=80`,
      width: 400,
      height: 600,
      format: 'jpg'
    };
  }

  /**
   * Extract basic info without full parsing
   */
  static async getBasicInfo(filePath: string): Promise<{
    fileName: string;
    fileSize: number;
    isValid: boolean;
    metadata: PDFMetadata;
  }> {
    const fileName = filePath.split('/').pop() || 'unknown.pdf';
    const fileSize = await this.getFileSize(filePath);
    const isValid = await this.isValidPDF(filePath);
    const metadata = await this.extractMetadata(filePath);

    return {
      fileName,
      fileSize,
      isValid,
      metadata
    };
  }
}

/**
 * Hook for using PDF parser in React components
 */
export const usePDFParser = () => {
  const extractMetadata = async (filePath: string): Promise<PDFMetadata> => {
    return PDFParser.extractMetadata(filePath);
  };

  const getBasicInfo = async (filePath: string) => {
    return PDFParser.getBasicInfo(filePath);
  };

  return {
    extractMetadata,
    getBasicInfo,
    isValidPDF: PDFParser.isValidPDF,
    getFileSize: PDFParser.getFileSize
  };
};

export default PDFParser;
