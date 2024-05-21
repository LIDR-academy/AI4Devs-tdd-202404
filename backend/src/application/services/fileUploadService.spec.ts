import multer from 'multer';

// Mock completo de multer incluyendo diskStorage
jest.mock('multer', () => {
  const mockSingle = jest.fn(() => jest.fn((req, res, next) => next()));
  const mockDiskStorage = jest.fn(() => ({
    destination: jest.fn(),
    filename: jest.fn(),
  }));

  function multer() {
    return {
      single: mockSingle,
      diskStorage: mockDiskStorage,
    };
  }

  multer.single = mockSingle;
  multer.diskStorage = mockDiskStorage;
  multer.MulterError = jest.requireActual('multer').MulterError;

  return {
    __esModule: true, // Esto ayuda a manejar los imports como default
    default: multer,
  };
});

import { uploadFile } from './fileUploadService';

describe('fileUploadService', () => {
  let mockRequest: any;
  let mockResponse: any;
  let nextFunction: jest.Mock;

  beforeEach(() => {
    mockRequest = {
      file: {
        mimetype: 'application/pdf',
        path: 'path/to/file.pdf',
      },
    };
    mockResponse = {
      status: jest.fn(() => mockResponse),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
  });

  it('should allow PDF files and return correct response', async () => {
    uploadFile(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      filePath: 'path/to/file.pdf',
      fileType: 'application/pdf',
    });
  });

  it('should reject non-PDF/DOCX files', async () => {
    mockRequest.file = null;
    uploadFile(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Invalid file type, only PDF and DOCX are allowed!',
    });
  });
});
