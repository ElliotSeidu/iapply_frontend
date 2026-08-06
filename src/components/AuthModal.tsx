import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Mail, Lock, User, ShieldCheck, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { loginSchema, registerSchema, type LoginFormValues, type RegisterFormValues } from '../schemas/auth';
import { getPasswordStrength } from '../utils/validation';
import { FormField, inputClass } from './ui/FormField';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage, verifyRegisterRequest } from '../lib/api';
import { setAccessToken, setRefreshToken } from '../lib/tokenStore';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register: registerUser, refreshUser } = useAuth();
  const [awaitingVerification, setAwaitingVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState<string | null>(null);
  const [verificationPassword, setVerificationPassword] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
  });

  if (!isOpen) return null;

  const watchedPassword = registerForm.watch('password') || '';
  const passwordStrength = getPasswordStrength(watchedPassword);

  const switchMode = (next: 'login' | 'register') => {
    setMode(next);
    setServerError(null);
    loginForm.clearErrors();
    registerForm.clearErrors();
  };

  const onLoginSubmit = loginForm.handleSubmit(async (values) => {
    setServerError(null);
    try {
      await login(values.email, values.password);
      onClose();
      loginForm.reset();
    } catch (err) {
      setServerError(getErrorMessage(err, 'Invalid email or password.'));
    }
  });

  const onRegisterSubmit = registerForm.handleSubmit(async (values) => {
    setServerError(null);
    try {
      await registerUser(values);
      // show verification step
      setVerificationEmail(values.email);
      setVerificationPassword(values.password);
      setAwaitingVerification(true);
    } catch (err) {
      setServerError(getErrorMessage(err, 'Could not create your account. Please try again.'));
    }
  });

  const onVerifySubmit = async () => {
    setServerError(null);
    if (!verificationEmail) return;
    try {
      // call verify endpoint which returns access + refresh tokens
      const data = await verifyRegisterRequest({ email: verificationEmail, code: verificationCode });
      if (data.access) setAccessToken(data.access);
      if (data.refresh) setRefreshToken(data.refresh);
      // hydrate user
      await refreshUser();
      setAwaitingVerification(false);
      setVerificationEmail(null);
      setVerificationPassword(null);
      setVerificationCode('');
      registerForm.reset();
      onClose();
    } catch (err) {
      setServerError(getErrorMessage(err, 'Verification failed. Please check the code and try again.'));
    }
  };

  const isSubmitting = mode === 'login' ? loginForm.formState.isSubmitting : registerForm.formState.isSubmitting;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-primary px-6 py-5 text-on-primary relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-on-primary/80 hover:text-on-primary hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-display italic text-2xl font-bold text-inverse-primary">iApply</span>
            <span className="px-2 py-0.5 text-xs font-semibold bg-primary-container text-on-primary-container rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Secure Auth
            </span>
          </div>
          <p className="text-xs text-on-primary/80">
            {mode === 'login' ? 'Sign in to access your application pipeline' : 'Create an account to start tracking'}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex border-b border-outline-variant/30 bg-surface-container-low shrink-0">
          <button
            type="button"
            onClick={() => switchMode('login')}
            className={`flex-1 py-3 text-sm font-semibold transition-colors border-b-2 ${
              mode === 'login'
                ? 'border-primary text-primary bg-surface-container-lowest'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => switchMode('register')}
            className={`flex-1 py-3 text-sm font-semibold transition-colors border-b-2 ${
              mode === 'register'
                ? 'border-primary text-primary bg-surface-container-lowest'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Create Account
          </button>
        </div>

        {mode === 'login' ? (
          <form onSubmit={onLoginSubmit} className="p-6 space-y-4 overflow-y-auto flex-1" noValidate>
            {serverError && (
              <div className="p-3 bg-error-container text-on-error-container rounded-xl text-sm font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{serverError}</span>
              </div>
            )}

            <FormField label="Email Address" required icon={<Mail className="w-5 h-5" />} error={loginForm.formState.errors.email?.message}>
              <input
                type="email"
                autoComplete="email"
                placeholder="alex.rivers@example.com"
                className={inputClass(!!loginForm.formState.errors.email)}
                {...loginForm.register('email')}
              />
            </FormField>

            <FormField label="Password" required icon={<Lock className="w-5 h-5" />} error={loginForm.formState.errors.password?.message}>
              <input
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••••••"
                className={inputClass(!!loginForm.formState.errors.password)}
                {...loginForm.register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-2.5 text-outline hover:text-on-surface"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </FormField>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 bg-primary text-on-primary font-semibold rounded-xl shadow-md hover:bg-primary-hover active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSubmitting ? 'Signing in…' : 'Sign In Securely'}
            </button>
          </form>
        ) : (
          {!awaitingVerification ? (
            <form onSubmit={onRegisterSubmit} className="p-6 space-y-4 overflow-y-auto flex-1" noValidate>
            {serverError && (
              <div className="p-3 bg-error-container text-on-error-container rounded-xl text-sm font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{serverError}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <FormField label="First Name" required icon={<User className="w-5 h-5" />} error={registerForm.formState.errors.first_name?.message}>
                <input
                  type="text"
                  autoComplete="given-name"
                  placeholder="Alex"
                  className={inputClass(!!registerForm.formState.errors.first_name)}
                  {...registerForm.register('first_name')}
                />
              </FormField>
              <FormField label="Last Name" required error={registerForm.formState.errors.last_name?.message}>
                <input
                  type="text"
                  autoComplete="family-name"
                  placeholder="Rivers"
                  className={inputClass(!!registerForm.formState.errors.last_name, false)}
                  {...registerForm.register('last_name')}
                />
              </FormField>
            </div>

            <FormField label="Email Address" required icon={<Mail className="w-5 h-5" />} error={registerForm.formState.errors.email?.message}>
              <input
                type="email"
                autoComplete="email"
                placeholder="alex.rivers@example.com"
                className={inputClass(!!registerForm.formState.errors.email)}
                {...registerForm.register('email')}
              />
            </FormField>

            <div>
              <FormField label="Password" required icon={<Lock className="w-5 h-5" />} error={registerForm.formState.errors.password?.message}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="••••••••••••"
                  className={inputClass(!!registerForm.formState.errors.password)}
                  {...registerForm.register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-2.5 text-outline hover:text-on-surface"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </FormField>

              {watchedPassword.length > 0 && (
                <div className="mt-2 p-2.5 bg-surface-container-low rounded-xl space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-on-surface-variant">Password Strength:</span>
                    <span className="font-bold" style={{ color: passwordStrength.color }}>
                      {passwordStrength.label} ({passwordStrength.score}%)
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-outline-variant/30 rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all duration-300"
                      style={{ width: `${passwordStrength.score}%`, backgroundColor: passwordStrength.color }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-[11px] text-on-surface-variant pt-1">
                    <span className={passwordStrength.hasMinLength ? 'text-secondary font-medium' : 'text-outline'}>
                      {passwordStrength.hasMinLength ? '✓' : '•'} 8+ Characters
                    </span>
                    <span className={passwordStrength.hasUppercase ? 'text-secondary font-medium' : 'text-outline'}>
                      {passwordStrength.hasUppercase ? '✓' : '•'} Uppercase Letter
                    </span>
                    <span className={passwordStrength.hasNumber ? 'text-secondary font-medium' : 'text-outline'}>
                      {passwordStrength.hasNumber ? '✓' : '•'} Number
                    </span>
                    <span className={passwordStrength.hasSpecialChar ? 'text-secondary font-medium' : 'text-outline'}>
                      {passwordStrength.hasSpecialChar ? '✓' : '•'} Special Symbol
                    </span>
                  </div>
                </div>
              )}
            </div>

            <FormField label="Confirm Password" required icon={<Lock className="w-5 h-5" />} error={registerForm.formState.errors.password2?.message}>
              <input
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="••••••••••••"
                className={inputClass(!!registerForm.formState.errors.password2)}
                {...registerForm.register('password2')}
              />
            </FormField>

            <p className="text-xs text-on-surface-variant leading-tight">
              By creating an account you agree to keep your credentials confidential. iApply never shares your
              application data with third parties.
            </p>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 bg-primary text-on-primary font-semibold rounded-xl shadow-md hover:bg-primary-hover active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSubmitting ? 'Creating account…' : 'Create iApply Account'}
            </button>
            </form>
          ) : (
            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="p-3 bg-surface-container-low rounded-xl text-sm">
                A verification code was sent to <strong>{verificationEmail}</strong>. Enter it below to complete signup.
              </div>

              <FormField label="Verification Code" required icon={<Mail className="w-5 h-5" /> } error={undefined}>
                <input
                  type="text"
                  placeholder="123456"
                  className={inputClass(false)}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                />
              </FormField>

              {serverError && (
                <div className="p-3 bg-error-container text-on-error-container rounded-xl text-sm font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{serverError}</span>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onVerifySubmit}
                  className="flex-1 py-3 bg-primary text-on-primary font-semibold rounded-xl shadow-md hover:bg-primary-hover active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                >
                  Verify & Continue
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAwaitingVerification(false);
                    setVerificationEmail(null);
                    setVerificationPassword(null);
                    setServerError(null);
                  }}
                  className="py-3 px-4 border rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        )}
      </div>
    </div>
  );
};
