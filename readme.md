# 🎓 Evaluation Management System

> A comprehensive evaluation management system built for educational institutions and companies to manage subjects, competencies, and assessment criteria with enterprise-grade standards.


## 🚀 Main Features

### 📚 **Subject Management**
- ✅ Create, read, update, and delete subjects
- ✅ Rich text descriptions with validation
- ✅ Real-time search and filtering
- ✅ Bulk operations support
- ✅ Cascade deletion (subjects → competencies)

### 🎯 **Competency Management**
- ✅ Add competencies to subjects with marks (0-10 scale)
- ✅ Advanced validation and error handling
- ✅ Statistical overview (average marks, highest scores)
- ✅ Competency-specific operations
- ✅ Marks precision control (decimal support)

### 🎨 **Modern User Interface**
- ✅ Beautiful glassmorphism design with gradients
- ✅ Smooth micro-animations and transitions
- ✅ Mobile-first responsive design
- ✅ Dark mode support (auto-detect)
- ✅ Accessibility compliant (WCAG 2.1)

### 📊 **Analytics & Insights**
- ✅ Comprehensive event tracking (Google Analytics ready)
- ✅ User interaction monitoring
- ✅ Performance metrics dashboard
- ✅ Real-time statistics
- ✅ Detailed audit logging


## 🏗️ File Structure

### 📁 **Backend Structure (Node.js + TypeScript)**
```
evaluation-backend/
├── 📁 src/
│   ├── 📁 config/
│   │   ├── 📄 database.ts           # MySQL connection & management
│   │   ├── 📄 logger.ts             # Winston logging configuration
│   │   └── 📄 environment.ts        # Environment variables validation
│   ├── 📁 controllers/
│   │   ├── 📄 subjectController.ts   # Subject HTTP handlers
│   │   └── 📄 competencyController.ts # Competency HTTP handlers
│   ├── 📁 services/
│   │   ├── 📄 subjectService.ts      # Subject business logic
│   │   └── 📄 competencyService.ts   # Competency business logic
│   ├── 📁 repositories/
│   │   ├── 📄 subjectRepository.ts   # Subject data access layer
│   │   └── 📄 competencyRepository.ts # Competency data access layer
│   ├── 📁 models/
│   │   ├── 📄 Subject.ts            # Subject type definitions
│   │   ├── 📄 Competency.ts         # Competency type definitions
│   │   └── 📄 ApiResponse.ts        # API response schemas
│   ├── 📁 middleware/
│   │   ├── 📄 errorHandler.ts       # Global error handling
│   │   ├── 📄 validation.ts         # Request validation middleware
│   │   └── 📄 logger.ts             # Request logging middleware
│   ├── 📁 validators/
│   │   ├── 📄 subjectValidator.ts    # Subject validation schemas
│   │   └── 📄 competencyValidator.ts # Competency validation schemas
│   ├── 📁 exceptions/
│   │   ├── 📄 CustomError.ts        # Base error class
│   │   ├── 📄 ValidationError.ts    # Validation error handling
│   │   ├── 📄 NotFoundError.ts      # 404 error handling
│   │   └── 📄 DatabaseError.ts      # Database error handling
│   ├── 📁 routes/
│   │   ├── 📄 subjectRoutes.ts      # Subject API routes
│   │   ├── 📄 competencyRoutes.ts   # Competency API routes
│   │   └── 📄 index.ts              # Route aggregation
│   ├── 📁 utils/
│   │   ├── 📄 responseHelper.ts     # API response utilities
│   │   └── 📄 constants.ts          # Application constants
│   ├── 📁 database/
│   │   └── 📄 schema.sql            # Database schema & seed data
│   └── 📄 app.ts                    # Express application entry point
├── 📁 logs/                         # Application logs directory
├── 📄 .env.example                  # Environment variables template
├── 📄 package.json                  # Dependencies and scripts
└── 📄 tsconfig.json                 # TypeScript configuration
```

