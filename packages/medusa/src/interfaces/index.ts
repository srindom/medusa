import { EntityManager } from "typeorm"

export * from "./tax-calculation-strategy"
export * from "./cart-completion-strategy"
export * from "./tax-service"
export * from "./transaction-base-service"
export * from "./batch-job-strategy"
export * from "./file-service"
export * from "./notification-service"
export * from "./price-selection-strategy"
export * from "./models/base-entity"
export * from "./models/soft-deletable-entity"
export * from "./search-service"
export * from "./payment-service"

type User = {
  id: string
  name: string
  email: string
  password_hash: string
}

export interface UserService {
  withTransaction: (transaction: EntityManager) => UserService
  retrieve: (id: string, config?: unknown) => Promise<User>
  create: (data: unknown, password: string) => Promise<User>
  list: (selector: unknown, config?: unknown) => Promise<User[]>
  update: (id: string, data: unknown) => Promise<User>
  retrieveByApiToken: (apiToken: string, config?: unknown) => Promise<User>
  retrieveByEmail: (email: string, config?: unknown) => Promise<User>
  setPassword_: (userId: string, password: string) => Promise<User>
  generateResetPasswordToken: (userId: string) => Promise<void>
  delete: (id: string) => Promise<void>
}
