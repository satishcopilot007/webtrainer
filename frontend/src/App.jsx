import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Loader from './components/common/Loader';
import ErrorBoundary from './components/common/ErrorBoundary';
import AdminGuard from './components/admin/AdminGuard';

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
const FreeCourseTopicPage = lazy(() => import('./pages/FreeCourseTopicPage'));
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

// Standalone Admin Portal
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage'));
const AdminOverviewPage = lazy(() => import('./pages/admin/AdminOverviewPage'));
const AdminTutorsPage = lazy(() => import('./pages/admin/AdminTutorsPage'));
const AdminCategoriesPage = lazy(() => import('./pages/admin/AdminCategoriesPage'));
const AdminCoursesPage = lazy(() => import('./pages/admin/AdminCoursesPage'));
const AdminFoundersPage = lazy(() => import('./pages/admin/AdminFoundersPage'));
const AdminBlogsPage = lazy(() => import('./pages/admin/AdminBlogsPage'));
const AdminFeedbackPage = lazy(() => import('./pages/admin/AdminFeedbackPage'));
const AdminNotificationsPage = lazy(() => import('./pages/admin/AdminNotificationsPage'));
const AdminRecordsPage = lazy(() => import('./pages/admin/AdminRecordsPage'));

function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route element={<AdminGuard />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminOverviewPage />} />
              <Route path="tutors" element={<AdminTutorsPage />} />
              <Route path="categories" element={<AdminCategoriesPage />} />
              <Route path="courses" element={<AdminCoursesPage />} />
              <Route path="free-courses" element={<AdminCoursesPage freeTutorialOnly />} />
              <Route path="founders" element={<AdminFoundersPage />} />
              <Route path="blogs" element={<AdminBlogsPage />} />
              <Route path="feedback" element={<AdminFeedbackPage />} />
              <Route path="notifications" element={<AdminNotificationsPage />} />
              <Route path="records" element={<AdminRecordsPage />} />
            </Route>
          </Route>
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
            <Route path="/free-courses/:topicSlug" element={<FreeCourseTopicPage />} />
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
