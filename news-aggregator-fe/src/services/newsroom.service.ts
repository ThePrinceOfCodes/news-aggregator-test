import { useMutation, useQuery } from "@tanstack/react-query"
import http from './base'
import { queryClient } from '@/config/ReactQueryClient'
import { PaginationResult } from '@/interfaces/pagination'
import { NewsArticle } from '@/interfaces/news-data-interface'


export const useGetNewsHeadlines = ({ page, page_size, search, authed, category, source, pubDate }: { page?: number, page_size?: number, search?: string, pubDate?: string, source?: string, category?: string, authed?: boolean }) =>
  useQuery<PaginationResult<NewsArticle>>({
    queryKey: ["news-articles", { page, page_size, search, authed, category, source, pubDate }],
    queryFn: async () => http.get({
      url: "/" + (authed ? 'news-headlines-user' : 'news-headlines'),
      query: {
        page, perPage: page_size, search, categoryFilter: category, sourceFilter: source, pubDateFilter: pubDate
      }
    }),
  })


export const useSavePreferences = () =>
  useMutation<any, string, { author: string[], source: string[] }>({
    onSuccess (data, variables, context) {
      queryClient.invalidateQueries({
        queryKey: ["news-preferences"],
      })
    },
    mutationFn: async (props) =>
    (await http.post({
      url: "/preferences",
      body: props
    })),
  })

export const useGetNewsById = (id: number) =>
  useQuery<NewsArticle>({
    queryKey: ["news-articles-by-id", { id }],
    queryFn: async () => http.get({
      url: "/news/" + id,
    }),
  })


export const useGetNewsPreferencesData = (disabled?: boolean) =>
  useQuery<{ categories: { id: number, name: string }[], sources: string[] }>({
    queryKey: ["news-preferences"],
    enabled: !disabled,
    queryFn: async () => http.get({
      url: "/news-data",
    }),
  })
