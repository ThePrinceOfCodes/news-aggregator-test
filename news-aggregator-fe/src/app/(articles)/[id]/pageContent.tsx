"use client"
import { useGetNewsById, useSavePreferences } from '@/services/newsroom.service'
import { useParams } from 'next/navigation'
import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { setAccount } from '@/store/slices/user-management'
import { useInView } from 'react-intersection-observer'
import moment from "moment"
import { FaHeart } from 'react-icons/fa'
import { Spinner } from '@chakra-ui/react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store'
import { Account } from '@/interfaces/user-account-interface'
import { useCustomToast } from '@/hooks/useCustomToast'

export default function pageContent () {
  const dispatch = useDispatch()
  const toast = useCustomToast()
  const account = useSelector((state: RootState) => state.user.account)
  const [ref, inView] = useInView({ triggerOnce: false, threshold: 0.1 })
  const { mutateAsync: _savePreferences, isPending: _saving } = useSavePreferences()
  const params = useParams()
  const { data, isLoading } = useGetNewsById(Number(params.id as string))
  if (isLoading || !data) return null

  const isFavorite = account?.preferences?.author.includes(data.author) && account?.preferences?.source.includes(data.source) && account?.preferences?.category.includes(data.category_id)
  return (
    <div className='w-full h-full flex justify-center'>
      <motion.div
        ref={ref}
        id={params.id as string}
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.5, delay: 0.1, }}
        className='w-3/5'
      >
        <div className="relative aspect-[16/9] overflow-hidden">
          <img src={data.image_url} className='w-full h-full object-cover rounded-t-md' alt="" />
          <div className='absolute top-0 right-0 p-3'>
            {account && <button disabled={_saving} onClick={async () => {
              if (!account) return
              let copy: {
                author: string[]
                source: string[]
                category: number[]
              } = {
                source: [],
                author: [],
                category: []
              }
              if (account.preferences) {
                copy = { ...copy, ...account.preferences }
              }
              if (!isFavorite) {
                // Instead of pushing, use the spread operator to create a new array
                copy.author = [...copy.author, data.author]
                copy.source = [...copy.source, data.source]
                copy.category = [...copy.category, data.category_id]
              } else {
                // Filter out values to remove from the arrays
                copy.author = copy.author.filter(e => e !== data.author)
                copy.source = copy.source.filter(e => e !== data.source)
                copy.category = copy.category.filter(e => e !== data.category_id)
              }

              const res = await _savePreferences(copy)
              const clone: Account = { ...structuredClone(account), preferences: res.preferences }
              dispatch(setAccount(clone))
              toast({
                title: "Preferences updated!!",
                description: 'You have been successfully updated your preferences',
                status: "success"
              })
            }} className='h-10'>
              {_saving ? <Spinner size={'sm'} /> :
                <FaHeart className={`${isFavorite ? 'text-[#af695c]' : 'text-white'} text-3xl`} />}
            </button>}
          </div>
        </div>
        <div className=''>
          <h2 className="text-base font-semibold">{data.title}</h2>
        </div>
        <div>
          {data.content}
        </div>
        <div className='text-base font-semibold'>By: {data.author}</div>
        <div className='text-base font-semibold'>Date: {moment(data.pub_date).format('DD/MM/yyyy')}</div>
      </motion.div>
    </div>
  )
}