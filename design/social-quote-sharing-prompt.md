# 📱 BookMind - Social Quote Sharing Feature Wireframe Prompt

## 📱 Social Quote Sharing Interface Design

Create wireframes for the BookMind social quote sharing feature - the interface for creating and sharing beautiful quote cards from highlighted text.

### 🎯 Quote Sharing Flow

#### Step 1: Highlight Selection
```
┌─────────────────────────────────┐
│ ⚙️  BookMind Title      🔍 👤  │ Header
├─────────────────────────────────┤
│                                 │
│     📖 Book Content            │
│                                 │
│  Chapter 8: Business Models    │
│                                 │
│  The lean canvas provides a     │
│  [███████████████████████████] │ Selected text
│  structured approach to...      │
│                                 │
│  ┌─────────────────────────────┐ │ Share toolbar
│  │ [💬] [🏷️] [📱] [❌]        │ │ Share button
│  └─────────────────────────────┘ │
└─────────────────────────────────┘
```

#### Step 2: Quote Card Creation
```
┌─────────────────────────────────┐
│ ← Create Quote Card             │ Header with back
├─────────────────────────────────┤
│                                 │
│ ┌─────────────────────────────┐ │ Preview card
│ │ "The lean canvas provides   │ │
│ │  a structured approach to   │ │
│ │  business model validation" │ │
│ │                             │ │
│ │ — Eric Ries                 │ │
│ │   The Lean Startup          │ │
│ └─────────────────────────────┘ │
│                                 │
│ 🎨 Template Styles              │ Template section
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ │
│ │Min  │ │Corp │ │Art  │ │Mot  │ │ Template options
│ └─────┘ └─────┘ └─────┘ └─────┘ │
│                                 │
│ 🎨 Customize                    │ Customization
│ Background: [Dark] ▼           │ Background options
│ Text Color: [White] ▼          │ Text color options
│ Font: [Georgia] ▼              │ Font options
│                                 │
│ [Preview] [Share]               │ Action buttons
└─────────────────────────────────┘
```

#### Step 3: Platform Selection
```
┌─────────────────────────────────┐
│ Share Quote Card                │ Header
├─────────────────────────────────┤
│                                 │
│ ┌─────────────────────────────┐ │ Final preview
│ │ "The lean canvas provides   │ │
│ │  a structured approach to   │ │
│ │  business model validation" │ │
│ │                             │ │
│ │ — Eric Ries                 │ │
│ │   The Lean Startup          │ │
│ └─────────────────────────────┘ │
│                                 │
│ 📱 Share to Platform            │ Platform selection
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ │
│ │🐦   │ │📷   │ │💼   │ │📘   │ │ Social platforms
│ │Twit │ │Insta│ │Link │ │Face │ │
│ └─────┘ └─────┘ └─────┘ └─────┘ │
│                                 │
│ 📝 Add Caption (optional)       │ Caption input
│ ┌─────────────────────────────┐ │
│ │ Check out this great quote   │ │
│ │ from The Lean Startup!       │ │
│ └─────────────────────────────┘ │
│                                 │
│ [Cancel] [Share Now]            │ Action buttons
└─────────────────────────────────┘
```

### 🎨 Template Categories

#### Professional Templates
```
┌─────────────────────────────────┐
│ 🎨 Professional Templates       │ Category header
│                                 │
│ ┌─────────────────────────────┐ │ Executive Minimal
│ │ "The lean canvas provides   │ │ Dark gradient background
│ │  a structured approach to   │ │ White text, serif font
│ │  business model validation" │ │ Clean, corporate look
│ │                             │ │
│ │ — Eric Ries                 │ │
│ │   The Lean Startup          │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │ Corporate Clean
│ │ "The lean canvas provides   │ │ White background
│ │  a structured approach to   │ │ Blue accent border
│ │  business model validation" │ │ Clean sans-serif
│ │                             │ │
│ │ — Eric Ries                 │ │
│ │   The Lean Startup          │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

#### Creative Templates
```
┌─────────────────────────────────┐
│ 🎨 Creative Templates           │ Category header
│                                 │
│ ┌─────────────────────────────┐ │ Watercolor Dreams
│ │ "The lean canvas provides   │ │ Artistic background
│ │  a structured approach to   │ │ Elegant serif font
│ │  business model validation" │ │ Decorative border
│ │                             │ │
│ │ — Eric Ries                 │ │
│ │   The Lean Startup          │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │ Geometric Modern
│ │ "The lean canvas provides   │ │ Gradient background
│ │  a structured approach to   │ │ Modern sans-serif
│ │  business model validation" │ │ Geometric shapes
│ │                             │ │
│ │ — Eric Ries                 │ │
│ │   The Lean Startup          │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

### 📱 Technical Specs
- **Platform**: React Native mobile app
- **Screen**: iPhone 14 Pro (393x852px)
- **Orientation**: Portrait
- **Theme**: Dark background with glassmorphism effects

### 🎯 Key Features
- **Text selection** from reading interface
- **Template gallery** with multiple styles
- **Customization options** (background, colors, fonts)
- **Platform-specific** sharing (Twitter, Instagram, LinkedIn, Facebook)
- **Caption addition** for social posts
- **Preview functionality** before sharing

### ♿ Accessibility
- **Touch targets**: Minimum 44px for buttons
- **High contrast**: Readable text on all backgrounds
- **Screen reader**: Proper labels and structure
- **Color blind**: Alternative visual indicators

### 🤖 AI Integration
- **Smart template** suggestions based on quote content
- **Auto-caption** generation for social posts
- **Color extraction** from book covers
- **Trending templates** based on platform analytics

### 📊 Analytics Features
- **Share tracking** across platforms
- **Template performance** metrics
- **Viral score** calculation
- **User engagement** statistics

### 🎨 Design Elements
- **Template previews** with live updates
- **Customization sliders** for colors and fonts
- **Platform icons** for easy recognition
- **Progress indicators** for sharing process

Create an intuitive quote sharing interface that makes users excited to share their reading insights while promoting BookMind through beautiful, branded content.
