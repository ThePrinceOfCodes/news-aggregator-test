export interface PaginationInput {
  page?: number
  page_size?: number
  search?: string
}

export interface PaginationResult<T> {
  data: T[]
  current_page: number
  per_page: number
  last_page: number
  total: number
}