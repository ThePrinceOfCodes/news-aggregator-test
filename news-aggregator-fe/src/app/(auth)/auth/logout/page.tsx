"use client"
import { useCustomToast } from '@/hooks/useCustomToast'
import { useFormik } from 'formik'
import Link from 'next/link'
import { setAccount, setToken } from '@/store/slices/user-management'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { destroyCookie } from 'nookies'
import { cookieKey } from '@/constants'

export default function page () {
  const toast = useCustomToast()
  const dispatch = useDispatch()
  const logoutFormik = useFormik({
    initialValues: {
    },
    async onSubmit (values, formikHelpers) {

      toast({
        title: "Logout Completed!!",
        description: 'You have been successfully logged out',
        status: "success"
      })
      dispatch(setAccount(null))
      dispatch(setToken(null))
      destroyCookie(null, cookieKey.authToken, {
        path: "/",
      })
      const elem = document.getElementById("finish")
      if (elem) {
        elem.click()
      }
    },
  })
  useEffect(() => {
    logoutFormik.submitForm()
  }, [])
  return (
    <div className='h-full w-full flex items-start'>
      <Link href="/" id="finish" />
      <div className='w-9/12 h-auto'>
        <form className='flex flex-col gap-3'>
          Processing....
        </form>
      </div>
    </div>
  )
}
