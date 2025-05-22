# SunsetView.com Frontend - Complete README

A comprehensive React-based frontend application for the SunsetView.com hotel booking platform, providing users with an intuitive interface to discover, book, and manage hotel accommodations with stunning sunset views.

## 🌟 Overview

SunsetView.com Frontend is a modern, responsive web application built with React and TypeScript that offers:

- **Seamless User Experience**: Intuitive interface for browsing and booking hotels
- **Advanced Search & Filtering**: Comprehensive search with multiple filter options
- **Secure Payment Processing**: Integrated Stripe payment system
- **User Account Management**: Registration, authentication, and profile management
- **Hotel Management System**: Tools for hotel owners to manage their properties
- **Admin Dashboard**: Complete administrative control panel
- **Mobile-First Design**: Responsive design optimized for all devices

## 🛠️ Technology Stack

### Core Technologies
- **React 19** - Modern JavaScript UI library
- **TypeScript** - Type-safe JavaScript for better development experience
- **Vite** - Fast build tool and development server
- **React Router DOM** - Client-side routing and navigation
- **Tailwind CSS** - Utility-first CSS framework for styling

### State Management & Data Fetching
- **TanStack React Query** - Server state management and caching
- **React Context API** - Global state management
- **React Hook Form** - Efficient form handling and validation

### Payment & Authentication
- **Stripe React** - Secure payment processing integration
- **HTTP-only Cookies** - Secure authentication token storage
- **JWT Tokens** - JSON Web Token authentication

### UI Components & Utilities
- **React Icons** - Comprehensive icon library (Heroicons, Font Awesome)
- **React DatePicker** - Date selection component
- **React Query DevTools** - Development debugging tools

## 📋 Prerequisites

Before setting up the frontend application, ensure you have:

- **Node.js** (v18.0.0 or higher)
- **npm** (v8.0.0 or higher) or **yarn** (v1.22.0 or higher)
- **Git** for version control
- **Backend API** - The corresponding SunsetView backend server
- **Stripe Account** - For payment processing (test keys for development)
- **Modern Web Browser** - Chrome, Firefox, Safari, or Edge

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/sunsetview-frontend.git
cd sunsetview-frontend
```

### 2. Install Dependencies
Using npm:
```bash
npm install
```

Using yarn:
```bash
yarn install
```

This will install all required dependencies including:
```
├── react@19.0.0
├── react-dom@19.0.0
├── typescript@5.8.2
├── @vitejs/plugin-react-swc@3.8.0
├── tailwindcss@4.0.12
├── @tanstack/react-query@5.67.2
├── react-router-dom@7.2.0
├── react-hook-form@7.54.2
├── @stripe/react-stripe-js@3.5.1
├── @stripe/stripe-js@6.1.0
├── react-datepicker@8.2.1
├── react-icons@5.5.0
└── And other supporting libraries...
```

### 3. Environment Configuration
Create a `.env` file in the root directory:
```bash
touch .env
```

Add the following environment variables:
```env
# API Configuration
VITE_API_BASE_URL="http://localhost:3000"

# Stripe Configuration (Use test keys for development)
VITE_APP_STRIPE_PUBLIC_KEY="pk_test_your_stripe_publishable_key_here"

# Environment
NODE_ENV=development
```

### 4. Obtaining Stripe Keys
1. **Create Stripe Account:**
   - Visit [Stripe Dashboard](https://stripe.com)
   - Sign up for a new account or log in

2. **Get API Keys:**
   - Navigate to Dashboard → Developers → API Keys
   - Copy the "Publishable key" for frontend use
   - Use test keys for development, live keys for production

3. **Test Payment Cards:**
   - Visa: `4242 4242 4242 4242`
   - Visa (debit): `4000 0566 5566 5556`
   - Mastercard: `5555 5555 5555 4444`
   - American Express: `3782 822463 10005`

### 5. Start the Development Server
```bash
npm run dev
# or
yarn dev
```

The application will start on `http://localhost:5173` and automatically open in your default browser.

## 📁 Project Structure

