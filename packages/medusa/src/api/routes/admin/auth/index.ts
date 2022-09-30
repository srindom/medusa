import { Router } from "express"
import middlewares from "../../../middlewares"

const route = Router()

type User = {
  id: string
  name: string
  email: string
  password_hash: string
}

export default (app) => {
  app.use("/auth", route)

  route.get(
    "/",
    middlewares.authenticate(),
    middlewares.wrap(require("./get-session").default)
  )
  route.post("/", middlewares.wrap(require("./create-session").default))

  route.delete(
    "/",
    middlewares.authenticate(),
    middlewares.wrap(require("./delete-session").default)
  )

  return app
}

export type AdminAuthRes = {
  user: Omit<User, "password_hash">
}

export * from "./create-session"
export * from "./delete-session"
export * from "./get-session"
