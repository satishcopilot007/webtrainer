import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { FiArrowLeft, FiLock, FiMail, FiShield } from 'react-icons/fi';
import useAuthStore from '../../store/useAuthStore';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const isLoading = useAuthStore((state) => state.isLoading);
  const user = useAuthStore((state) => state.user);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(searchParams.get('expired') ? 'Your session expired. Sign in again to continue.' : '');

  useEffect(() => {
    if (user?.role === 'admin') navigate('/admin', { replace: true });
  }, [navigate, user]);

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    const result = await login(form);
    if (!result.success) {
      setError(result.error);
      return;
    }
    if (result.user?.role !== 'admin') {
      logout();
      setError('This account does not have administrator access.');
      return;
    }
    const destination = location.state?.from?.startsWith('/admin') ? location.state.from : '/admin';
    navigate(destination, { replace: true });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-10 text-white sm:px-6">
      <Helmet><title>Admin Sign In | TrainerMentors</title><meta name="robots" content="noindex,nofollow" /></Helmet>
      <div className="pointer-events-none absolute -left-36 -top-36 h-96 w-96 rounded-full bg-violet-600/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-48 -right-24 h-[34rem] w-[34rem] rounded-full bg-cyan-500/15 blur-3xl" />
      <a href="/" className="relative mx-auto flex max-w-6xl items-center gap-2 text-sm font-semibold text-slate-300 transition hover:text-white">
        <FiArrowLeft /> Back to TrainerMentors
      </a>
      <main className="relative mx-auto grid min-h-[calc(100vh-100px)] max-w-6xl items-center gap-12 lg:grid-cols-2">
        <section className="hidden lg:block">
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-violet-200"><FiShield /> Restricted workspace</span>
          <h1 className="mt-6 max-w-lg font-display text-5xl font-bold leading-tight">Manage learning operations with confidence.</h1>
          <p className="mt-5 max-w-lg text-lg leading-8 text-slate-400">A secure console for courses, tutors, syllabus content, feedback, and business activity.</p>
          <div className="mt-10 grid max-w-lg grid-cols-3 gap-3">
            {['Role verified', 'Audited changes', 'Protected APIs'].map((item) => <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm font-semibold text-slate-200">{item}</div>)}
          </div>
        </section>

        <section className="mx-auto w-full max-w-md rounded-[2rem] border border-white/10 bg-white p-6 text-slate-900 shadow-2xl shadow-black/40 sm:p-8">
          <div className="mb-8">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-violet-600 to-violet-800 text-2xl text-white shadow-lg shadow-violet-200"><FiShield /></span>
            <h2 className="mt-5 font-display text-2xl font-bold">Administrator sign in</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">Use an existing account assigned the admin role. No credentials are created by this portal.</p>
          </div>

          {error && <div role="alert" className="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</div>}
          <form onSubmit={submit} className="space-y-5">
            <label className="block text-sm font-semibold text-slate-700">
              Email address
              <span className="relative mt-1.5 block">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="email" required autoComplete="username" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="h-12 w-full rounded-xl border border-slate-200 pl-10 pr-3 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100" placeholder="admin@company.com" />
              </span>
            </label>
            <label className="block text-sm font-semibold text-slate-700">
              Password
              <span className="relative mt-1.5 block">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="password" required minLength={6} autoComplete="current-password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} className="h-12 w-full rounded-xl border border-slate-200 pl-10 pr-3 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100" placeholder="Enter your password" />
              </span>
            </label>
            <button type="submit" disabled={isLoading} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 font-semibold text-white transition hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-200 disabled:cursor-not-allowed disabled:opacity-60">
              {isLoading ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> Verifying…</> : <><FiShield /> Enter secure console</>}
            </button>
          </form>
          <p className="mt-6 text-center text-xs leading-5 text-slate-400">Access is checked against the live user role on every admin API request.</p>
        </section>
      </main>
    </div>
  );
};

export default AdminLoginPage;