```
src/
├── components/                    # Reusable UI Components
│   ├── admin/
│   │   └── AdminLayout.tsx       # Admin panel layout
│   ├── auth/
│   │   └── SignOutButton.tsx     # Authentication components
│   ├── booking/
│   │   └── BookingOverview.tsx   # Booking summary component
│   ├── common/
│   │   ├── Footer.tsx            # Site footer
│   │   ├── Header.tsx            # Site header with navigation
│   │   ├── Modal.tsx             # Reusable modal component
│   │   ├── Pagination.tsx        # Pagination component
│   │   └── Toast.tsx             # Notification system
│   ├── filters/
│   │   ├── RatingFilter.tsx      # Hotel rating filter
│   │   └── TypesFilter.tsx       # Hotel type filter
│   ├── layout/
│   │   └── Hero.tsx              # Hero section component
│   ├── policy-contents/
│   │   ├── PolicyType.tsx        # Policy modal system
│   │   ├── PrivacyPolicyContent.tsx
│   │   ├── TermsOfServiceContent.tsx
│   │   └── CookiePolicyContent.tsx
│   └── search/
│       ├── SearchBar.tsx         # Main search interface
│       └── SearchCard.tsx        # Hotel search result card
├── contexts/                      # React Context Providers
│   ├── AppContext.tsx            # Global app state (auth, toasts)
│   └── SearchContext.tsx         # Search state management
├── forms/                         # Form Components
│   ├── bookingForm/
│   │   └── RoomBookingForm.tsx   # Hotel booking form
│   ├── hotelManagementForm/
│   │   ├── HotelManagementForm.tsx
│   │   ├── Details.tsx           # Hotel details form
│   │   ├── Type.tsx              # Hotel type selection
│   │   ├── Facilities.tsx        # Facilities selection
│   │   ├── Visitors.tsx          # Guest capacity form
│   │   └── Images.tsx            # Image upload management
│   └── VisitorInformationForm/
│       └── VisitorInfoForm.tsx   # Guest information form
├── pages/                         # Page Components
│   ├── admin/                    # Admin Panel Pages
│   │   ├── Dashboard.tsx         # Admin dashboard
│   │   ├── Users.tsx             # User management
│   │   ├── Hotels.tsx            # Hotel management
│   │   ├── HotelDetail.tsx       # Hotel detail view
│   │   ├── Bookings.tsx          # Booking management
│   │   └── Messages.tsx          # Message management
│   ├── auth/                     # Authentication Pages
│   │   ├── Register.tsx          # User registration
│   │   ├── SignIn.tsx            # User login
│   │   ├── ForgotPassword.tsx    # Password recovery
│   │   └── ResetPassword.tsx     # Password reset
│   ├── booking/                  # Booking Pages
│   │   ├── Booking.tsx           # Booking process
│   │   ├── MyBooking.tsx         # User's bookings
│   │   └── HotelBookings.tsx     # Hotel owner's bookings
│   ├── hotel/                    # Hotel Pages
│   │   ├── AddHotel.tsx          # Add new hotel
│   │   ├── EditHotel.tsx         # Edit hotel details
│   │   ├── MyHotel.tsx           # Hotel owner dashboard
│   │   ├── DetailSec.tsx         # Hotel detail page
│   │   ├── AllHotels.tsx         # All hotels listing
│   │   ├── FeaturedStays.tsx     # Featured hotels
│   │   └── TrendingDestinations.tsx # Trending locations
│   ├── info/                     # Information Pages
│   │   ├── AboutUs.tsx           # About company
│   │   ├── Contact.tsx           # Contact form
│   │   ├── Careers.tsx           # Career opportunities
│   │   ├── PrivacyPolicy.tsx     # Privacy policy
│   │   └── CookiePolicy.tsx      # Cookie policy
│   ├── search/                   # Search Pages
│   │   └── Search.tsx            # Search results page
│   └── Home.tsx                  # Homepage
├── config/                       # Configuration
│   └── hotelType-config.ts       # Hotel types and facilities
├── interface/                    # Layout Interfaces
│   └── Interface.tsx             # Main layout wrapper
├── api-client.ts                 # API Communication Layer
├── App.tsx                       # Main Application Component
├── main.tsx                      # Application Entry Point
└── index.css                     # Global Styles
```

## 🎯 Key Features

### User Authentication System
- **Registration**: Email-based user registration with validation
- **Login/Logout**: Secure JWT-based authentication
- **Password Recovery**: Email-based password reset system
- **Profile Management**: User profile updates and settings

### Hotel Search & Discovery
- **Advanced Search**: Multi-criteria search (location, dates, guests)
- **Filtering System**: Rating, type, facilities, price range filters
- **Sorting Options**: Price, rating, and relevance sorting
- **Pagination**: Efficient large dataset navigation

### Booking System
- **Date Selection**: Interactive calendar with availability checking
- **Guest Management**: Adult and children count selection
- **Price Calculation**: Real-time pricing with breakdowns
- **Payment Processing**: Secure Stripe integration
- **Booking Confirmation**: Email confirmations and receipts

### Hotel Management (For Hotel Owners)
- **Property Listing**: Complete hotel profile creation
- **Image Management**: Multiple image upload with carousel
- **Facility Selection**: Comprehensive amenity selection
- **Booking Oversight**: View and manage property bookings
- **Analytics**: Basic booking and revenue insights

