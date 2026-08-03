import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Lock, Trash2, Sun, Moon, LogOut, CheckCircle2, AlertCircle, Loader2, Mail } from 'lucide-react';
import {
  changePasswordSchema,
  deleteAccountSchema,
  profileSchema,
  type ChangePasswordFormValues,
  type DeleteAccountFormValues,
  type ProfileFormValues,
} from '../schemas/auth';
import { FormField, inputClass } from './ui/FormField';
import { useAuth } from '../context/AuthContext';
import { changePassword, deleteAccount, getErrorMessage, updateProfile } from '../lib/api';

interface SettingsViewProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onLogout: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ isDarkMode, onToggleDarkMode, onLogout }) => {
  const { user, setUser, logout } = useAuth();
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { first_name: user?.first_name ?? '', last_name: user?.last_name ?? '' },
  });

  const passwordForm = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
  });

  const deleteForm = useForm<DeleteAccountFormValues>({
    resolver: zodResolver(deleteAccountSchema),
  });

  const onProfileSubmit = profileForm.handleSubmit(async (values) => {
    setProfileError(null);
    setProfileSuccess(false);
    try {
      const updated = await updateProfile(values);
      setUser(updated);
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err) {
      setProfileError(getErrorMessage(err, 'Could not update your profile.'));
    }
  });

  const onPasswordSubmit = passwordForm.handleSubmit(async (values) => {
    setPasswordError(null);
    setPasswordSuccess(false);
    try {
      await changePassword(values);
      setPasswordSuccess(true);
      passwordForm.reset();
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err) {
      setPasswordError(getErrorMessage(err, 'Could not change your password. Check your current password.'));
    }
  });

  const onDeleteSubmit = deleteForm.handleSubmit(async (values) => {
    setDeleteError(null);
    try {
      await deleteAccount(values.password);
      await logout();
    } catch (err) {
      setDeleteError(getErrorMessage(err, 'Could not delete your account. Check your password.'));
    }
  });

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20 md:pb-6">
      {/* Account */}
      <section className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-primary" />
          <h2 className="font-bold text-on-surface">Profile</h2>
        </div>

        <div className="flex items-center gap-2 text-xs text-on-surface-variant mb-4 bg-surface-container-low rounded-xl px-3 py-2">
          <Mail className="w-3.5 h-3.5" /> {user?.email} <span className="text-outline">(email cannot be changed here)</span>
        </div>

        <form onSubmit={onProfileSubmit} className="space-y-4" noValidate>
          {profileError && (
            <div className="p-3 bg-error-container text-on-error-container rounded-xl text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" /> {profileError}
            </div>
          )}
          {profileSuccess && (
            <div className="p-3 bg-secondary-container text-on-secondary-container rounded-xl text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" /> Profile updated.
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <FormField label="First Name" required error={profileForm.formState.errors.first_name?.message}>
              <input className={inputClass(!!profileForm.formState.errors.first_name, false)} {...profileForm.register('first_name')} />
            </FormField>
            <FormField label="Last Name" required error={profileForm.formState.errors.last_name?.message}>
              <input className={inputClass(!!profileForm.formState.errors.last_name, false)} {...profileForm.register('last_name')} />
            </FormField>
          </div>
          <button
            type="submit"
            disabled={profileForm.formState.isSubmitting}
            className="px-5 py-2.5 bg-primary text-on-primary text-sm font-semibold rounded-xl hover:bg-primary-hover transition-all flex items-center gap-2 disabled:opacity-60"
          >
            {profileForm.formState.isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Save Profile
          </button>
        </form>
      </section>

      {/* Preferences */}
      <section className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs">
        <h2 className="font-bold text-on-surface mb-4">Preferences</h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-on-surface">
            {isDarkMode ? <Moon className="w-4 h-4 text-primary" /> : <Sun className="w-4 h-4 text-amber-500" />}
            Dark Mode
          </div>
          <button
            onClick={onToggleDarkMode}
            className={`w-11 h-6 rounded-full transition-colors relative ${isDarkMode ? 'bg-primary' : 'bg-outline-variant'}`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                isDarkMode ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </section>

      {/* Security */}
      <section className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="w-5 h-5 text-primary" />
          <h2 className="font-bold text-on-surface">Security</h2>
        </div>
        <form onSubmit={onPasswordSubmit} className="space-y-4" noValidate>
          {passwordError && (
            <div className="p-3 bg-error-container text-on-error-container rounded-xl text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" /> {passwordError}
            </div>
          )}
          {passwordSuccess && (
            <div className="p-3 bg-secondary-container text-on-secondary-container rounded-xl text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" /> Password changed successfully.
            </div>
          )}
          <FormField label="Current Password" required error={passwordForm.formState.errors.old_password?.message}>
            <input type="password" autoComplete="current-password" className={inputClass(!!passwordForm.formState.errors.old_password, false)} {...passwordForm.register('old_password')} />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="New Password" required error={passwordForm.formState.errors.new_password?.message}>
              <input type="password" autoComplete="new-password" className={inputClass(!!passwordForm.formState.errors.new_password, false)} {...passwordForm.register('new_password')} />
            </FormField>
            <FormField label="Confirm New Password" required error={passwordForm.formState.errors.new_password2?.message}>
              <input type="password" autoComplete="new-password" className={inputClass(!!passwordForm.formState.errors.new_password2, false)} {...passwordForm.register('new_password2')} />
            </FormField>
          </div>
          <button
            type="submit"
            disabled={passwordForm.formState.isSubmitting}
            className="px-5 py-2.5 bg-primary text-on-primary text-sm font-semibold rounded-xl hover:bg-primary-hover transition-all flex items-center gap-2 disabled:opacity-60"
          >
            {passwordForm.formState.isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Change Password
          </button>
        </form>

        <button
          onClick={onLogout}
          className="mt-4 flex items-center gap-2 text-sm font-semibold text-on-surface-variant hover:text-error transition-colors"
        >
          <LogOut className="w-4 h-4" /> Sign out of this device
        </button>
      </section>

      {/* Danger zone */}
      <section className="bg-error-container/30 border border-error/30 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-2">
          <Trash2 className="w-5 h-5 text-error" />
          <h2 className="font-bold text-error">Danger Zone</h2>
        </div>
        <p className="text-xs text-on-surface-variant mb-4">
          Deleting your account permanently removes your profile and every application, reminder, and status
          history you've recorded. This cannot be undone.
        </p>
        <form onSubmit={onDeleteSubmit} className="space-y-3" noValidate>
          {deleteError && (
            <div className="p-3 bg-error-container text-on-error-container rounded-xl text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" /> {deleteError}
            </div>
          )}
          <FormField label="Your Password" required error={deleteForm.formState.errors.password?.message}>
            <input type="password" autoComplete="current-password" className={inputClass(!!deleteForm.formState.errors.password, false)} {...deleteForm.register('password')} />
          </FormField>
          <FormField label='Type "DELETE" to confirm' required error={deleteForm.formState.errors.confirmation?.message}>
            <input type="text" className={inputClass(!!deleteForm.formState.errors.confirmation, false)} {...deleteForm.register('confirmation')} />
          </FormField>
          <button
            type="submit"
            disabled={deleteForm.formState.isSubmitting}
            className="px-5 py-2.5 bg-error text-white text-sm font-semibold rounded-xl hover:bg-error-hover transition-all flex items-center gap-2 disabled:opacity-60"
          >
            {deleteForm.formState.isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Permanently Delete Account
          </button>
        </form>
      </section>
    </div>
  );
};
