import { Account, LoginAccountResult, } from '@/interfaces/user-account-interface'
import { useMutation, useQuery } from "@tanstack/react-query"
import http from './base'
import { CreateAccountPayload } from '@/interfaces/user-account-interface'


export const useLogin = () =>
  useMutation<LoginAccountResult, string, Pick<CreateAccountPayload, "email" | "password">>({
    mutationFn: async (props) => await http.post({
      url: "/login",
      body: props
    }),
  })


export const useRegister = () =>
  useMutation<LoginAccountResult, string, CreateAccountPayload>({
    mutationFn: async (props) =>
      (await http.post({
        url: "/register",
        body: props
      })).data,
  })

export const useUpdateAccountPassword = () =>
  useMutation<Account, string, Pick<CreateAccountPayload, "password"> & { oldPassword: string }>({
    mutationFn: async (props) =>
      (await http.post({
        url: '/accounts/change-password',
        body: props
      })).data,
  })