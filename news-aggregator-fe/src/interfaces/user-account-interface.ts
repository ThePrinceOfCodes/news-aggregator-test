export interface Account {
  id: number
  name: string
  email: string
  email_verified_at: string | null
  created_at: string
  updated_at: string
  preferences: {
    author: string[]
    source: string[]
    category: number[]
  } | null
}


export interface UserManagementStoreData {
  account: Account | null
  token: string | null
}

export interface CreateAccountPayload {
  name: string
  email: string
  password_confirmation: string
  password: string
}

export interface LoginAccountResult {
  user: Account
  token: string
}