# 🎨 BookMind - UI/UX Design Guidelines & Wireframes

## 🎯 Design Philosophy

BookMind's design prioritizes **readability, intelligence, and simplicity**. Every interface element should either enhance the reading experience or provide clear value through AI-powered insights.

**Core Principles**:
1. **Reading First**: The reading experience is sacred - minimize distractions
2. **Intelligent Context**: AI features should feel natural and contextual, not forced
3. **Cross-Platform Consistency**: Unified experience across mobile, tablet, and web
4. **Accessibility**: Inclusive design for all users and reading abilities

## 🎨 Visual Design System

### Color Palette

#### Primary Colors
```css
/* BookMind Brand */
--bookmind-primary: #6366F1;      /* Indigo - Intelligence & Trust */
--bookmind-primary-dark: #4F46E5; /* Darker indigo for dark mode */
--bookmind-secondary: #F59E0B;    /* Amber - Warmth & Learning */

/* Semantic Colors */
--success: #10B981;    /* Green - Completion & Success */
--warning: #F59E0B;    /* Amber - Attention & Caution */
--error: #EF4444;      /* Red - Errors & Destructive Actions */
--info: #3B82F6;       /* Blue - Information & Links */
```

#### Reading Themes
```css
/* Light Theme */
--bg-primary: #FFFFFF;
--bg-secondary: #F8FAFC;
--text-primary: #1F2937;
--text-secondary: #6B7280;

/* Dark Theme */
--bg-primary: #111827;
--bg-secondary: #1F2937;
--text-primary: #F9FAFB;
--text-secondary: #D1D5DB;

/* Sepia Theme */
--bg-primary: #F7F3E7;
--bg-secondary: #F0E9D3;
--text-primary: #5D4E37;
--text-secondary: #8B7355;
```

#### AI Feature Colors
```css
/* AI Interaction Colors */
--ai-primary: #8B5CF6;     /* Purple - AI Intelligence */
--ai-background: #F3F4F6;  /* Light gray - AI responses */
--ai-border: #E5E7EB;      /* Subtle border for AI elements */

/* Highlight Colors */
--highlight-yellow: #FEF3C7;
--highlight-blue: #DBEAFE;
--highlight-green: #D1FAE5;
--highlight-pink: #FCE7F3;
--highlight-purple: #EDE9FE;
```

### Typography

#### Font Stack
```css
/* Reading Fonts */
--font-reading-serif: 'Georgia', 'Times New Roman', serif;
--font-reading-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-reading-mono: 'SF Mono', 'Monaco', 'Cascadia Code', monospace;

/* UI Fonts */
--font-ui: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-heading: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
```

#### Type Scale
```css
/* Reading Text */
--text-xs: 12px;   /* 0.75rem */
--text-sm: 14px;   /* 0.875rem */
--text-base: 16px; /* 1rem - Default reading size */
--text-lg: 18px;   /* 1.125rem */
--text-xl: 20px;   /* 1.25rem */
--text-2xl: 24px;  /* 1.5rem */

/* UI Text */
--heading-sm: 16px;  /* 1rem */
--heading-md: 20px;  /* 1.25rem */
--heading-lg: 24px;  /* 1.5rem */
--heading-xl: 30px;  /* 1.875rem */
```

#### Line Height & Spacing
```css
--leading-tight: 1.25;   /* Dense text */
--leading-normal: 1.5;   /* Default reading */
--leading-relaxed: 1.75; /* Comfortable reading */
--leading-loose: 2.0;    /* Accessible reading */
```

### Spacing System
```css
/* Consistent spacing scale */
--space-1: 4px;   /* 0.25rem */
--space-2: 8px;   /* 0.5rem */
--space-3: 12px;  /* 0.75rem */
--space-4: 16px;  /* 1rem */
--space-6: 24px;  /* 1.5rem */
--space-8: 32px;  /* 2rem */
--space-12: 48px; /* 3rem */
--space-16: 64px; /* 4rem */
```

### Border Radius
```css
--radius-sm: 4px;   /* Small elements */
--radius-md: 8px;   /* Default */
--radius-lg: 12px;  /* Cards, modals */
--radius-xl: 16px;  /* Large surfaces */
--radius-full: 50%; /* Circular elements */
```

## 📱 Screen Layouts & Wireframes

### Mobile Reading Interface (Portrait)

