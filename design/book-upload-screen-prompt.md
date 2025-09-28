# 📚 BookMind - Book Upload Screen Wireframe Prompt

## 📱 Book Upload Interface Design

Create a wireframe for the BookMind book upload screen - the interface for users to add new books to their library.

### 🎯 Screen Layout

```
┌─────────────────────────────────┐
│ ← Add New Book                  │ Header with back button
├─────────────────────────────────┤
│                                 │
│     📚 Upload Your Book         │ Title
│                                 │
│ ┌─────────────────────────────┐ │
│ │ 📁 Choose File              │ │ File picker button
│ │ Drag & drop or browse       │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ 📖 Book Details             │ │ Book info form
│ │                             │ │
│ │ Title: [The Lean Startup]   │ │
│ │ Author: [Eric Ries]         │ │
│ │ Genre: [Business] ▼         │ │
│ │ Language: [English] ▼        │ │
│ │                             │ │
│ │ Cover Image:                │ │
│ │ [📷 Upload Cover]           │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ ⚙️ Reading Settings         │ │ Settings section
│ │                             │ │
│ │ ○ Auto-bookmark pages       │ │
│ │ ● AI-powered insights       │ │
│ │ ○ Sync across devices       │ │
│ └─────────────────────────────┘ │
│                                 │
│ [Cancel]  [Add to Library]      │ Action buttons
└─────────────────────────────────┘
```

### 🎨 Design Elements

#### Header Section
- **Back Button**: ← arrow with "Add New Book" title
- **Clean Navigation**: Simple, focused header

#### File Upload Area
- **Drag & Drop Zone**: Large, prominent upload area
- **File Picker Button**: "📁 Choose File" with browse option
- **Supported Formats**: "PDF, EPUB, MOBI supported"
- **Visual Feedback**: Upload progress and status

#### Book Details Form
- **Title Field**: Text input for book title
- **Author Field**: Text input for author name
- **Genre Dropdown**: Predefined genre options
- **Language Dropdown**: Language selection
- **Cover Upload**: Separate cover image upload

#### Reading Settings
- **Auto-bookmark**: Toggle for automatic page bookmarks
- **AI Insights**: Toggle for AI-powered features
- **Sync Settings**: Cross-device synchronization options

#### Action Buttons
- **Cancel Button**: Secondary action
- **Add to Library**: Primary CTA button

### 📱 Interactive Features

#### File Upload States
```
┌─────────────────────────────────┐
│ 📁 Choose File                  │ Default state
│ Drag & drop or browse           │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ 📄 the-lean-startup.pdf         │ File selected
│ ✅ Ready to process             │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ 📄 the-lean-startup.pdf         │ Processing
│ ⏳ Processing... 45%             │
└─────────────────────────────────┘
```

#### Book Cover Upload
```
┌─────────────────────────────────┐
│ 📷 Upload Cover                 │ No cover
│ [Add Cover Image]               │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ [📖] Book Cover Preview         │ Cover uploaded
│ [Change Cover]                  │
└─────────────────────────────────┘
```

### 📱 Technical Specs
- **Platform**: React Native mobile app
- **Screen**: iPhone 14 Pro (393x852px)
- **Orientation**: Portrait
- **Theme**: Dark background with glassmorphism effects

### 🎯 Key Features
- **Multiple file formats** (PDF, EPUB, MOBI)
- **Drag & drop** file upload
- **Book metadata** input
- **Cover image** upload
- **Reading preferences** configuration
- **Progress tracking** for file processing

### ♿ Accessibility
- **Touch targets**: Minimum 44px for buttons
- **File upload**: Clear visual feedback
- **Form validation**: Error messages and guidance
- **Screen reader**: Proper labels and structure

### 🤖 AI Integration
- **Auto-detection** of book metadata
- **Smart genre** suggestions
- **Cover image** recognition
- **Content analysis** for AI features

### 📊 Supported Formats
- **PDF**: Standard PDF documents
- **EPUB**: E-book format
- **MOBI**: Kindle format
- **File size**: Up to 100MB
- **Languages**: Multiple language support

Create a clean, intuitive upload interface that makes adding books to the library simple and efficient.
