import { useContext } from 'react';
import { ToastContext } from '../context/ToastContext';

/**
 * Custom hook to fire toast notifications from any component.
 * Returns { showToast } — call showToast(message, type) where type is 'success' | 'error' | 'info'.
 */
const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
};

export default useToast;