```
┌─────────────────────────────────┐
│ ⚙️  BookMind Title    🔍 👤 ≡  │ Header (60px)
├─────────────────────────────────┤
│                                 │
│     📖 Book Content Area        │
│                                 │ Reading Zone
│  Lorem ipsum dolor sit amet,    │ (Full height)
│  consectetur adipiscing elit.   │
│  Sed do eiusmod tempor...       │
│                                 │
│                                 │
│  [Selected text highlighted]    │
│                                 │
│  More content continues here    │
│  with proper line spacing and   │
│  readable typography...         │
│                                 │
├─────────────────────────────────┤
│ ◀️ Page 127/350    💡 💬 🔖    │ Footer (50px)
└─────────────────────────────────┘

Elements:
- Clean header with minimal controls
- Full-screen reading area
- Context-sensitive footer with AI tools
- Gesture-friendly tap zones
```

### Tablet Reading Interface (Landscape)

```
┌─────────────────────────────────────────────────────────────────┐
│ ⚙️ BookMind    📚 Library    🔍 Search    👤 Profile    ≡     │ Header
├─────────────────────────────────────┬───────────────────────────┤
│                                     │ 💡 AI Assistant           │
│     📖 Book Content Area            │ ┌─────────────────────────┐ │
│                                     │ │ "What are the main      │ │
│  Chapter 5: Advanced Concepts       │ │ themes in this chapter?"│ │
│                                     │ └─────────────────────────┘ │
│  Lorem ipsum dolor sit amet,        │                           │
│  consectetur adipiscing elit.       │ 📝 Key Insights:          │
│  Sed do eiusmod tempor incididunt   │ • Concept A explained     │
│  ut labore et dolore magna aliqua.  │ • Important relationship  │
│                                     │ • Core principle          │
│  Ut enim ad minim veniam, quis      │                           │
│  nostrud exercitation ullamco       │ 🔖 Chapter Summary        │
│  laboris nisi ut aliquip ex ea      │ This chapter covers...    │
│  commodo consequat.                 │                           │
│                                     │ ⚡ Quick Actions:         │
│                                     │ [Summarize] [Define]      │
├─────────────────────────────────────┼───────────────────────────┤
│ ◀️ ▶️ Page 127/350    📖 Contents   │ 💬 Chat  🎯 Focus Mode   │
└─────────────────────────────────────┴───────────────────────────┘

Features:
- Dual-pane layout maximizes screen real estate
- Persistent AI sidebar for contextual assistance
- Rich content display with smart typography
```

### Library/Home Screen

```
┌─────────────────────────────────┐
│ 🌅 Good morning, John!          │ Personal Greeting
│ Ready to continue reading?      │
├─────────────────────────────────┤
│ 📖 Continue Reading             │
│ ┌─────────────────────────────┐ │ Currently Reading
│ │ 🏆 The Lean Startup         │ │
│ │ By Eric Ries                │ │
│ │ ████████░░ 78%              │ │
│ │ 📍 Chapter 8: Pivot         │ │
│ └─────────────────────────────┘ │
├─────────────────────────────────┤
│ 📚 Your Library (45 books)     │ Library Grid
│ ┌───────┐ ┌───────┐ ┌───────┐ │
│ │ 📕    │ │ 📘    │ │ 📗    │ │
│ │ Book  │ │ Book  │ │ Book  │ │
│ │ Title │ │ Title │ │ Title │ │
│ └───────┘ └───────┘ └───────┘ │
│ ┌───────┐ ┌───────┐ ┌───────┐ │
│ │ 📙    │ │ 📔    │ │ 📓    │ │
│ │ Book  │ │ Book  │ │ Book  │ │
│ │ Title │ │ Title │ │ Title │ │
│ └───────┘ └───────┘ └───────┘ │
├─────────────────────────────────┤
│ 🎯 Today's Goal: 30 min        │ Progress Tracking
│ ████████░░ 24/30 min            │
└─────────────────────────────────┘

Features:
- Personalized greeting and motivation
- Clear reading progress indication
- Visual library with cover thumbnails
- Daily goal tracking and gamification
```

## 🤖 AI Interface Design

### Chat with Book Interface

```
┌─────────────────────────────────┐
│ 💬 Chat with "Book Title"       │ Header
├─────────────────────────────────┤
│ 👤 What are the main themes?    │ User Message
├─────────────────────────────────┤
│ 🤖 Based on your reading, the   │ AI Response
│    main themes include:         │
│    • Innovation and creativity  │
│    • Market validation         │
│    • Customer feedback loops   │
│                                 │
│    📍 Sources: Pages 45, 67, 89 │ Source Citations
├─────────────────────────────────┤
│ 👤 Can you explain the pivot    │ Follow-up
│    concept in simpler terms?    │
├─────────────────────────────────┤
│ 🤖 A pivot is when a startup... │ AI Response
│                                 │
│    💡 Example: Twitter started  │ Contextual Example
│    as a podcast platform...     │
├─────────────────────────────────┤
│ ┌─────────────────────────────┐ │ Input Field
│ │ Ask another question...     │ │
│ └─────────────────────────────┘ │
│ 💡 🔍 📝 ⚡                    │ Quick Actions
└─────────────────────────────────┘

Design Principles:
- Clear conversation flow
- AI responses visually distinct from user
- Source citations build trust
- Quick action buttons for common tasks
```

