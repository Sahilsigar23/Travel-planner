# 🌍 Travel Planner

An AI-powered travel planning application that helps users create personalized trip itineraries with hotel recommendations, places to visit, and detailed day-by-day plans.

## ✨ Features

- **🤖 AI-Powered Trip Generation**: Uses Google Gemini AI to create comprehensive travel plans
- **🗺️ Smart Destination Search**: Google Places API integration for location autocomplete
- **🔐 Google Authentication**: Secure login with Google OAuth
- **🏨 Hotel Recommendations**: AI-generated hotel options with pricing and ratings
- **📅 Day-by-Day Itinerary**: Detailed daily plans with attractions and timings
- **💾 Trip Storage**: Save and manage multiple trips with Firebase
- **📱 Responsive Design**: Beautiful UI built with Tailwind CSS and shadcn/ui
- **🌐 Real-time Updates**: Toast notifications for user feedback

## 🚀 Tech Stack

- **Frontend**: React 19, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **Routing**: React Router DOM
- **Authentication**: Google OAuth (@react-oauth/google)
- **AI Integration**: Google Gemini AI
- **Database**: Firebase Firestore
- **Maps/Places**: Google Places API
- **Deployment**: Vercel
- **Icons**: Lucide React, React Icons

## 🛠️ Prerequisites

Before running this project, make sure you have:

- Node.js (v16 or higher)
- npm or yarn
- Google Cloud Console account
- Firebase project setup

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd travel-planner
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
VITE_GOOGLE_PLACE_API_KEY=your_google_places_api_key
VITE_GOOGLE_GEMINI_AI_API_KEY=your_gemini_ai_api_key
VITE_GOOGLE_AUTH_CLIENT_ID=your_google_oauth_client_id
```

### 4. Google API Setup

#### Google Places API:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable "Places API"
4. Create credentials (API Key)
5. Add the API key to your `.env` file

#### Google Gemini AI:
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Get your API key
3. Add to your `.env` file

#### Google OAuth:
1. In Google Cloud Console, go to "Credentials"
2. Create OAuth 2.0 Client ID
3. Add authorized domains for your app
4. Add the client ID to your `.env` file

### 5. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Set up Firestore Database
4. Update `src/service/firebaseConfig.jsx` with your Firebase config

### 6. Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🌐 Deployment

### Vercel Deployment

1. **Prepare for Deployment**:
   - Ensure `.env` is in `.gitignore`
   - Commit your changes to git

2. **Deploy to Vercel**:
   ```bash
   npm run build  # Test build locally
   ```

3. **Configure Environment Variables in Vercel**:
   - Go to your Vercel dashboard
   - Navigate to Project Settings → Environment Variables
   - Add all your environment variables:
     - `VITE_GOOGLE_PLACE_API_KEY`
     - `VITE_GOOGLE_GEMINI_AI_API_KEY`
     - `VITE_GOOGLE_AUTH_CLIENT_ID`

4. **Deploy**:
   - Connect your GitHub repository to Vercel
   - Vercel will automatically deploy on every push to main

## 📁 Project Structure

```
src/
├── components/
│   ├── custom/
│   │   ├── Header.jsx
│   │   └── Hero.jsx
│   └── ui/                 # shadcn/ui components
├── constants/
│   └── options.jsx         # Configuration options
├── create-trip/
│   ├── index.jsx          # Trip creation page
│   └── autocomplete.jsx   # Location search component
├── hooks/
│   └── use-toast.js       # Toast notifications
├── lib/
│   └── utils.js           # Utility functions
├── my-trips/
│   └── index.jsx          # User trips page
├── service/
│   ├── AIModal.jsx        # Gemini AI configuration
│   ├── firebaseConfig.jsx # Firebase setup
│   └── GlobalApi.jsx      # API utilities
├── view-trip/
│   └── [tripId]/          # Trip details page
├── App.jsx                # Main app component
└── main.jsx              # App entry point
```

## 🔧 Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

## 🚨 Common Issues & Solutions

### Deployment Issues:
1. **Environment Variables**: Make sure all API keys are set in Vercel dashboard
2. **Build Errors**: Run `npm run build` locally to check for issues
3. **Routing Issues**: Ensure `vercel.json` is properly configured for SPA routing

### API Issues:
1. **Google Places Not Working**: Check API key and billing setup
2. **Gemini AI Errors**: Verify API key and quota limits
3. **OAuth Issues**: Check authorized domains in Google Console

### Firebase Issues:
1. **Connection Errors**: Verify Firebase configuration
2. **Firestore Rules**: Ensure proper read/write permissions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google for providing powerful APIs
- Firebase for backend services
- Vercel for seamless deployment
- shadcn/ui for beautiful components
- The React and Vite communities

## 📧 Support

If you encounter any issues or have questions, please:
1. Check the troubleshooting section above
2. Search existing issues in the repository
3. Create a new issue with detailed information

---

**Built with ❤️ for travelers worldwide**
