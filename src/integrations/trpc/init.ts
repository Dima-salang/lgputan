import type { Db } from '../../db'

export interface Context {
  db: Db
  headers: Headers
}