### Smart Summary Interface

```
┌─────────────────────────────────┐
│ 📝 Chapter 5 Summary            │ Header
├─────────────────────────────────┤
│ 🎯 Length: [Brief] Detailed     │ Controls
│ 🎪 Focus: [General] Key Points  │
├─────────────────────────────────┤
│ ⚡ Generated Summary:           │
│                                 │
│ This chapter explores the core  │ AI-Generated Content
│ principles of lean methodology, │
│ emphasizing the importance of   │
│ validated learning through      │ Summary Text
│ customer feedback loops.        │
│                                 │
│ 🔑 Key Points:                  │ Structured Insights
│ • Build-Measure-Learn cycle     │
│ • Minimum viable product (MVP)  │
│ • Customer development process  │
│                                 │
│ ⏱️ Reading time: 3 minutes      │ Metadata
│ 📊 Comprehension level: Medium  │
├─────────────────────────────────┤
│ [📤 Share] [💾 Save] [🔄 Redo] │ Action Buttons
└─────────────────────────────────┘

Features:
- Customizable summary length and focus
- Structured output with clear sections
- Actionable buttons for next steps
- Reading time estimates
```

## 🎮 Interaction Patterns

### Touch Gestures

#### Reading Area Gestures
```
Single Tap (Center):     Toggle reading controls
Single Tap (Left Edge):  Previous page
Single Tap (Right Edge): Next page
Double Tap:              Zoom in/out
Pinch:                   Zoom gesture
Long Press:              Text selection start
Swipe Left/Right:        Page navigation
Swipe Up/Down:           Scroll (when applicable)
```

#### Text Selection Gestures
```
Long Press → Drag:       Select text
Selection + Tap:         Context menu
  - Highlight
  - Note
  - AI Explain
  - Define
  - Summary
```

### Navigation Patterns

#### Bottom Tab Navigation (Mobile)
```
┌─────────────────────────────────┐
│ 📚 Library │ 📖 Reading │ 🤖 AI │ Progress │ 👤 Profile │
│   Active      Inactive     Badge     Chart      Avatar    │
└─────────────────────────────────┘

States:
- Active: Highlighted with brand color
- Inactive: Gray with subtle icon
- Badge: Red dot for notifications
- Icons: Consistent style across tabs
```

#### Floating Action Button (Reading Mode)
```
┌─────────────────────────────────┐
│                                 │
│     Reading content...          │
│                                 │
│                            🤖   │ FAB for AI
│                          ┌─────┤ Quick menu
│                          │ 💡  │ Explain
│                          │ 📝  │ Summary
│                          │ 💬  │ Chat
│                          └─────┤
└─────────────────────────────────┘

Behavior:
- Appears on scroll up, hides on scroll down
- Expands to show quick AI actions
- Contextually relevant based on current page
```

## 📐 Responsive Design Breakpoints

### Device Categories
```css
/* Mobile Phones */
@media (max-width: 480px) {
  /* Single column, minimal UI */
  .reading-area { padding: 16px; }
  .ai-panel { position: fixed; bottom: 0; }
}

/* Tablets (Portrait) */
@media (min-width: 481px) and (max-width: 768px) {
  /* Larger text, more space */
  .reading-area { padding: 24px; }
  .ai-panel { width: 320px; }
}

/* Tablets (Landscape) & Small Laptops */
@media (min-width: 769px) and (max-width: 1024px) {
  /* Two-column layout */
  .container { display: grid; grid-template-columns: 2fr 1fr; }
  .reading-area { max-width: 65ch; }
}

/* Desktops */
@media (min-width: 1025px) {
  /* Full features, sidebars */
  .container { max-width: 1200px; margin: 0 auto; }
  .ai-panel { position: sticky; top: 80px; }
}
```

## ♿ Accessibility Guidelines

