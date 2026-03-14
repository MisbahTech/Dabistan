import * as mostReadRepository from '../repositories/mostRead.repository.js'
import { IMostRead } from '../models/MostRead.js'

export const mostReadService = {
  list(filters: mostReadRepository.ListMostReadOptions = {}): Promise<IMostRead[] | mostReadRepository.ListMostReadResult> {
    return mostReadRepository.listMostRead(filters)
  },

  getById(id: number): Promise<IMostRead | null> {
    return mostReadRepository.getMostReadById(id)
  },

  create(payload: mostReadRepository.CreateMostReadData): Promise<any> {
    return mostReadRepository.createMostRead(payload)
  },

  update(id: number, payload: Partial<mostReadRepository.CreateMostReadData>): Promise<IMostRead | null> {
    return mostReadRepository.updateMostRead(id, payload)
  },

  remove(id: number): Promise<IMostRead | null> {
    return mostReadRepository.deleteMostRead(id)
  },
}
