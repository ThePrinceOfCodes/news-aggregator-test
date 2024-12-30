import React from 'react'
import NavAuthButtons from './NavAuthButtons'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import NavProfileSection from './NavProfileSection'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navigation () {
  const account = useSelector((state: RootState) => state.user.account)
  const pathname = usePathname()
  return (
    <div className='h-16 poppins-medium w-screen flex items-center justify-between lg:px-10 px-4'>
      <div className='flex gap-10 items-center'>
        <Link href="/" className='font-bolder poppins-bold text-2xl'>NEWSROOM</Link>
        <div className='flex gap-5'>
          <Link href="/" className={`poppins-bold text-sm ${pathname === "/" ? 'border-b' : ''}`}>Latest</Link>
          {account && <Link href="/feed" className={`poppins-bold text-sm ${pathname === "/feed" ? 'border-b' : ''}`}>My Feed</Link>}
        </div>
      </div>
      <div>
        {account ?
          <NavProfileSection account={account} /> :
          <NavAuthButtons />
        }
      </div>
    </div>
  )
}
