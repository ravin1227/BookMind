# 📖 BookMind - Book Reading Screen Wireframe Prompt

## 📱 Reading Interface Design

Create a wireframe for the BookMind reading screen - the main interface when users open a book to read.

### 🎯 Screen Layout

```
┌─────────────────────────────────┐
│ ⚙️  BookMind Title      🔍 👤  │ Header
├─────────────────────────────────┤
│                                 │
│     📖 Book Content            │
│                                 │
│  Chapter 8: Business Models    │ Current section
│                                 │
│  The lean canvas provides a     │
│  structured approach to...      │
│                                 │
│                                 │
├─────────────────────────────────┤
│ ◀️ Page 127/350  💡 💬 🔖 ⭐   │ Footer with controls
└─────────────────────────────────┘
```

### 🎨 Design Elements

#### Header Section
- **App Title**: "BookMind" with settings icon (⚙️)
- **Search Icon**: (🔍) for quick search
- **Profile Icon**: (👤) for user settings
- **Clean Layout**: Minimal, distraction-free header

#### Reading Content Area
- **Chapter Title**: "Chapter 8: Business Models"
- **Book Content**: Main reading text with proper typography
- **Clean Typography**: Readable font with good line spacing
- **Full Screen**: Maximum reading space

#### Footer Controls
- **Page Navigation**: "◀️ Page 127/350" with previous/next
- **AI Tools**: 
  - 💡 AI Explain button
  - 💬 Chat with book button
- **Bookmark**: 🔖 Bookmark button (states: 🏷️ unbookmarked, 🔖 bookmarked)
- **Star**: ⭐ Favorite/rating button

### 📱 Interactive Features

#### Text Selection Flow
1. **Long Press**: Start text selection
2. **Drag**: Extend selection with handles
3. **Highlight Toolbar**: Color palette appears
4. **Apply Highlight**: Text highlighted with chosen color

#### Highlight Toolbar
```
┌─────────────────────────────────┐
│  ┌─────────────────────────────┐ │
│  │ 🟡 🔵 🟢 🔴 🟣 🟠 🟤 🩷 │ │ Color Palette
│  │ [💬] [🏷️] [✏️] [❌]      │ │ Actions
│  └─────────────────────────────┘ │
└─────────────────────────────────┘
```

#### Bookmark Button States
- **🏷️ Unbookmarked**: Gray, inactive state
- **🔖 Bookmarked**: Blue, active state

### 📱 Technical Specs
- **Platform**: React Native mobile app
- **Screen**: iPhone 14 Pro (393x852px)
- **Orientation**: Portrait
- **Theme**: Dark background with glassmorphism effects

### 🎯 Key Features
- **Distraction-free reading** with minimal UI
- **Text selection** and highlighting
- **Quick access** to AI tools
- **Bookmark creation** and management
- **Page navigation** controls
- **Reading progress** tracking

### ♿ Accessibility
- **Touch targets**: Minimum 44px for buttons
- **Text selection**: Easy long press and drag
- **Screen reader**: Proper labels and structure
- **High contrast**: Readable text and controls

### 🤖 AI Integration
- **Smart highlighting** with color meanings
- **AI explanations** for selected text
- **Chat interface** for book questions
- **Contextual suggestions** based on reading

Create a clean, focused reading interface that prioritizes the reading experience while providing intelligent AI assistance.
