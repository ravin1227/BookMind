# 👤 BookMind - Profile & Settings Screen Wireframe Prompt

## 📱 Profile & Settings Interface Design

Create wireframes for the BookMind profile and settings screens - the interface for user account management and app configuration.

### 🎯 Profile Screen Layout

```
┌─────────────────────────────────┐
│ ← Profile                       │ Header with back button
├─────────────────────────────────┤
│                                 │
│        👤 User Avatar           │ Profile picture
│                                 │
│        John Doe                  │ User name
│        john@example.com          │ Email address
│                                 │
│ ┌─────────────────────────────┐ │
│ │ 📊 Reading Statistics        │ │ Stats section
│ │                             │ │
│ │ Books Read: 12              │ │
│ │ Pages Highlighted: 247      │ │
│ │ Reading Streak: 12 days     │ │
│ │ Total Reading Time: 24h 30m │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ ⚙️ Account Settings         │ │ Settings section
│ │                             │ │
│ │ Edit Profile                 │ │
│ │ Change Password             │ │
│ │ Privacy Settings            │ │
│ │ Notification Preferences    │ │
│ └─────────────────────────────┘ │
│                                 │
│ [Sign Out]                      │ Action button
└─────────────────────────────────┘
```

### 🎯 Settings Screen Layout

```
┌─────────────────────────────────┐
│ ← Settings                      │ Header with back button
├─────────────────────────────────┤
│                                 │
│ ┌─────────────────────────────┐ │
│ │ 📖 Reading Preferences      │ │ Reading settings
│ │                             │ │
│ │ Font Size: [Medium] ▼       │ │
│ │ Theme: [Dark] ▼             │ │
│ │ Auto-bookmark: ●            │ │
│ │ AI Insights: ●              │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ 🔔 Notifications            │ │ Notification settings
│ │                             │ │
│ │ Daily Reading Reminder: ●   │ │
│ │ Highlight Notifications: ● │ │
│ │ Sync Alerts: ●              │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ 🔄 Sync & Backup            │ │ Sync settings
│ │                             │ │
│ │ Auto-sync: ●                │ │
│ │ Cloud Backup: ●             │ │
│ │ Export Data: [Export]       │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ 🛡️ Privacy & Security       │ │ Privacy settings
│ │                             │ │
│ │ Data Collection: ●          │ │
│ │ Analytics: ●                │ │
│ │ Delete Account: [Delete]    │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

### 🎨 Design Elements

#### Profile Screen
- **User Avatar**: Large profile picture placeholder
- **User Info**: Name and email display
- **Reading Statistics**: Key metrics in card format
- **Account Settings**: Navigation to settings sections
- **Sign Out**: Prominent action button

#### Settings Screen
- **Reading Preferences**: Font, theme, AI features
- **Notifications**: Reminder and alert settings
- **Sync & Backup**: Data synchronization options
- **Privacy & Security**: Data and account management

### 📱 Interactive Features

#### Profile Picture Upload
```
┌─────────────────────────────────┐
│        👤 User Avatar           │ Default avatar
│      [Change Photo]              │ Upload button
└─────────────────────────────────┘

┌─────────────────────────────────┐
│        [📷] Profile Photo        │ Uploaded photo
│      [Change Photo]              │ Change button
└─────────────────────────────────┘
```

#### Settings Toggles
```
┌─────────────────────────────────┐
│ Auto-bookmark: ●                │ Enabled toggle
│ AI Insights: ○                  │ Disabled toggle
└─────────────────────────────────┘
```

#### Theme Selection
```
┌─────────────────────────────────┐
│ Theme: [Dark] ▼                 │ Dropdown
│   ○ Light                       │ Options
│   ● Dark                        │ Selected
│   ○ Sepia                       │
└─────────────────────────────────┘
```

### 📱 Technical Specs
- **Platform**: React Native mobile app
- **Screen**: iPhone 14 Pro (393x852px)
- **Orientation**: Portrait
- **Theme**: Dark background with glassmorphism effects

### 🎯 Key Features
- **User profile** management
- **Reading preferences** customization
- **Notification settings** control
- **Data sync** configuration
- **Privacy controls** and security
- **Account management** options

### ♿ Accessibility
- **Touch targets**: Minimum 44px for buttons
- **Form controls**: Clear labels and validation
- **Screen reader**: Proper structure and labels
- **High contrast**: Readable text and controls

### 🤖 AI Integration
- **AI insights** toggle for personalized features
- **Reading analytics** data collection preferences
- **Smart recommendations** settings
- **Privacy controls** for AI data usage

### 🔒 Security Features
- **Password change** functionality
- **Data export** for user data portability
- **Account deletion** with confirmation
- **Privacy settings** for data collection

Create comprehensive profile and settings interfaces that give users full control over their reading experience and account management.
