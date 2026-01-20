import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../api/services/dashboardService';
import { useMemo } from 'react';

export const useDashboard = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardService.getDashboardStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const stats = useMemo(() => {
    if (!data) return null;
    
    return {
      totalStudents: data.totalStudents,
      booksIssued: data.booksIssued,
      attendanceRate: data.attendanceRate,
      feesDue: data.feesDue,
      mealsServed: data.mealsServed,
      salesToday: data.salesToday,
      recentActivities: data.recentActivities || []
    };
  }, [data]);

  return {
    stats,
    isLoading,
    error,
    refetch: () => queryClient.invalidateQueries(['dashboard'])
  };
};