### Admin Dashboard
- **User Management**: View, manage, and moderate users
- **Hotel Oversight**: Monitor all properties on platform
- **Booking Management**: System-wide booking monitoring
- **Analytics**: Platform statistics and performance metrics
- **Message Center**: Contact form and support ticket management

## 🔌 API Integration

### API Client Architecture
The `api-client.ts` file centralizes all API communications:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Example API function with error handling
export const searchHotels = async (params: SearchParameter): Promise<HotelQueryResponse> => {
  try {
    const queryParameter = new URLSearchParams();
    // Build query parameters...
    
    const response = await fetch(`${API_BASE_URL}/api/hotels/search?${queryParameter}`);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Search hotels error:', error);
    throw error;
  }
};
```

### Key API Functions

**Authentication APIs**
```typescript
register()          // User registration
signIn()            // User login
validateToken()     // Token validation
signOut()           // User logout
requestPasswordReset() // Password recovery
resetPassword()     // Password reset
```

**Hotel Management APIs**
```typescript
getAllHotels()      // Public hotel listing
searchHotels()      // Advanced hotel search
getHotelById()      // Hotel details
addHotel()          // Create new hotel
updateHotel()       // Update hotel details
deleteHotelImage()  // Remove hotel images
```

**Booking APIs**
```typescript
createPaymentIntent() // Initialize payment
createBooking()      // Complete booking
getBookings()        // User's bookings
getHotelBookings()   // Hotel's bookings
```

**Admin APIs**
```typescript
getAdminDashboardStats() // Dashboard metrics
getAdminUsers()      // All users
deleteUser()         // Remove user
getAdminHotels()     // All hotels
getAdminBookings()   // All bookings
```

## 🔐 Authentication & Security

### Authentication Flow
1. **User Registration/Login:**
```typescript
const { mutate: loginMutation } = useMutation({
  mutationFn: apiClient.signIn,
  onSuccess: (data) => {
    showToast({ message: "Login successful!", type: "SUCCESS" });
    navigate("/dashboard");
  }
});
```

2. **Token Storage**: JWTs stored in HTTP-only cookies for security

3. **Token Validation**: Automatic validation on app initialization
```typescript
const { data: authData } = useQuery({
  queryKey: ["validateToken"],
  queryFn: apiClient.validateToken,
  retry: false
});
```

4. **Route Protection**: Protected routes with authentication guards
```typescript
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn } = useToast();
  
  if (!isLoggedIn) {
    return <Navigate to="/sign-in" />;
  }
  
  return <>{children}</>;
};
```

## 💳 Payment Processing

### Stripe Integration Architecture
The application uses Stripe Elements for secure, PCI-compliant payment processing:

```typescript
// Payment Intent Creation
const { data: paymentIntent } = useQuery({
  queryKey: ["createPaymentIntent", hotelId, nights, adults, children],
  queryFn: () => apiClient.createPaymentIntent(hotelId, nights, adults, children),
  enabled: !!hotelId && nights > 0
});

// Stripe Elements Setup
<Elements
  stripe={stripePromise}
  options={{
    clientSecret: paymentIntent.clientSecret,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#F97316' // Orange theme
      }
    }
  }}
>
  <PaymentForm />
</Elements>
```

### Payment Flow
1. **Booking Initiation**: User selects hotel, dates, and guests
2. **Price Calculation**: Real-time pricing with breakdowns
3. **Payment Intent**: Backend creates Stripe PaymentIntent
4. **Payment Form**: Secure Stripe Elements form
5. **Payment Processing**: Client-side payment confirmation
6. **Booking Creation**: Server validates and creates booking
7. **Confirmation**: Email confirmation sent to user

## 📱 Available Scripts

### Development Scripts
```bash
# Start development server with hot reload
npm run dev

# Start development server and open in browser
npm run dev -- --open

# Start with specific port
npm run dev -- --port 3001
```

### Build Scripts
```bash
# Build for production
npm run build

# Preview production build locally
npm run preview

# Build with source maps for debugging
npm run build -- --sourcemap
```

### Quality Assurance Scripts
```bash
# Run ESLint for code quality
npm run lint

# Fix ESLint issues automatically
npm run lint -- --fix

# Type check without building
npx tsc --noEmit
```

## 🚀 Deployment

### Build Process
1. **Type Checking**: Ensure TypeScript compilation succeeds
2. **Asset Optimization**: Vite optimizes all assets
3. **Bundle Creation**: Creates optimized production bundle
4. **Static Generation**: Generates static HTML/CSS/JS files

```bash
# Complete build process
npm run build

