import { Customer } from ".."

type User = {
  id: string
  name: string
  email: string
}

export type AuthenticateResult = {
  success: boolean
  user?: User
  customer?: Customer
  error?: string
}
