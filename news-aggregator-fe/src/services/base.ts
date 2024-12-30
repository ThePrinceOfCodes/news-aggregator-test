import qs from "query-string"
import axios from 'axios'
import { parseCookies } from "nookies"

import type { IPut, IGet, IPost, IPatch, IDelete, IPostMultipart } from '@/interfaces/i-axios'
import { redirect } from 'next/navigation'
import { cookieKey } from '@/constants'


class HttpFacade {
  private http
  private baseUrl = process.env.NEXT_PUBLIC_BASE_URL



  constructor() {
    this.http = axios.create({
      baseURL: this.baseUrl,
      headers: { 'Content-Type': 'application/json' },
    })

    this.http.interceptors.request.use(
      (config) => {
        if (!config.headers.get('Authorization')) {
          if (typeof window !== 'undefined') {
            try {
              const cookies = parseCookies()

              if (cookies[cookieKey.authToken]) {
                config.headers['Authorization'] = `Bearer ${cookies[cookieKey.authToken]}`
              }
            } catch (error) {
              console.log(error)
            }
          }
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    this.http.interceptors.response.use(
      async (response) => {
        return response
      },
      async (error) => {
        const { response } = error
        if (response && response.data) {
          if (response.data.code === 110) {
            // token revoked, log user out
            if (typeof window !== undefined) {
              window.location.href = "/logout?code=access_revoked"
            } else {
              redirect("/logout")
            }

          } else {
            return Promise.reject(response.data)
          }
        }
      }
    )
  }

  post = async ({ url, body, headers = {} }: IPost) => {
    let py = { ...body }
    const response = await this.http.post(url, py, { headers })
    return response.data
  };

  patch = async ({ url, body, headers = {} }: IPatch) => {
    let py = { ...body }
    const response = await this.http.patch(url, py, { headers })
    return response.data
  };

  get = async ({ url, query = {}, body = {}, headers = {} }: IGet) => {
    let py = { ...query }
    const queryString = qs.stringify(py)
    const response = await this.http.get(`${url + '?' + queryString}`, { headers })
    return response.data
  };

  delete = async ({ url, body = {}, headers = {} }: IDelete) => {
    const response = await this.http.delete(url, { headers, data: body })
    return response.data
  };

  put = async ({ url, body, headers = {} }: IPut) => {
    let py = { ...body }
    const response = await this.http.put(url, py, { headers })
    return response.data
  };
}

const http = new HttpFacade()

export default http