### Visual Accessibility
```css
/* High Contrast Mode */
@media (prefers-contrast: high) {
  --text-primary: #000000;
  --bg-primary: #FFFFFF;
  --border-color: #000000;
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  * { transition: none !important; }
  .animation { animation: none !important; }
}

/* Color Blind Considerations */
.highlight-yellow {
  background: #FEF3C7;
  border-left: 4px solid #F59E0B; /* Shape indicator */
}
.highlight-blue {
  background: #DBEAFE;
  border-left: 4px solid #3B82F6;
}
```

### Keyboard Navigation
```
Tab Order:
1. Skip to content link
2. Main navigation
3. Search input
4. Reading content
5. AI assistant
6. Footer navigation

Keyboard Shortcuts:
- Space/Enter: Next page
- Shift+Space: Previous page
- Arrow Keys: Navigate UI elements
- Escape: Close modals/panels
- H: Toggle highlights visibility
- Shift+H: Create highlight from selection
- B: Add bookmark
- N: Add note
- S: Summarize selection
- C: Copy selected text
- / (slash): Focus search
```

### Screen Reader Support
```html
<!-- Semantic HTML Structure -->
<main role="main" aria-label="Book reading area">
  <article aria-label="Book content">
    <header aria-label="Chapter 5: Introduction">
      <h1>Chapter Title</h1>
    </header>

    <section aria-label="Chapter content">
      <p>Reading content...</p>
    </section>
  </article>

  <aside aria-label="AI Assistant" role="complementary">
    <h2>Reading Assistant</h2>
    <!-- AI features -->
  </aside>
</main>

<!-- ARIA Labels for Dynamic Content -->
<button aria-label="Ask AI about this passage"
        aria-describedby="ai-help-text">
  💡 Explain
</button>

<div id="ai-help-text" class="sr-only">
  Get AI-powered explanations for complex concepts
</div>
```

## 🎨 Component Library

### Highlighting Components

#### Highlight Color Palette
```css
/* Semantic Highlight Colors */
.highlight-yellow {
  background: #FEF3C7;
  border-left: 4px solid #F59E0B;
  --highlight-meaning: "Important concepts and key ideas";
}

.highlight-blue {
  background: #DBEAFE;
  border-left: 4px solid #3B82F6;
  --highlight-meaning: "Questions and clarifications";
}

.highlight-green {
  background: #D1FAE5;
  border-left: 4px solid #10B981;
  --highlight-meaning: "Agreements and positive insights";
}

.highlight-red {
  background: #FEE2E2;
  border-left: 4px solid #EF4444;
  --highlight-meaning: "Disagreements and critical points";
}

.highlight-purple {
  background: #EDE9FE;
  border-left: 4px solid #8B5CF6;
  --highlight-meaning: "Quotes worth sharing";
}

.highlight-orange {
  background: #FED7AA;
  border-left: 4px solid #F97316;
  --highlight-meaning: "Action items and to-dos";
}

.highlight-brown {
  background: #E7E5E4;
  border-left: 4px solid #A8A29E;
  --highlight-meaning: "Examples and case studies";
}

.highlight-pink {
  background: #FCE7F3;
  border-left: 4px solid #EC4899;
  --highlight-meaning: "Personal reflections";
}
```

#### Highlight Selection Interface
```css
/* Highlight Toolbar */
.highlight-toolbar {
  position: absolute;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  padding: 8px;
  display: flex;
  gap: 4px;
  z-index: 1000;
}

.highlight-color-btn {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
}

.highlight-color-btn:hover {
  transform: scale(1.1);
  border-color: var(--bookmind-primary);
}

.highlight-color-btn.selected {
  border-color: var(--bookmind-primary);
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
}

/* Selection Handles */
.selection-handle {
  position: absolute;
  width: 20px;
  height: 20px;
  background: var(--bookmind-primary);
  border-radius: 50%;
  cursor: grab;
  z-index: 999;
}

.selection-handle::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
}
```

### Bookmark Components

#### Bookmark Button
```css
.bookmark-btn {
  background: transparent;
  border: none;
  padding: 8px;
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.bookmark-btn:hover {
  background: var(--bg-secondary);
  color: var(--bookmind-primary);
  transform: scale(1.1);
}

.bookmark-btn.active {
  color: var(--bookmind-primary);
}

.bookmark-btn.active::before {
  content: "🔖";
}

.bookmark-btn:not(.active)::before {
  content: "🏷️";
}
```