### 📁 **Frontend Structure (Next.js 14+ App Directory)**
```
evaluation-frontend/
├── 📁 src/
│   ├── 📁 app/
│   │   ├── 📄 globals.css           # Tailwind v4+ global styles
│   │   ├── 📄 layout.tsx            # Root layout with providers
│   │   ├── 📄 page.tsx              # Home page (subject list)
│   │   ├── 📁 subjects/
│   │   │   ├── 📄 page.tsx          # Subjects listing page
│   │   │   └── 📁 [id]/
│   │   │       └── 📄 page.tsx      # Subject detail & competencies
│   │   └── 📁 api/
│   │       └── 📁 health/
│   │           └── 📄 route.ts      # Health check endpoint
│   ├── 📁 components/
│   │   ├── 📁 ui/                   # Reusable UI components
│   │   │   ├── 📄 Button.tsx        # Modern button with variants
│   │   │   ├── 📄 Input.tsx         # Form input with validation
│   │   │   ├── 📄 Modal.tsx         # Animated modal component
│   │   │   ├── 📄 Card.tsx          # Card component with hover effects
│   │   │   └── 📄 Toast.tsx         # Toast notification wrapper
│   │   ├── 📁 layout/
│   │   │   ├── 📄 Header.tsx        # Application header
│   │   │   └── 📄 Footer.tsx        # Application footer
│   │   ├── 📁 subjects/
│   │   │   ├── 📄 SubjectList.tsx   # Subject grid with search
│   │   │   ├── 📄 SubjectForm.tsx   # Create/edit subject form
│   │   │   └── 📄 SubjectCard.tsx   # Beautiful subject card
│   │   └── 📁 competencies/
│   │       ├── 📄 CompetencyList.tsx # Competency management
│   │       ├── 📄 CompetencyForm.tsx # Create/edit competency
│   │       └── 📄 CompetencyCard.tsx # Competency display card
│   ├── 📁 hooks/
│   │   ├── 📄 useSubjects.ts        # Subject state management
│   │   ├── 📄 useCompetencies.ts    # Competency state management
│   │   └── 📄 useAnalytics.ts       # Analytics event tracking
│   ├── 📁 services/
│   │   ├── 📄 api.ts                # Axios HTTP client setup
│   │   ├── 📄 subjectService.ts     # Subject API calls
│   │   ├── 📄 competencyService.ts  # Competency API calls
│   │   └── 📄 analytics.ts          # Google Analytics integration
│   ├── 📁 types/
│   │   ├── 📄 Subject.ts            # Subject TypeScript types
│   │   ├── 📄 Competency.ts         # Competency TypeScript types
│   │   └── 📄 ApiResponse.ts        # API response types
│   ├── 📁 utils/
│   │   ├── 📄 constants.ts          # Frontend constants
│   │   ├── 📄 validation.ts         # Client-side validation
│   │   └── 📄 helpers.ts            # Utility functions
│   └── 📁 styles/
│       └── 📄 components.css        # Component-specific styles
├── 📁 public/
│   ├── 📁 icons/                    # Application icons
│   └── 📁 images/                   # Static images
├── 📄 .env.local.example            # Frontend environment template
├── 📄 next.config.js                # Next.js configuration
├── 📄 tailwind.config.js            # Tailwind CSS v4+ config
├── 📄 postcss.config.js             # PostCSS configuration
└── 📄 package.json                  # Dependencies and scripts
```

## 🛠️ Technology Stack

### **Backend**
- **Runtime**: Node.js 18+
- **Language**: TypeScript 5.3+
- **Framework**: Express.js
- **Database**: MySQL 8.0+
- **Validation**: Joi
- **Logging**: Winston
- **Security**: Helmet, CORS, Rate Limiting

### **Frontend**
- **Framework**: Next.js 14+ (App Directory)
- **Language**: TypeScript 5.3+
- **Styling**: Tailwind CSS v4+
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios
- **State Management**: Custom hooks + Zustand

### **Development Tools**
- **Package Manager**: npm
- **Code Quality**: ESLint + Prettier
- **Type Checking**: TypeScript strict mode
- **Version Control**: Git

## 📋 Prerequisites

Before installing, ensure you have:

- **Node.js** 18.0.0 or higher
- **npm** 9.0.0 or higher
- **MySQL** 8.0 or higher
- **Git** (for version control)

## 🚀 Installation Guide

### **1. Clone the Repository**

```bash
git clone https://github.com/ydv-manoj/eval-system.git
cd evaluation-management-system
```

### **2. Backend Setup**

```bash
# Navigate to backend directory
cd evaluation-backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit environment variables
nano .env
```

**Configure your `.env` file:**
```env
NODE_ENV=development
PORT=3001
CORS_ORIGIN=http://localhost:3000

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=evaluation_system

# Logging
LOG_LEVEL=debug
```

**Setup Database:**
```bash
# Create database
mysql -u root -p -e "CREATE DATABASE evaluation_system;"

# Import schema and seed data
mysql -u root -p evaluation_system < src/database/schema.sql

# Verify installation
mysql -u root -p evaluation_system -e "SHOW TABLES;"
```

