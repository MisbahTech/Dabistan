import * as videosRepository from '../repositories/videos.repository.js'
import { IVideo } from '../models/Video.js'

export const videosService = {
  list(filters: videosRepository.ListVideosOptions = {}): Promise<IVideo[] | videosRepository.ListVideosResult> {
    return videosRepository.listVideos(filters)
  },

  getById(id: number): Promise<IVideo | null> {
    return videosRepository.getVideoById(id)
  },

  create(payload: videosRepository.CreateVideoData): Promise<any> {
    return videosRepository.createVideo(payload)
  },

  update(id: number, payload: Partial<videosRepository.CreateVideoData> & { image?: string | null }): Promise<IVideo | null> {
    return videosRepository.updateVideo(id, payload)
  },

  remove(id: number): Promise<IVideo | null> {
    return videosRepository.deleteVideo(id)
  },
}
