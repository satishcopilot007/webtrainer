import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/useAuthStore';

const GoogleAuthButton = ({ mode = 'login' }) => {
  const navigate = useNavigate();
  const continueWithGoogle = useAuthStore((state) => state.continueWithGoogle);
  const isLoading = useAuthStore((state) => state.isLoading);
  const isConfigured = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);

  const handleSuccess = async (credentialResponse) => {
    if (!credentialResponse.credential) {
      toast.error('Google did not return a valid sign-in credential.');
      return;
    }

    const result = await continueWithGoogle(credentialResponse.credential);
    if (result.success) {
      toast.success(mode === 'register' ? 'Account ready. Welcome to TrainerMentors!' : 'Login successful!');
      navigate('/dashboard');
      return;
    }

    toast.error(result.error);
  };

  if (!isConfigured) {
    return (
      <button
        type="button"
        disabled
        title="Set VITE_GOOGLE_CLIENT_ID to enable Google sign-in"
        className="w-full py-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-500 font-medium cursor-not-allowed"
      >
        Continue with Google (configuration required)
      </button>
    );
  }

  return (
    <div className={`flex justify-center ${isLoading ? 'pointer-events-none opacity-60' : ''}`}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => toast.error('Google sign-in was cancelled or failed.')}
        text={mode === 'register' ? 'signup_with' : 'continue_with'}
        shape="rectangular"
        size="large"
        theme="outline"
        width="400"
        useOneTap={false}
      />
    </div>
  );
};

export default GoogleAuthButton;
