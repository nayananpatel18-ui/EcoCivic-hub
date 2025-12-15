# EcoCivic Hub Web Application Requirements Document

## 1. Application Overview

### 1.1 Application Name
EcoCivic Hub

### 1.2 Application Description
A community-focused digital platform that addresses local environmental and civic challenges through citizen participation, accountability, and awareness. The platform enables users to track tree plantation and care, report civic issues and emergency hazards, and access sustainability awareness content.

### 1.3 Target Users
Local citizens (including non-English speakers), students, and community volunteers in India.

## 2. Core Functionality

### 2.1 Module 1 - Tree Plantation & Care (Primary Module)
- User registration and login system
- Add a Tree feature:\n  - Upload tree photo
  - Select location via map-based or manual input
  - Select tree type from dropdown menu
- Tree status lifecycle tracking: Planted → Growing → Healthy\n- Monthly photo update reminders\n- AI-based image validation to verify uploaded images contain plants/trees
- Reward system:\n  - Points awarded for planting trees and submitting updates
  - Achievement badges:'Green Starter', 'Eco Guardian'\n  - Area-wise leaderboard display

### 2.2 Module 2 - Civic Issue & Emergency Reporting (Secondary Module)
- Report civic issues with photo and location:
  - Fallen trees
  - Open manholes\n  - Flooded roads\n  - Garbage overflow
- Issue status tracking: Reported → In Review → Resolved
- Emergency alert tagging for critical hazards
- Admin dashboard for simulated authority view to update issue status

### 2.3 Module 3 - Awareness & Community Hub (Light Module)
- Awareness section containing:
  - Government environmental guidelines\n  - Tree care tips
  - Waste segregation tips\n- Sustainability challenges:
  - 'Plant 3 trees in 30 days'
  - 'Monthly green challenge'
- Community view:
  - Display nearby contributors list
  - Encourage collaboration without complex chat system

### 2.4 Language & Accessibility
- Multilingual support: English, Kannada, Hindi\n- Icon-based navigation for low-literacy users
- Clean, minimal UI with intuitive user flows

## 3. Design Style

### 3.1 Color Scheme
- Primary color: Soft green (#4CAF50, #81C784) reflecting environmental theme
- Secondary color: Clean white (#FFFFFF) for backgrounds
- Accent color: Warm orange (#FF9800) for alerts and CTAs
\n### 3.2 Visual Details
- Card-based layout with subtle shadows (02px 8px rgba(0,0,0,0.1))
- Rounded corners (8px border-radius) for modern feel
- Progress indicators with gradient fills
- Badge icons with vibrant colors and simple animations
- High contrast icons for accessibility

### 3.3 Layout Structure
- Mobile-first responsive design
- Card-based grid layout for tree listings and issue reports
- Bottom navigation bar for primary modules
- Clear visual hierarchy with readable typography (16px base font size)
- Simple micro-animations for user engagement (fade-in, slide-up effects)

## 4. Technical Stack

### 4.1 Frontend
- React.js for component-based architecture
- Tailwind CSS for styling
- i18n library for multilingual support

### 4.2 Backend\n- Firebase Authentication for user management
- Firebase Firestore for database
- Firebase Storage for image uploads
- REST-style API structure

### 4.3 AI/Logic
- Lightweight image classification for tree vs non-tree validation
- Rule-based validation logic
\n## 5. Additional Requirements

### 5.1 Project Structure
- Modular architecture with clear separation of concerns
- Tree Module as the most complete and polished feature
- Civic and awareness modules functional but minimal
- Demo-ready flows with dummy data where needed
- GitHub-friendly code organization

### 5.2 Priority Focus
- Clarity and usability over complexity
- Hackathon-ready presentation
- Clean, maintainable codebase
- Engaging UI with realistic functionality
