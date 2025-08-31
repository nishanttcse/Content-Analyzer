# Social Media Content Analyzer

A modern web application that analyzes social media content from PDF documents and images, providing engagement improvement suggestions using AI-powered analysis.

## Features

### 📄 Document Upload
- **Drag & Drop Interface**: Intuitive file upload with drag-and-drop support
- **Multiple File Types**: Support for PDF, PNG, JPG, JPEG, TIFF, and BMP files
- **File Validation**: Automatic validation of file types and sizes (10MB limit)

### 🔍 Text Extraction
- **PDF Parsing**: Extract text from PDF documents while maintaining formatting
- **OCR Technology**: Advanced Optical Character Recognition for scanned documents and images
- **Multi-format Support**: Handles various document and image formats seamlessly

### 🤖 AI-Powered Analysis
- **Engagement Scoring**: Calculates engagement potential from 0-100%
- **Sentiment Analysis**: Determines content sentiment (positive, neutral, negative)
- **Key Topics**: Identifies main topics and themes in the content
- **Actionable Suggestions**: Provides specific recommendations to improve social media engagement

### 🎨 Modern UI/UX
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Real-time Progress**: Live progress tracking for uploads and processing
- **Dark Mode Support**: Automatic theme switching for comfortable viewing
- **Interactive Elements**: Smooth animations and hover effects

## Technology Stack

- **Frontend**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS 4 with shadcn/ui components
- **File Processing**: pdf-parse for PDF extraction, Tesseract.js for OCR
- **AI Analysis**: Z-AI Web Dev SDK for content analysis
- **State Management**: React hooks with toast notifications

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd social-media-content-analyzer
```

2. Install dependencies
```bash
npm install
```

3. Run the development server
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## API Endpoints

### POST /api/upload
Upload and analyze files for social media content analysis.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: file (PDF or image)

**Response:**
```json
{
  "success": true,
  "fileName": "document.pdf",
  "fileSize": 1024000,
  "fileType": "application/pdf",
  "extractedText": "Extracted text content...",
  "analysis": {
    "engagementScore": 85,
    "sentiment": "positive",
    "suggestions": [
      "Add more engaging questions to increase comments",
      "Include relevant hashtags to improve discoverability"
    ],
    "keyTopics": ["Social Media", "Marketing", "Content Strategy"]
  },
  "textLength": 500
}
```

### GET /api/upload
Get API information and supported formats.

**Response:**
```json
{
  "message": "Social Media Content Analyzer API is running",
  "endpoints": {
    "upload": "POST /api/upload - Upload and analyze files",
    "health": "GET /api/health - Health check"
  },
  "supportedFormats": ["PDF", "PNG", "JPG", "JPEG", "TIFF", "BMP"],
  "maxFileSize": "10MB"
}
```

## Deployment

### Vercel Deployment

This application is designed for easy deployment on Vercel:

1. **Push to GitHub**
   - Make sure your code is in a GitHub repository
   - All dependencies are properly listed in package.json

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Connect your GitHub repository
   - Select the repository
   - Click "Deploy"

3. **Environment Variables** (if needed)
   - No additional environment variables are required for basic functionality
   - The Z-AI SDK is already configured in the project

### Vercel Configuration

The project includes Next.js configuration optimized for Vercel:
- Automatic static optimization
- Serverless API routes
- Edge-compatible runtime

## File Structure

```
src/
├── app/
│   ├── api/
│   │   └── upload/
│   │       └── route.ts          # File upload and analysis API
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Main application page
│   └── globals.css               # Global styles
├── components/
│   └── ui/                       # shadcn/ui components
├── hooks/
│   ├── use-toast.ts              # Toast notifications
│   └── use-mobile.ts             # Mobile detection
└── lib/
    ├── db.ts                     # Database client (unused in this version)
    ├── socket.ts                 # Socket.io configuration
    └── utils.ts                  # Utility functions
```

## Usage Examples

### Analyzing a PDF Document
1. Drag and drop a PDF file onto the upload area
2. Wait for processing to complete
3. View engagement score, sentiment, and suggestions
4. Read extracted text preview

### Analyzing an Image
1. Upload a PNG or JPG image containing text
2. OCR will automatically extract text content
3. AI analysis provides engagement insights
4. Get actionable suggestions for improvement

## Error Handling

The application includes comprehensive error handling:
- File type validation
- File size limits (10MB)
- Network error handling
- Processing error feedback
- User-friendly error messages

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please create an issue in the GitHub repository.