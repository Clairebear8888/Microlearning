# MicroLearn - Frontend

🎓 Modern, AI-powered microlearning platform where users can learn any topic through bite-sized lessons and quizzes.

## ✨ Features

- **AI-Generated Content**: Enter any topic and get 15 personalized mini-lessons
- **Interactive Learning**: Progress through lessons with completion tracking
- **Smart Quizzes**: Test knowledge with AI-generated quizzes
- **Progress Dashboard**: Track learning stats, scores, and completed topics
- **Responsive Design**: Beautiful mobile-first UI that works on all devices
- **Modern UI/UX**: Purple/blue gradient theme with smooth animations

## 🛠️ Tech Stack

- **Framework**: React 18
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Styling**: Custom CSS with CSS Variables
- **Build Tool**: Vite
- **State Management**: React Context API

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend API running (see backend README)

## ⚙️ Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd client
```

2. **Install dependencies**
```bash
npm install
```

3. **Create `.env` file**
```env
VITE_API_URL=http://localhost:5005
```

4. **Start development server**
```bash
npm run dev
```

App will run on `http://localhost:5173`


## 🎨 Pages

### 🏠 Home Page
- Hero section with call-to-action
- Feature highlights
- How it works section
- Testimonials
- Responsive design

### 📚 Topics Page
- Input field for any topic
- AI generates 15 lessons (10-15 seconds)
- Popular topic suggestions
- Loading states

### 📖 Lessons Page
- Navigate through 15 mini-lessons
- Mark lessons as complete
- Progress bar visualization
- Next/Previous navigation
- Access quiz after completing all lessons

### 🎯 Quiz Page
- 5 AI-generated multiple-choice questions
- Real-time answer selection
- Score calculation
- Visual feedback (correct/incorrect)
- Results summary

### 👤 Profile Page
- User statistics dashboard
- Topics learned counter
- Lessons completed
- Quiz scores and history
- Average score visualization
- Learning time estimation

## 🔐 Authentication

- Signup with username, email, password
- Login with email and password
- JWT token stored in localStorage
- Protected routes with AuthContext
- Auto-redirect for unauthorized access

## 🎨 Design System

### Color Palette
```css
--primary: #6366f1        /* Purple */
--primary-dark: #4f46e5
--secondary: #8b5cf6      /* Deeper purple */
--success: #10b981        /* Green */
--warning: #f59e0b        /* Orange */
--error: #ef4444          /* Red */
--gradient: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)
```

### Typography
- Font: System fonts (-apple-system, Segoe UI, etc.)
- Responsive font sizes
- Font weights: 400-800

### Components
- Mobile-first responsive design
- Smooth transitions and animations
- Consistent spacing (8px base unit)
- Accessible color contrasts

## 📱 Responsive Breakpoints
```css
Mobile: < 640px
Tablet: 640px - 1024px
Desktop: > 1024px
```

## 🚀 Build for Production
```bash
# Build optimized production bundle
npm run build

# Preview production build
npm run preview
```

## 📝 Available Scripts
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

## 🔧 Configuration

### Vite Config
Configure in `vite.config.js`:
- Port settings
- Proxy configuration
- Build optimizations

### Environment Variables
Create `.env.local` for local overrides:
```env
VITE_API_URL=http://localhost:5005
```

## 🎯 User Flow

1. **Sign Up** → Create account
2. **Login** → Authenticate
3. **Select Topic** → Enter any subject
4. **Learn** → Go through 15 lessons
5. **Mark Complete** → Track progress
6. **Take Quiz** → Test knowledge
7. **View Profile** → See statistics

## 📊 Features in Detail

### AI Lesson Generation
- Input: Any topic (e.g., "JavaScript", "Photoshop")
- Output: 15 mini-lessons with:
  - Unique subtopic
  - 2-3 sentence summary
  - 3 key bullet points
- Generation time: 10-15 seconds

### Progress Tracking
- Lessons completed per topic
- Quiz scores and history
- Average quiz performance
- Estimated learning time
- Topics completed count

### Quiz System
- 5 multiple-choice questions
- 4 options per question
- Instant feedback on submission
- Score calculation
- Review correct answers

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🐛 Known Issues

- Browser storage APIs (localStorage/sessionStorage) are used for token storage
- AI generation may timeout for complex topics
- Quiz requires all lessons to be completed first

## 🔮 Future Enhancements

- [ ] Dark mode toggle
- [ ] Lesson bookmarks/favorites
- [ ] Social sharing features
- [ ] Achievement badges
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Search and filter lessons
- [ ] Export progress as PDF

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Claire Zhu - https://github.com/Clairebear8888/

## 🙏 Acknowledgments

- Google Gemini AI for content generation
- React community
- Vite for blazing fast development
- Icons from emoji


**Made with ❤️ and ☕**
