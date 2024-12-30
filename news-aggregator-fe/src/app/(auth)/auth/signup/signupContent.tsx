"use client"
import { useCustomToast } from '@/hooks/useCustomToast'
import { CreateAccountPayload } from '@/interfaces/user-account-interface'
import { useRegister } from '@/services/auth.services'
import { validateCreateAccountForm } from '@/validators/auth-validators'
import { useFormik } from 'formik'
import Link from 'next/link'
import React from 'react'

export default function SignupPageComponent () {
  const { mutateAsync: _registerFunction } = useRegister()
  const toast = useCustomToast()
  const loginFormik = useFormik<CreateAccountPayload>({
    validationSchema: validateCreateAccountForm,
    validateOnMount: true,
    validateOnChange: true,
    initialValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: ""
    },
    async onSubmit (values, formikHelpers) {
      await _registerFunction(values)

      toast({
        title: "Signup Completed!!",
        description: 'You have successfully registered',
        status: "success"
      })
      const elem = document.getElementById("finish")
      if (elem) {
        elem.click()
      }
    },
  })
  return (
    <div className='h-full w-full flex items-center lg:justify-center'>
      <div className='w-9/12 h-auto'>
        <Link href="/auth/login" id="finish" />
        <form className='flex flex-col gap-3' onSubmit={loginFormik.handleSubmit}>
          <div className='w-full flex flex-col'>
            <label className='poppins-light' htmlFor="email">Full name</label>
            <input type="text" onChange={loginFormik.handleChange} id="name" value={loginFormik.values.name} className='h-12 text-brand-darker poppins-regular text-base outline-none focus-within:outline-none rounded-md px-3' placeholder='Enter your name' />
          </div>
          <div className='w-full flex flex-col'>
            <label className='poppins-light' htmlFor="email">Email address</label>
            <input type="text" onChange={loginFormik.handleChange} id="email" value={loginFormik.values.email} className='h-12 text-brand-darker poppins-regular text-base outline-none focus-within:outline-none rounded-md px-3' placeholder='Enter email address' />
          </div>

          <div className='w-full flex flex-col'>
            <label className='poppins-light' htmlFor="password">Password</label>
            <input type="password" onChange={loginFormik.handleChange} id="password" value={loginFormik.values.password} className='h-12 poppins-regular text-brand-darker text-base outline-none focus-within:outline-none rounded-md px-3' placeholder='*********' />
          </div>
          <div className='w-full flex flex-col'>
            <label className='poppins-light' htmlFor="password_confirmation">Confirm password</label>
            <input type="password" onChange={loginFormik.handleChange} id="password_confirmation" value={loginFormik.values.password_confirmation} className='h-12 poppins-regular text-brand-darker text-base outline-none focus-within:outline-none rounded-md px-3' placeholder='*********' />
          </div>
          <button disabled={!loginFormik.isValid || loginFormik.isSubmitting} type='submit' className='w-full h-12 bg-brand-darker disabled:bg-brand-darker/50 hover:bg-brand-dark border-2 border-brand-dark poppins-regular rounded-full'>
            Register
          </button>
        </form>
      </div>
    </div>
  )
}