# Output will be in 'dist' directory
ls dist/
# Output: index.html, assets/, favicon.ico, etc.
```

### Environment Configuration

**Development Environment**
```env
VITE_API_BASE_URL="http://localhost:3000"
VITE_APP_STRIPE_PUBLIC_KEY="pk_test_..."
NODE_ENV="development"
```

**Production Environment**
```env
VITE_API_BASE_URL="https://api.sunsetview.com"
VITE_APP_STRIPE_PUBLIC_KEY="pk_live_..."
NODE_ENV="production"
```

### Deployment Platforms

**Vercel (Recommended)**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to Vercel
vercel --prod

# Set environment variables in Vercel dashboard
```

**Netlify**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

**Traditional Web Hosting**
```bash
# Build the application
npm run build

# Upload 'dist' folder contents to web server
# Configure server for SPA routing (redirect all routes to index.html)
```

### Production Checklist
- [ ] Environment variables configured for production
- [ ] API endpoints updated to production URLs
- [ ] Stripe keys updated to live keys
- [ ] CORS configured on backend for production domain
- [ ] HTTPS enabled and configured
- [ ] Error logging and monitoring implemented
- [ ] Performance monitoring enabled
- [ ] SEO meta tags configured
- [ ] Favicon and app icons set
- [ ] Analytics tracking implemented

## 🐛 Troubleshooting

### Common Issues and Solutions

**1. Application Won't Start**
Problem: `Error: Cannot find module` or `Module not found`

Solutions:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear npm cache
npm cache clean --force

# Check Node.js version
node --version  # Should be 18.0.0 or higher
```

**2. Environment Variables Not Working**
Problem: `undefined` when accessing `import.meta.env.VITE_*`

Solutions:
- Ensure variables are prefixed with `VITE_`
- Restart development server after adding variables
- Check `.env` file is in root directory
- Verify `.env` file syntax (no spaces around `=`)

**3. API Connection Issues**
Problem: `Network Error` or `CORS Error`

Solutions:
```bash
# Check backend server is running
curl http://localhost:3000/health

# Verify API base URL in .env
echo $VITE_API_BASE_URL

# Check CORS configuration on backend
```

**4. Payment Processing Issues**
Problem: Stripe payment form not loading

Solutions:
- Verify Stripe publishable key is correct
- Check browser console for Stripe errors
- Ensure HTTPS in production (Stripe requirement)
- Test with Stripe test cards

## 🤝 Contributing

### Development Workflow

1. **Fork the Repository**
```bash
# Fork on GitHub, then clone your fork
git clone https://github.com/your-username/sunsetview-frontend.git
cd sunsetview-frontend
```

2. **Create Feature Branch**
```bash
git checkout -b feature/your-feature-name
```

3. **Make Changes**
   - Follow existing code patterns
   - Add tests for new functionality
   - Update documentation as needed

4. **Test Changes**
```bash
npm run lint
npm run build
npm test
```

5. **Commit Changes**
```bash
git add .
git commit -m "feat: add new feature description"
```

6. **Push and Create PR**
```bash
git push origin feature/your-feature-name
# Create Pull Request on GitHub
```

### Code Standards

**TypeScript Guidelines**
```typescript
// Use proper typing
interface HotelProps {
  hotel: HotelType;
  onSelect?: (hotel: HotelType) => void;
}

// Prefer function components with hooks
const HotelCard: React.FC<HotelProps> = ({ hotel, onSelect }) => {
  // Component logic
};
```

**Component Guidelines**
```typescript
// Follow naming conventions
// - PascalCase for components
// - camelCase for functions and variables
// - UPPER_CASE for constants

// Proper prop destructuring
const SearchCard = ({ hotel, className = '' }: SearchCardProps) => {
  // Component implementation
};
```

**Styling Guidelines**
```typescript
// Use Tailwind classes consistently
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

```
MIT License

Copyright (c) 2024 SunsetView.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 👨‍💻 Author

**Shahil Suresh**
- Email: getshahilsuresh38@gmail.com
- LinkedIn: [Shahil Suresh](https://linkedin.com/in/shahilsuresh)
- GitHub: [@shahilsuresh](https://github.com/shahilsuresh)
- Portfolio: [shahilsuresh.dev](https://shahilsuresh.dev)

### About the Developer
Passionate full-stack developer with expertise in React, TypeScript, and modern web technologies. Creator of SunsetView.com, dedicated to building user-friendly applications that solve real-world problems.

## 🌐 Live Demo

- **Production Site**: https://sunsetview.com
- **Staging Environment**: https://staging.sunsetview.com
- **API Documentation**: https://api.sunsetview.com/docs

---

**Ready to build amazing hotel booking experiences? Let's get started! 🚀**

⭐ If you find this project helpful, please consider giving it a star on GitHub!

*Last updated: January 2025 | Version: 2.0.0*