**Start Backend Server:**
```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

Backend will be available at: `http://localhost:3001`

### **3. Frontend Setup**

```bash
# Navigate to frontend directory (in new terminal)
cd ../evaluation-frontend

# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local

# Edit environment variables
nano .env.local
```

**Configure your `.env.local` file:**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_APP_ENV=development
```

**Start Frontend Server:**
```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

Frontend will be available at: `http://localhost:3000`

## 🧪 Testing the Installation

### **1. Health Check**
```bash
# Test backend health
curl http://localhost:3001/api/health

# Expected response:
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "service": "evaluation-backend"
}
```

### **2. API Testing**
```bash
# Test subjects endpoint
curl http://localhost:3001/api/subjects

# Create a test subject
curl -X POST http://localhost:3001/api/subjects \
  -H "Content-Type: application/json" \
  -d '{"name":"Data Structures","description":"Fundamental data structures"}'
```

### **3. Frontend Testing**
1. Open `http://localhost:3000` in your browser
2. You should see the beautiful evaluation system dashboard
3. Try creating a subject using the "Create Subject" button
4. Add competencies to your subject
5. Test search and filtering functionality


## 🚀 Deployment Options

### **1. Development**
```bash
# Backend
cd evaluation-backend && npm run dev

# Frontend
cd evaluation-frontend && npm run dev
```

### **2. Production - Traditional Server**
```bash
# Backend
cd evaluation-backend
npm run build
pm2 start dist/app.js --name evaluation-backend

# Frontend
cd evaluation-frontend
npm run build
npm start
```

### **3. Production - Docker**
```bash
# Build and run with Docker
docker-compose up -d
```

### **4. Cloud Deployment**
- **Backend**: Heroku, Railway, DigitalOcean
- **Frontend**: Vercel, Netlify, AWS Amplify
- **Database**: PlanetScale, AWS RDS, Google Cloud SQL

## 🔧 Configuration

### **Backend Configuration**
| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `3001` |
| `DB_HOST` | MySQL host | `localhost` |
| `DB_PORT` | MySQL port | `3306` |
| `DB_USER` | MySQL username | `root` |
| `DB_PASSWORD` | MySQL password | - |
| `DB_NAME` | Database name | `evaluation_system` |
| `LOG_LEVEL` | Logging level | `info` |
| `CORS_ORIGIN` | CORS origin | `http://localhost:3000` |

### **Frontend Configuration**
| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:3001/api` |
| `NEXT_PUBLIC_GA_ID` | Google Analytics ID | - |
| `NEXT_PUBLIC_APP_ENV` | App environment | `development` |

## 📚 API Documentation

### **Subjects API**
```
GET    /api/subjects          # Get all subjects
GET    /api/subjects/:id      # Get subject by ID
POST   /api/subjects          # Create new subject
PUT    /api/subjects/:id      # Update subject
DELETE /api/subjects/:id      # Delete subject
```

### **Competencies API**
```
GET    /api/competencies                    # Get all competencies
GET    /api/competencies/subject/:subjectId # Get by subject
GET    /api/competencies/:id                # Get competency by ID
POST   /api/competencies                    # Create new competency
PUT    /api/competencies/:id                # Update competency
DELETE /api/competencies/:id                # Delete competency
```

### **Request/Response Examples**

**Create Subject:**
```bash
POST /api/subjects
Content-Type: application/json

{
  "name": "Cloud Computing",
  "description": "Modern cloud technologies and services"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Subject created successfully",
  "data": {
    "id": 1,
    "name": "Cloud Computing",
    "description": "Modern cloud technologies and services",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

### **Development Standards**
- Follow TypeScript strict mode
- Use ESLint and Prettier for code formatting
- Write unit tests for new features
- Update documentation for API changes
- Follow conventional commit messages

## 🐛 Troubleshooting

### **Common Issues**

**Backend won't start:**
```bash
# Check MySQL connection
mysql -u root -p -e "SELECT 1;"

# Verify environment variables
cat .env

# Check logs
tail -f logs/error.log
```

**Frontend build errors:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check TypeScript
npm run type-check
```

**Database connection issues:**
```bash
# Test database connection
mysql -h localhost -P 3306 -u root -p evaluation_system -e "SHOW TABLES;"

# Check user permissions
mysql -u root -p -e "SHOW GRANTS FOR 'root'@'localhost';"
```

