import { AwilixContainer } from "awilix"
import { Request } from "express"
import { LoggerOptions } from "typeorm"
import { Logger as _Logger } from "winston"

export type ExtendedRequest<TEntity> = Request & { resource: TEntity }

export type ClassConstructor<T> = {
  new (...args: unknown[]): T
}

export type MedusaContainer = AwilixContainer & {
  registerAdd: <T>(name: string, registration: T) => MedusaContainer
}

export type Logger = _Logger & {
  progress: (activityId: string, msg: string) => void
  info: (msg: string) => void
  warn: (msg: string) => void
}

export type ConfigModule = {
  projectConfig: {
    redis_url?: string

    jwt_secret?: string
    cookie_secret?: string

    database_url?: string
    database_type: string
    database_database?: string
    database_logging: LoggerOptions

    database_extra?: Record<string, unknown> & {
      ssl: { rejectUnauthorized: false }
    }
    store_cors?: string
    admin_cors?: string
  }
  services: Record<string, string>
  featureFlags: Record<string, boolean | string>
  plugins: (
    | {
        resolve: string
        options: Record<string, unknown>
      }
    | string
  )[]
}
