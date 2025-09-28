# 📚 BookMind - Library Management Screens Wireframe Prompt

## 📱 Library Management Interface Design

Create wireframes for the BookMind library management screens - the interfaces for browsing, searching, and managing books in the user's library.

### 🎯 Book Detail Screen

```
┌─────────────────────────────────┐
│ ← The Lean Startup      ⚙️ ❤️  │ Header with back, settings, favorite
├─────────────────────────────────┤
│                                 │
│ ┌─────────────────────────────┐ │ Book cover
│ │                             │ │
│ │        📖 Book Cover        │ │ Large cover image
│ │                             │ │
│ └─────────────────────────────┘ │
│                                 │
│ 📚 The Lean Startup             │ Book title
│ 👤 Eric Ries                    │ Author
│ 📅 Published: 2011              │ Publication date
│ 📖 Pages: 350                   │ Page count
│ 🏷️ Genre: Business              │ Genre
│                                 │
│ ┌─────────────────────────────┐ │ Reading progress
│ │ 📊 Reading Progress          │ │
│ │ ████████████░░░░░░░ 73%     │ │ Progress bar
│ │ Page 142 of 350              │ │ Current page
│ │ ⏱️ ~23 min left in chapter   │ │ Time estimate
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │ Actions
│ │ [📖 Continue Reading]        │ │ Primary action
│ │ [🔖 Bookmarks (8)]          │ │ Bookmarks count
│ │ [🎨 Highlights (47)]        │ │ Highlights count
│ │ [💬 Chat with Book]         │ │ AI chat
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │ Book info
│ │ 📝 Description              │ │
│ │ The Lean Startup is a       │ │ Book description
│ │ methodology for developing  │ │
│ │ businesses and products...   │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

### 🎯 Search Results Screen

```
┌─────────────────────────────────┐
│ 🔍 Search Results               │ Header with search
├─────────────────────────────────┤
│ ┌─────────────────────────────┐ │ Search bar
│ │ 🔍 Search books...           │ │
│ └─────────────────────────────┘ │
│                                 │
│ Filter: [All] [Genre] [Author] ▼│ Filter options
│                                 │
│ 📚 Found 12 results             │ Results count
│                                 │
│ ┌─────────────────────────────┐ │ Search result item
│ │ [📖] The Lean Startup        │ │ Book cover thumbnail
│ │      Eric Ries               │ │ Author
│ │      Business • 2011         │ │ Genre and year
│ │      ████████░░ 73%          │ │ Reading progress
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │ Search result item
│ │ [📖] Zero to One             │ │
│ │      Peter Thiel             │ │
│ │      Business • 2014         │ │
│ │      ████████████░░ 45%      │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │ Search result item
│ │ [📖] Good to Great           │ │
│ │      Jim Collins             │ │
│ │      Business • 2001         │ │
│ │      ○ Not started           │ │
│ └─────────────────────────────┘ │
│                                 │
│ [Load More Results]             │ Load more button
└─────────────────────────────────┘
```

### 🎯 Book Categories Screen

```
┌─────────────────────────────────┐
│ 📚 Browse by Category           │ Header
├─────────────────────────────────┤
│                                 │
│ 🔥 Popular Categories           │ Section header
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ │ Category grid
│ │💼   │ │🧠   │ │💡   │ │📈   │ │
│ │Bus  │ │Psy  │ │Self │ │Tech │ │
│ │ness │ │chol │ │Help │ │nolo │ │
│ └─────┘ └─────┘ └─────┘ └─────┘ │
│                                 │
│ 📖 All Categories               │ All categories section
│ ┌─────────────────────────────┐ │ Category list
│ │ 💼 Business (24 books)      │ │ Business category
│ │ 🧠 Psychology (18 books)    │ │ Psychology category
│ │ 💡 Self-Help (32 books)     │ │ Self-help category
│ │ 📈 Technology (15 books)    │ │ Technology category
│ │ 📚 Fiction (45 books)        │ │ Fiction category
│ │ 🔬 Science (12 books)        │ │ Science category
│ │ 🎨 Art & Design (8 books)   │ │ Art category
│ │ 📜 History (20 books)        │ │ History category
│ └─────────────────────────────┘ │
│                                 │
│ 🔍 Search Categories            │ Search categories
│ ┌─────────────────────────────┐ │
│ │ 🔍 Search categories...      │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

