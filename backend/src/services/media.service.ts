import * as mediaRepository from '../repositories/media.repository.js'
import { IMediaItem } from '../models/MediaItem.js'

export const mediaService = {
  list(filters: mediaRepository.ListMediaItemsOptions = {}): Promise<IMediaItem[] | mediaRepository.ListMediaItemsResult> {
    return mediaRepository.listMediaItems(filters)
  },

  getById(id: number): Promise<IMediaItem | null> {
    return mediaRepository.getMediaItemById(id)
  },

  create(payload: mediaRepository.CreateMediaItemData): Promise<any> {
    return mediaRepository.createMediaItem(payload)
  },

  update(id: number, payload: Partial<mediaRepository.CreateMediaItemData>): Promise<IMediaItem | null> {
    return mediaRepository.updateMediaItem(id, payload)
  },

  remove(id: number): Promise<IMediaItem | null> {
    return mediaRepository.deleteMediaItem(id)
  },
}
