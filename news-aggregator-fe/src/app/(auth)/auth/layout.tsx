import React from 'react'

export default function layout ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className='flex h-full py-5'>
      <div className='w-full lg:w-1/3 h-full'>
        {children}
      </div>
      <div className='flex-1 h-full lg:block hidden rounded-3xl bg-brand-darker'></div>
    </div>
  )
}
