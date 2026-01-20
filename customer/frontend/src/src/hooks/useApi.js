import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

export const useApi = (apiFunction, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiFunction(...args);
      setData(response);
      
      if (options.showSuccessToast) {
        toast.success(options.successMessage || 'Operation successful');
      }
      
      return response;
    } catch (err) {
      setError(err);
      
      if (options.showErrorToast !== false) {
        toast.error(err.message || 'An error occurred');
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction, options]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
    setData
  };
};