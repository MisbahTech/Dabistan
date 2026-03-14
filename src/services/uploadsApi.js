import { useMutation } from '@tanstack/react-query'
import { postFile } from './apiClient'

export const uploadsApi = {
  upload(file) {
    return postFile('/uploads', file)
  },
}

export function useUploadMutation() {
  return useMutation({
    mutationFn: (file) => uploadsApi.upload(file),
  })
}
