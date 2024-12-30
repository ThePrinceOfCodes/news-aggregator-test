export interface NewsArticle {
  id: number
  title: string
  image_url: string
  pub_date: string
  headline: string
  content: string
  author: string
  source: string
  category_id: number
  category: {
    name: string
    id: number
  }
}