import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  FiBell, FiBookOpen, FiChevronRight, FiEdit3, FiGift, FiGrid, FiHome, FiLayers, FiLogOut,
  FiMenu, FiMessageSquare, FiStar, FiUsers, FiX,
} from 'react-icons/fi';
import useAuthStore from '../store/useAuthStore';

const navItems = [
  { to: '/admin', end: true, label: 'Overview', icon: FiGrid },
  { to: '/admin/tutors', label: 'Tutors', icon: FiUsers },
  { to: '/admin/categories', label: 'Categories', icon: FiLayers },
  { to: '/admin/courses', label: 'Courses', icon: FiBookOpen },
  { to: '/admin/free-courses', label: 'Free Courses', icon: FiGift },
  { to: '/admin/founders', label: 'Founders', icon: FiStar },
  { to: '/admin/blogs', label: 'Blogs', icon: FiEdit3 },
  { to: '/admin/feedback', label: 'Feedback', icon: FiMessageSquare },
  { to: '/admin/notifications', label: 'Notifications', icon: FiBell },
  { to: '/admin/records', label: 'Operations', icon: FiHome },
];

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => setSidebarOpen(false), [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  const sidebar = (
    <aside className="flex h-full w-[280px] flex-col bg-slate-950 text-white">
      <div className="flex h-20 items-center justify-between border-b border-white/10 px-5">
        <NavLink to="/admin" className="flex items-center gap-3" aria-label="TrainerMentors admin home">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-400 font-display text-lg font-black shadow-lg shadow-violet-950/40">TM</span>
          <span>
            <span className="block font-display text-sm font-bold tracking-wide">TrainerMentors</span>
            <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-violet-300">Admin Console</span>
          </span>
        </NavLink>
        <button type="button" onClick={() => setSidebarOpen(false)} className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white lg:hidden" aria-label="Close navigation"><FiX /></button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4" aria-label="Admin navigation">
        <p className="px-3 pb-2 pt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Workspace</p>
        {navItems.map(({ to, end, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => `group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${isActive ? 'bg-violet-600 text-white shadow-lg shadow-violet-950/30' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
          >
            <Icon className="text-lg" aria-hidden="true" />
            <span className="flex-1">{label}</span>
            <FiChevronRight className="opacity-0 transition group-hover:opacity-70" aria-hidden="true" />
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/10 p-4">
        <a href="/" className="mb-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white">
          <FiHome /> View public site
        </a>
        <button type="button" onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-rose-300 transition hover:bg-rose-500/10 hover:text-rose-200">
          <FiLogOut /> Sign out
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Helmet><title>Admin Console | TrainerMentors</title><meta name="robots" content="noindex,nofollow" /></Helmet>
      <div className="fixed inset-y-0 left-0 z-40 hidden lg:block">{sidebar}</div>
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} aria-label="Close navigation overlay" />
          <div className="relative h-full w-[280px] shadow-2xl">{sidebar}</div>
        </div>
      )}

      <div className="lg:pl-[280px]">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setSidebarOpen(true)} className="rounded-xl border border-slate-200 p-2.5 text-slate-700 hover:bg-slate-50 lg:hidden" aria-label="Open navigation"><FiMenu className="text-lg" /></button>
            <div className="hidden sm:block">
              <p className="text-xs font-medium text-slate-400">Secure administration</p>
              <p className="text-sm font-semibold text-slate-800">Content & operations</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
              <p className="text-xs text-slate-400">Administrator</p>
            </div>
            <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-violet-100 to-cyan-100 text-sm font-bold text-violet-700 ring-4 ring-white">
              {(user?.name || 'A').split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()}
            </span>
          </div>
        </header>
        <main className="mx-auto max-w-[1600px] p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
