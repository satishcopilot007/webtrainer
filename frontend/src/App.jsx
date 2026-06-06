import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Loader from './components/common/Loader';
import ErrorBoundary from './components/common/ErrorBoundary';

// Main Pages
const HomePage = lazy(() => import('./pages/HomePage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const CourseCatalogPage = lazy(() => import('./pages/CourseCatalogPage'));
const CourseDetailPage = lazy(() => import('./pages/CourseDetailPage'));
const DynamicCourseDetailPage = lazy(() => import('./pages/DynamicCourseDetailPageV2'));
const CourseCategoryPage = lazy(() => import('./pages/CourseCategoryPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const BlogListPage = lazy(() => import('./pages/BlogListPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogPostDetailPage = lazy(() => import('./pages/BlogPostDetailPage'));
const SuccessStoriesPage = lazy(() => import('./pages/SuccessStoriesPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const PlacementsPage = lazy(() => import('./pages/PlacementsPage'));
const TestimonialsPage = lazy(() => import('./pages/TestimonialsPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const CartPage = lazy(() => import('./pages/CartPage'));

// New Navigation Pages
const CertificatePage = lazy(() => import('./pages/CertificatePage'));
const WebinarPage = lazy(() => import('./pages/WebinarPage'));
const CorporatePage = lazy(() => import('./pages/CorporatePage'));
const CSRPage = lazy(() => import('./pages/CSRPage'));
const FreeCoursesPage = lazy(() => import('./pages/FreeCoursesPage'));
const FeedbackPage = lazy(() => import('./pages/FeedbackPage'));
const ReferralPage = lazy(() => import('./pages/ReferralPage'));
const CareersPage = lazy(() => import('./pages/CareersPage'));
const BookDemoPage = lazy(() => import('./pages/BookDemoPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Specialized Course Category Pages
const JobOrientedCoursesPage = lazy(() => import('./pages/JobOrientedCoursesPage'));
const ITCoursesPage = lazy(() => import('./pages/ITCoursesPage'));
const NonITCoursesPage = lazy(() => import('./pages/NonITCoursesPage'));
const CorporateCoursesListPage = lazy(() => import('./pages/CorporateCoursesListPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));

function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route element={<MainLayout />}>
            {/* Main Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/courses" element={<CourseCatalogPage />} />
            
            {/* Dynamic Course Detail Routes - Must come first to avoid conflicts */}
            <Route path="/course/:slug" element={<DynamicCourseDetailPage />} />
            
            {/* Dynamic Course Category Routes - All use CourseCatalogPage */}
            <Route path="/courses/:mainCategory" element={<CourseCatalogPage />} />
            <Route path="/courses/category/:categorySlug" element={<CourseCategoryPage />} />
            
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostDetailPage />} />
            <Route path="/success-stories" element={<SuccessStoriesPage />} />
            <Route path="/placements" element={<PlacementsPage />} />
            <Route path="/testimonials" element={<TestimonialsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/book-demo" element={<BookDemoPage />} />

            {/* Cart and Payment Routes */}
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />

            {/* Navigation Routes - Top Row */}
            <Route path="/certificate" element={<CertificatePage />} />
            <Route path="/webinar" element={<WebinarPage />} />
            <Route path="/corporate" element={<CorporatePage />} />
            <Route path="/corporate-training" element={<CorporatePage />} />
            <Route path="/csr" element={<CSRPage />} />
            <Route path="/free-courses" element={<FreeCoursesPage />} />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="/referral" element={<ReferralPage />} />
            <Route path="/careers" element={<CareersPage />} />

            {/* 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
