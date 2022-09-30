import { Note } from "../models/note"
import { PartialPick } from "./common"

type User = {
  id: string
  name: string
  email: string
}

export interface CreateNoteInput {
  value: string
  resource_type: string
  resource_id: string
  author_id?: string
  author?: User
  metadata?: Record<string, unknown>
}

export type selector = {
  resource_id?: string
}

export type FilterableUserProps = PartialPick<
  Note,
  | "value"
  | "resource_type"
  | "resource_id"
  | "author_id"
  | "updated_at"
  | "deleted_at"
>
