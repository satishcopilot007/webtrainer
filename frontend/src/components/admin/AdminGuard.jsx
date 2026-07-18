import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import { LoadingState } from './AdminUI';

const AdminGuard = () => {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const fetchProfile = useAuthStore((state) => state.fetchProfile);
  const [checking, setChecking] = useState(Boolean(localStorage.getItem('accessToken')) && !user);
  const [verificationFailed, setVerificationFailed] = useState(false);

  useEffect(() => {
    let active = true;
    if (!localStorage.getItem('accessToken') || user) {
      setChecking(false);
      return () => { active = false; };
    }
    fetchProfile().then((result) => {
      if (!active) return;
      setVerificationFailed(!result.success);
      setChecking(false);
    });
    return () => { active = false; };
  }, [fetchProfile, user]);

  if (!localStorage.getItem('accessToken')) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  if (verificationFailed) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  if (checking || !user) {
    return <div className="min-h-screen bg-slate-50"><LoadingState label="Verifying administrator access…" /></div>;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/dashboard" replace state={{ adminAccessDenied: true }} />;
  }

  return <Outlet />;
};

export default AdminGuard;
