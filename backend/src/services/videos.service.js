import * as videosRepository from '../repositories/videos.repository.js'

export const videosService = {
  list(filters) {
    return videosRepository.listVideos(filters)
  },

  getById(id) {
    return videosRepository.getVideoById(id)
  },

  create(payload) {
    return videosRepository.createVideo(payload)
  },

  update(id, payload) {
    return videosRepository.updateVideo(id, payload)
  },

  remove(id) {
    return videosRepository.deleteVideo(id)
  },
}
