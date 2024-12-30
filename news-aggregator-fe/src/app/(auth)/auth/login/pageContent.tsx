"use client"
import { CreateAccountPayload } from '@/interfaces/user-account-interface'
import { useLogin } from '@/services/auth.services'
import { validateLoginForm } from '@/validators/auth-validators'
import { useFormik } from 'formik'
import Link from 'next/link'
import React from 'react'
import { setAccount, setToken } from '@/store/slices/user-management'
import { setCookie } from 'nookies'
import { cookieKey } from '@/constants'
import { useDispatch } from 'react-redux'
import { useCustomToast } from '@/hooks/useCustomToast'

export default function LoginPageComponent () {
  const dispatch = useDispatch()
  const { mutateAsync: _loginFunction } = useLogin()
  const toast = useCustomToast()
  const loginFormik = useFormik<Pick<CreateAccountPayload, "email" | "password">>({
    validationSchema: validateLoginForm,
    validateOnMount: true,
    validateOnChange: true,
    initialValues: {
      email: "",
      password: ""
    },
    async onSubmit (values, formikHelpers) {
      const res = await _loginFunction(values)

      toast({
        title: "Login Completed!!",
        description: 'You have been successfully logged in',
        status: "success"
      })
      dispatch(setAccount(res.user))
      dispatch(setToken(res.token))
      setCookie(null, cookieKey.authToken, res.token, {
        path: "/",
      })
      const elem = document.getElementById("finish")
      if (elem) {
        elem.click()
      }
    },
  })
  return (
    <div className='h-full w-full flex items-center lg:justify-center'>
      <Link href="/" id="finish" />
      <div className='w-9/12 h-auto'>
        <form className='flex flex-col gap-3' onSubmit={loginFormik.handleSubmit}>
          <div className='w-full flex flex-col'>
            <label className='poppins-light' htmlFor="email">Email address</label>
            <input type="text" onChange={loginFormik.handleChange} id="email" value={loginFormik.values.email} className='h-12 text-brand-darker poppins-regular text-base outline-none focus-within:outline-none rounded-md px-3' placeholder='Enter email address' />
          </div>

          <div className='w-full flex flex-col'>
            <label className='poppins-light' htmlFor="password">Password</label>
            <input type="password" onChange={loginFormik.handleChange} id="password" value={loginFormik.values.password} className='h-12 poppins-regular text-brand-darker text-base outline-none focus-within:outline-none rounded-md px-3' placeholder='*********' />
          </div>
          <button disabled={!loginFormik.isValid || loginFormik.isSubmitting} type='submit' className='w-full h-12 bg-brand-darker disabled:bg-brand-darker/50 hover:bg-brand-dark border-2 border-brand-dark poppins-regular rounded-full'>
            Login
          </button>
        </form>
      </div>
    </div>
  )
}
