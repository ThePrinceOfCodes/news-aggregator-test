import Link from 'next/link'
import React from 'react'

export default function NavAuthButtons () {
  return (
    <div className='flex gap-2'>
      <Link className='h-12 flex justify-center items-center px-8 rounded-3xl' href="/auth/login">Login</Link>
      <Link className='h-12 flex justify-center bg-brand-darker text-brand-light items-center px-8 rounded-3xl' href="/auth/signup">Create account</Link>
    </div>
  )
}