### 🎯 Category Books Screen

```
┌─────────────────────────────────┐
│ ← Business Books                │ Header with back
├─────────────────────────────────┤
│                                 │
│ 💼 Business (24 books)          │ Category header
│                                 │
│ Sort: [Recent] [Title] [Author] ▼│ Sort options
│                                 │
│ ┌─────────────────────────────┐ │ Book grid item
│ │ [📖] The Lean Startup        │ │ Book cover
│ │      Eric Ries               │ │ Author
│ │      ████████░░ 73%          │ │ Progress
│ │      ⭐ 4.8 • 2 days ago     │ │ Rating and last read
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │ Book grid item
│ │ [📖] Zero to One            │ │
│ │      Peter Thiel            │ │
│ │      ████████████░░ 45%     │ │
│ │      ⭐ 4.6 • 1 week ago    │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │ Book grid item
│ │ [📖] Good to Great           │ │
│ │      Jim Collins             │ │
│ │      ○ Not started           │ │
│ │      ⭐ 4.7 • New            │ │
│ └─────────────────────────────┘ │
│                                 │
│ [Load More Books]               │ Load more button
└─────────────────────────────────┘
```

### 🎨 Design Elements

#### Book Detail Screen
- **Book Cover**: Large, prominent cover image
- **Book Metadata**: Title, author, publication info
- **Reading Progress**: Visual progress bar and statistics
- **Action Buttons**: Continue reading, bookmarks, highlights, AI chat
- **Book Description**: Detailed book information

#### Search Results Screen
- **Search Bar**: Prominent search input
- **Filter Options**: All, Genre, Author filters
- **Results List**: Book thumbnails with metadata
- **Progress Indicators**: Reading progress for each book
- **Load More**: Pagination for large result sets

#### Book Categories Screen
- **Popular Categories**: Grid of trending categories
- **All Categories**: Complete category list
- **Book Counts**: Number of books per category
- **Category Search**: Search within categories

#### Category Books Screen
- **Category Header**: Clear category identification
- **Sort Options**: Recent, Title, Author sorting
- **Book Grid**: Thumbnail view of books
- **Rating System**: Star ratings and last read dates
- **Progress Indicators**: Reading progress for each book

### 📱 Interactive Features

#### Book Actions
```
┌─────────────────────────────────┐
│ [📖 Continue Reading]           │ Primary action
│ [🔖 Bookmarks (8)]             │ Secondary actions
│ [🎨 Highlights (47)]           │
│ [💬 Chat with Book]            │
│ [⚙️ Book Settings]             │
└─────────────────────────────────┘
```

#### Search Filters
```
┌─────────────────────────────────┐
│ Filter: [All] [Genre] [Author] ▼│
│   ○ All Books                   │ Filter options
│   ● Business                    │
│   ○ Fiction                     │
│   ○ Science                     │
└─────────────────────────────────┘
```

#### Sort Options
```
┌─────────────────────────────────┐
│ Sort: [Recent] [Title] [Author] ▼│
│   ● Recently Added              │ Sort options
│   ○ Title A-Z                   │
│   ○ Author A-Z                  │
│   ○ Reading Progress            │
└─────────────────────────────────┘
```

### 📱 Technical Specs
- **Platform**: React Native mobile app
- **Screen**: iPhone 14 Pro (393x852px)
- **Orientation**: Portrait
- **Theme**: Dark background with glassmorphism effects

### 🎯 Key Features
- **Book browsing** by categories and genres
- **Advanced search** with filters and sorting
- **Reading progress** tracking and visualization
- **Book metadata** display and management
- **Quick actions** for reading and AI features
- **Rating system** and user feedback

### ♿ Accessibility
- **Touch targets**: Minimum 44px for buttons
- **Search functionality**: Voice input support
- **Screen reader**: Proper labels and structure
- **High contrast**: Readable text and controls

### 🤖 AI Integration
- **Smart search** with AI-powered suggestions
- **Category recommendations** based on reading history
- **Reading progress** predictions and insights
- **Book recommendations** from similar titles

Create comprehensive library management interfaces that make discovering, organizing, and accessing books intuitive and enjoyable.