#### Bookmark Panel
```css
.bookmark-panel {
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.bookmark-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
}

.bookmark-item:hover {
  background: var(--bg-secondary);
}

.bookmark-thumbnail {
  width: 40px;
  height: 60px;
  border-radius: 4px;
  background: var(--bg-secondary);
  flex-shrink: 0;
}

.bookmark-info h4 {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 600;
}

.bookmark-info p {
  margin: 0;
  font-size: 12px;
  color: var(--text-secondary);
}

.bookmark-category {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
}

.bookmark-category.current { background: #DBEAFE; color: #1E40AF; }
.bookmark-category.favorite { background: #FEF3C7; color: #92400E; }
.bookmark-category.review { background: #D1FAE5; color: #065F46; }
.bookmark-category.notes { background: #FCE7F3; color: #BE185D; }
```

#### Auto-Bookmark Progress Indicator
```css
.auto-bookmark-progress {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: var(--bookmind-primary);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  animation: slideUp 0.3s ease-out;
}

.auto-bookmark-progress::before {
  content: "📍";
  margin-right: 8px;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
```

### Reading Position Components

#### Continue Reading Card
```css
.continue-reading {
  background: linear-gradient(135deg, var(--bookmind-primary), var(--bookmind-primary-dark));
  color: white;
  border-radius: var(--radius-lg);
  padding: 20px;
  margin: 16px 0;
}

.continue-reading h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
}

.continue-reading p {
  margin: 0 0 16px 0;
  opacity: 0.9;
}

.reading-progress {
  background: rgba(255,255,255,0.2);
  border-radius: 8px;
  height: 8px;
  overflow: hidden;
  margin: 12px 0;
}

.reading-progress-fill {
  background: white;
  height: 100%;
  border-radius: 8px;
  transition: width 0.3s ease;
}

.continue-btn {
  background: white;
  color: var(--bookmind-primary);
  border: none;
  padding: 12px 24px;
  border-radius: var(--radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.continue-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
```

### Button Styles
```css
/* Primary Button */
.btn-primary {
  background: var(--bookmind-primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  padding: 12px 24px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: var(--bookmind-primary-dark);
  transform: translateY(-1px);
}

/* AI Action Button */
.btn-ai {
  background: var(--ai-primary);
  color: white;
  border-radius: var(--radius-lg);
  padding: 8px 16px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Icon Button */
.btn-icon {
  background: transparent;
  border: none;
  padding: 8px;
  border-radius: var(--radius-md);
  color: var(--text-secondary);
}

.btn-icon:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}
```

### Card Components
```css
/* Book Card */
.book-card {
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  transition: all 0.2s ease;
}

.book-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

/* AI Response Card */
.ai-response {
  background: var(--ai-background);
  border: 1px solid var(--ai-border);
  border-radius: var(--radius-lg);
  padding: 16px;
  margin: 12px 0;
}

.ai-response::before {
  content: "🤖";
  margin-right: 8px;
}
```

### Form Controls
```css
/* Text Input */
.input {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 12px 16px;
  font-size: 16px;
  width: 100%;
}

.input:focus {
  outline: none;
  border-color: var(--bookmind-primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

/* Toggle Switch */
.toggle {
  position: relative;
  width: 44px;
  height: 24px;
  background: var(--bg-secondary);
  border-radius: 12px;
  transition: background 0.2s ease;
}

.toggle.active {
  background: var(--bookmind-primary);
}
```

## 🚀 Animation & Micro-interactions

### Page Transitions
```css
/* Slide transition between pages */
.page-enter {
  opacity: 0;
  transform: translateX(100%);
}

.page-enter-active {
  opacity: 1;
  transform: translateX(0);
  transition: all 300ms ease-out;
}

.page-exit {
  opacity: 1;
  transform: translateX(0);
}

.page-exit-active {
  opacity: 0;
  transform: translateX(-100%);
  transition: all 300ms ease-out;
}
```

### AI Response Loading
```css
/* Typing indicator for AI responses */
.ai-typing {
  display: flex;
  align-items: center;
  gap: 4px;
}

.ai-typing span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--ai-primary);
  animation: typing 1.4s infinite;
}

.ai-typing span:nth-child(2) { animation-delay: 0.2s; }
.ai-typing span:nth-child(3) { animation-delay: 0.4s; }

@keyframes typing {
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-10px); }
}
```

### Highlight Animations
```css
/* Smooth highlight appearance */
.highlight-new {
  animation: highlightFade 0.5s ease-out;
}

@keyframes highlightFade {
  from {
    background: var(--bookmind-primary);
    color: white;
  }
  to {
    background: var(--highlight-yellow);
    color: var(--text-primary);
  }
}
```

This comprehensive design system ensures BookMind delivers a cohesive, accessible, and delightful reading experience across all platforms while maintaining the focus on intelligent, AI-enhanced reading.