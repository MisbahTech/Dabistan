import { useMutation } from '@tanstack/react-query'
import { getJSON, postJSON } from './apiClient'

// Connection: authentication endpoints for admin access.
export const authApi = {
  login(payload) {
    return postJSON('/auth/login', payload)
  },

  forgotPassword(payload) {
    return postJSON('/auth/forgot-password', payload)
  },

  resetPassword(payload) {
    return postJSON('/auth/reset-password', payload)
  },

  me() {
    return getJSON('/auth/me')
  },
}
export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: (payload) => authApi.forgotPassword(payload),
  })
}

export function useResetPasswordMutation() {
  return useMutation({
    mutationFn: (payload) => authApi.resetPassword(payload),
  })
}

