import { Outlet } from 'react-router-dom';
import EnhancedNavbar from '../components/common/EnhancedNavbar';
import Footer from '../components/common/Footer';
import BackToTop from '../components/common/BackToTop';
import AIChatWidget from '../components/common/AIChatWidget';
import DemoBookingForm from '../components/forms/DemoBookingForm';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <EnhancedNavbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <BackToTop />
      <AIChatWidget />
      <DemoBookingForm />
    </div>
  );
};

export default MainLayout;
