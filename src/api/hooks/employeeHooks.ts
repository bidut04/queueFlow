import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { employeeApi, type CreateEmployeeInput, type UpdateEmployeeInput } from '../employee.api';
import { employeeKeys } from '../queryKeys';
import type { Employee } from '../../types/employee';

/**
 * Hook to fetch all employees.
 * Cached for 5 minutes (staleTime); navigating between pages will not trigger redundant refetches.
 */
export const useEmployees = () => {
  return useQuery({
    queryKey: employeeKeys.lists(),
    queryFn: () => employeeApi.getEmployees(),
  });
};

/**
 * Hook to fetch an employee by id.
 */
export const useEmployee = (id: string) => {
  return useQuery({
    queryKey: employeeKeys.detail(id),
    queryFn: () => employeeApi.getEmployeeById(id),
    enabled: Boolean(id),
  });
};

/**
 * Hook to create a new employee.
 * Automatically invalidates employee list cache upon success.
 */
export const useCreateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateEmployeeInput) => employeeApi.createEmployee(input),
    onSuccess: (newEmployee) => {
      // Optimistically update or invalidate employee list
      queryClient.setQueryData<Employee[]>(employeeKeys.lists(), (old) => {
        return old ? [newEmployee, ...old] : [newEmployee];
      });
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
    },
  });
};

/**
 * Hook to update an existing employee.
 * Invalidates both the list cache and the specific employee detail cache.
 */
export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateEmployeeInput) => employeeApi.updateEmployee(input),
    onSuccess: (updatedEmployee) => {
      queryClient.setQueryData<Employee[]>(employeeKeys.lists(), (old) => {
        return old ? old.map((e) => (e.id === updatedEmployee.id ? updatedEmployee : e)) : [updatedEmployee];
      });
      queryClient.setQueryData(employeeKeys.detail(updatedEmployee.id), updatedEmployee);
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
    },
  });
};

/**
 * Hook to delete an employee.
 * Immediately removes employee from local cache and triggers backend delete.
 */
export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => employeeApi.deleteEmployee(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData<Employee[]>(employeeKeys.lists(), (old) => {
        return old ? old.filter((e) => e.id !== id && e.employeeId !== id) : [];
      });
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
    },
  });
};
