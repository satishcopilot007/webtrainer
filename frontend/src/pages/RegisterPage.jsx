import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaUserPlus, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';
import useAuthStore from '../store/useAuthStore';
import toast from 'react-hot-toast';

const registerSchema = z.object({
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number').max(15, 'Phone number too long'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  password_confirm: z.string().min(8, 'Please confirm your password'),
}).refine((data) => data.password === data.password_confirm, {
  message: 'Passwords do not match',
  path: ['password_confirm'],
});

const RegisterPage = () => {
  const navigate = useNavigate();
  const registerUser = useAuthStore((s) => s.register);
  const isLoading = useAuthStore((s) => s.isLoading);
  const [serverError, setServerError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
    trigger,
  } = useForm({ resolver: zodResolver(registerSchema), mode: 'onBlur' });

  // Real-time field validation
  useEffect(() => {
    const validateFields = async () => {
      const fieldNames = ['first_name', 'last_name', 'email', 'phone', 'password', 'password_confirm'];
      const newErrors = {};
      
      for (const field of fieldNames) {
        if (touchedFields[field]) {
          const isValid = await trigger(field);
          if (!isValid && errors[field]) {
            newErrors[field] = errors[field].message;
          }
        }
      }
      
      setFieldErrors(newErrors);
    };

    validateFields();
  }, [touchedFields, errors, trigger]);

  const handleFieldBlur = (fieldName) => {
    setTouchedFields(prev => ({ ...prev, [fieldName]: true }));
  };

  const onSubmit = async (data) => {
    setServerError('');
    setFieldErrors({});
    
    // Collect all client-side validation errors
    const clientErrors = {};
    Object.keys(errors).forEach(key => {
      if (errors[key]) {
        clientErrors[key] = errors[key].message;
      }
    });

    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors);
      return;
    }

    const result = await registerUser(data);
    if (result.success) {
      toast.success('Registration successful! Welcome to TrainerMentors.');
      navigate('/dashboard');
    } else {
      // Parse server error and map to fields
      let parsedErrors = result.fieldErrors || {};
      let errorSummary = result.error || 'Registration failed';

      // Also check rawError for errors property
      if (result.rawError?.errors) {
        parsedErrors = { ...parsedErrors, ...result.rawError.errors };
      }

      setFieldErrors(parsedErrors);
      
      // Create detailed error message
      if (Object.keys(parsedErrors).length > 0) {
        const errorLines = Object.entries(parsedErrors)
          .map(([field, message]) => `${field.replace(/_/g, ' ')}: ${message}`);
        errorSummary = errorLines.join(' | ');
      }

      setServerError(errorSummary);
      toast.error('Registration failed. Please fix the errors below.');
    }
  };

  const inputClass = (field) => {
    const hasError = errors[field] || fieldErrors[field];
    return `w-full pl-11 pr-4 py-3 rounded-xl border ${hasError ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'} focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all`;
  };

  const getFieldError = (field) => {
    return errors[field]?.message || fieldErrors[field];
  };

  const hasErrors = Object.keys(errors).length > 0 || Object.keys(fieldErrors).length > 0;

  return (
    <>
      <Helmet>
        <title>Register | TrainerMentors</title>
        <meta name="description" content="Create your TrainerMentors account to access expert-led courses, track your progress, and kickstart your career transformation." />
      </Helmet>

      <section className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg"
        >
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FaUserPlus className="text-2xl text-primary-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Create Account</h1>
              <p className="text-gray-500 text-sm mt-1">Join thousands of learners on TrainerMentors</p>
            </div>

            {/* Server Error with Field Details */}
            {(serverError || hasErrors) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 border-2 border-red-300 rounded-xl"
              >
                <div className="flex gap-3 mb-3">
                  <FaExclamationCircle className="text-red-600 text-lg mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-bold text-red-700">❌ Registration Failed</div>
                    <div className="text-sm text-red-600 mt-1">Please fix the following errors:</div>
                  </div>
                </div>

                {/* Field-specific errors */}
                {(Object.keys(fieldErrors).length > 0 || Object.keys(errors).length > 0) && (
                  <div className="ml-7 space-y-2 mb-3 bg-white p-3 rounded-lg border border-red-200">
                    {Object.entries({ ...fieldErrors, ...errors }).map(([field, error]) => {
                      if (!error) return null;
                      const fieldLabel = field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                      const message = error?.message || error;
                      return (
                        <div key={field} className="flex gap-2 text-sm">
                          <span className="text-red-500 font-semibold flex-shrink-0">•</span>
                          <div>
                            <span className="font-semibold text-gray-800">{fieldLabel}:</span>
                            <span className="text-red-600 ml-1">{message}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {serverError && (
                  <div className="text-xs text-red-600 bg-red-100 p-2 rounded border border-red-200 ml-7">
                    {serverError.split('\n').map((line, idx) => (
                      <div key={idx}>{line}</div>
                    ))}
                  </div>
                )}

                <div className="text-xs mt-3 text-red-600 ml-7 font-medium">
                  💡 Tip: If this persists, contact <a href="mailto:support@trainermentors.com" className="underline font-bold">support@trainermentors.com</a>
                </div>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Name Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    First Name
                    {!getFieldError('first_name') && touchedFields.first_name && (
                      <FaCheckCircle className="text-green-500 text-xs" />
                    )}
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      {...register('first_name')}
                      onBlur={() => handleFieldBlur('first_name')}
                      className={inputClass('first_name')}
                      placeholder="John"
                    />
                  </div>
                  {getFieldError('first_name') && (
                    <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                      <FaExclamationCircle className="text-xs" />
                      {getFieldError('first_name')}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    Last Name
                    {!getFieldError('last_name') && touchedFields.last_name && (
                      <FaCheckCircle className="text-green-500 text-xs" />
                    )}
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      {...register('last_name')}
                      onBlur={() => handleFieldBlur('last_name')}
                      className={inputClass('last_name')}
                      placeholder="Doe"
                    />
                  </div>
                  {getFieldError('last_name') && (
                    <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                      <FaExclamationCircle className="text-xs" />
                      {getFieldError('last_name')}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  Email Address
                  {!getFieldError('email') && touchedFields.email && (
                    <FaCheckCircle className="text-green-500 text-xs" />
                  )}
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    {...register('email')}
                    onBlur={() => handleFieldBlur('email')}
                    className={inputClass('email')}
                    placeholder="you@example.com"
                  />
                </div>
                {getFieldError('email') && (
                  <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                    <FaExclamationCircle className="text-xs" />
                    {getFieldError('email')}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  Phone Number
                  {!getFieldError('phone') && touchedFields.phone && (
                    <FaCheckCircle className="text-green-500 text-xs" />
                  )}
                </label>
                <div className="relative">
                  <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    {...register('phone')}
                    onBlur={() => handleFieldBlur('phone')}
                    className={inputClass('phone')}
                    placeholder="+91 98765 43210"
                  />
                </div>
                {getFieldError('phone') && (
                  <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                    <FaExclamationCircle className="text-xs" />
                    {getFieldError('phone')}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  Password
                  {!getFieldError('password') && touchedFields.password && (
                    <FaCheckCircle className="text-green-500 text-xs" />
                  )}
                </label>
                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    {...register('password')}
                    onBlur={() => handleFieldBlur('password')}
                    className={inputClass('password')}
                    placeholder="••••••••"
                  />
                </div>
                {getFieldError('password') && (
                  <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                    <FaExclamationCircle className="text-xs" />
                    {getFieldError('password')}
                  </p>
                )}
                <p className="text-gray-500 text-xs mt-1">💡 Min 8 characters, mix of letters & numbers recommended</p>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  Confirm Password
                  {!getFieldError('password_confirm') && touchedFields.password_confirm && (
                    <FaCheckCircle className="text-green-500 text-xs" />
                  )}
                </label>
                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    {...register('password_confirm')}
                    onBlur={() => handleFieldBlur('password_confirm')}
                    className={inputClass('password_confirm')}
                    placeholder="••••••••"
                  />
                </div>
                {getFieldError('password_confirm') && (
                  <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                    <FaExclamationCircle className="text-xs" />
                    {getFieldError('password_confirm')}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            {/* Login Link */}
            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-500 font-semibold hover:underline">
                Log In
              </Link>
            </p>
          </div>
        </motion.div>
      </section>
    </>
  );
};

export default RegisterPage;
