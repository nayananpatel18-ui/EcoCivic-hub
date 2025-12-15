# EcoCivic Hub

A community-focused digital platform that addresses local environmental and civic challenges through citizen participation, accountability, and awareness.

## 🌟 Features

### 🌳 Tree Plantation & Care (Primary Module)
- **Plant & Track Trees**: Upload photos, select location, and choose tree type
- **Status Lifecycle**: Track tree growth from Planted → Growing → Healthy
- **Monthly Updates**: Add progress photos and notes
- **Rewards System**: Earn points and badges for planting trees
- **Leaderboard**: View top contributors in your community

### 🚨 Civic Issue Reporting (Secondary Module)
- **Report Issues**: Document civic problems with photos and location
- **Issue Categories**: Fallen trees, open manholes, flooded roads, garbage overflow
- **Status Tracking**: Monitor issue resolution (Reported → In Review → Resolved)
- **Emergency Alerts**: Flag critical hazards for immediate attention
- **Admin Dashboard**: Manage and update issue statuses

### 📚 Awareness & Community Hub (Light Module)
- **Educational Content**: Government guidelines, tree care tips, waste segregation
- **Sustainability Challenges**: Participate in community challenges
- **Community View**: Connect with nearby contributors
- **Multilingual Support**: Available in English, Kannada, and Hindi

## 🎯 User Roles

- **Regular Users**: Plant trees, report issues, earn rewards
- **Admin**: First registered user becomes admin automatically
  - Manage user roles
  - Update issue statuses
  - Oversee community activities

## 🚀 Getting Started

### Prerequisites

```bash
Node.js ≥ 20
npm ≥ 10
```

### Installation

1. **Clone or download the project**

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev -- --host 127.0.0.1
```

4. **Open your browser**
Navigate to `http://127.0.0.1:5173`

## 📱 Usage Guide

### First Time Setup

1. **Register an Account**
   - Click "Register" on the home page
   - Enter username, password, and optional location
   - First registered user automatically becomes admin

2. **Explore Features**
   - **Home**: View your stats and quick actions
   - **Trees**: Browse community trees or add your own
   - **Issues**: Report civic problems or view existing reports
   - **Awareness**: Learn about environmental best practices
   - **Profile**: View your points, badges, and contributions
   - **Leaderboard**: See top community contributors

### Planting a Tree

1. Navigate to Trees → Add Tree
2. Upload a photo of the tree
3. Select tree type from dropdown
4. Enter location
5. Submit to earn 10 points and "Green Starter" badge

### Reporting an Issue

1. Navigate to Issues → Report Issue
2. Upload a photo of the issue
3. Select issue category
4. Add description and location
5. Toggle emergency alert if critical
6. Submit to earn 5 points

### Admin Features

If you're an admin, you'll see an additional "Admin" link in the header:
- **Manage Users**: Change user roles between User and Admin
- **Manage Issues**: Update issue statuses (Reported, In Review, Resolved)

## 🎨 Design Features

- **Mobile-First Design**: Optimized for mobile with bottom navigation
- **Responsive Layout**: Works seamlessly on desktop and mobile
- **Green Theme**: Environmental color scheme with soft greens and warm accents
- **Icon-Based Navigation**: Intuitive icons for low-literacy users
- **Multilingual**: Switch between English, Hindi, and Kannada

## 🏆 Rewards System

### Points
- Plant a tree: **10 points**
- Add tree update: **5 points**
- Report an issue: **5 points**

### Badges
- **🌱 Green Starter**: Plant your first tree
- **🌳 Tree Planter**: Plant 5 trees
- **🦸 Community Hero**: Report 3 issues
- **🛡️ Eco Guardian**: Complete a challenge

## ⚠️ Important Notes

### Data Storage
**This demo uses localStorage for data persistence.** All data is stored locally in your browser:
- Data persists across sessions
- Data is device-specific (not synced across devices)
- Clearing browser data will reset the application

### Production Deployment
For a production environment, this application should be integrated with Supabase or another backend service for:
- Real database storage
- User authentication
- File storage for images
- Multi-device synchronization

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Routing**: React Router v6
- **Internationalization**: i18next
- **Build Tool**: Vite
- **Data Storage**: localStorage (demo only)

## 📂 Project Structure

```
src/
├── components/
│   ├── common/          # Shared components (Header, BottomNav)
│   └── ui/              # shadcn/ui components
├── contexts/            # React contexts (AuthContext)
├── i18n/               # Internationalization
│   ├── config.ts       # i18n setup
│   └── locales/        # Translation files (en, hi, kn)
├── pages/              # Page components
│   ├── trees/          # Tree module pages
│   ├── issues/         # Issue module pages
│   └── ...             # Other pages
├── services/           # Business logic
│   ├── storage.ts      # localStorage wrapper
│   ├── auth.ts         # Authentication service
│   └── api.ts          # Data access layer
├── types/              # TypeScript type definitions
├── App.tsx             # Main app component
├── routes.tsx          # Route configuration
└── main.tsx            # Entry point
```

## 🌐 Language Support

The application supports three languages:
- **English** (en)
- **Hindi** (hi) - हिंदी
- **Kannada** (kn) - ಕನ್ನಡ

Switch languages using the dropdown in the header.

## 🤝 Contributing

This is a demo application built for the EcoCivic Hub hackathon. For production use, please integrate with a proper backend service.

## 📄 License

This project is part of the EcoCivic Hub initiative.

---

**Built with ❤️ for a greener future** 🌱
