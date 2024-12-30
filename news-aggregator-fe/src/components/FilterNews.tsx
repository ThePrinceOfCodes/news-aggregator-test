import { Input } from '@chakra-ui/react'
import moment from 'moment'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React from 'react'
import { FiTrash2 } from 'react-icons/fi'

export default function FilterNews ({ data: _prefData }: { data: { categories: { id: number, name: string }[], sources: string[] } }) {
  const searchParams = useSearchParams()
  const search = searchParams.get("search")
  const { replace } = useRouter()
  const pathname = usePathname()
  const category = searchParams.get("category")
  const pubDate = searchParams.get("pub_date")
  const sourceFilter = searchParams.get("source")
  return (
    <>
      <div className='w-full flex flex-col'>
        <div className='flex justify-between'>
          <label className='poppins-light' htmlFor="publishedDate">Published date</label>
          <div onClick={() => {
            const params = new URLSearchParams(searchParams)
            params.delete("pub_date")
            replace(`${pathname}?${params.toString()}`)
          }} className='flex gap-1 cursor-pointer items-center'>
            clear
            <FiTrash2 className='text-[11px]' />
          </div>
        </div>
        <Input value={pubDate ? moment(new Date(pubDate)).format('YYYY-MM-DD') : ''} type='date' id='publishedDate' onChange={(e) => {
          const params = new URLSearchParams(searchParams)
          if (e.target.valueAsDate) {
            params.set("pub_date", e.target.valueAsDate?.toISOString())
          } else {
            params.delete("pub_date")
          }
          replace(`${pathname}?${params.toString()}`)
        }} />
      </div>

      <div className='w-full flex flex-col mt-4'>
        <div className='flex justify-between'>
          <label className='poppins-light' htmlFor="category">Category</label>
          <div onClick={() => {
            const params = new URLSearchParams(searchParams)
            params.delete("category")
            replace(`${pathname}?${params.toString()}`)
          }} className='flex gap-1 cursor-pointer items-center'>
            clear
            <FiTrash2 className='text-[11px]' />
          </div>
        </div>
        <div className="grid grid-cols-3  gap-2 mt-1">
          {_prefData?.categories.map((cat) => <div onClick={() => {
            const params = new URLSearchParams(searchParams)
            params.set("category", (cat.id).toString())
            replace(`${pathname}?${params.toString()}`)
          }} key={`category_${cat.id}`} className={`h-10 border justify-center cursor-pointer rounded-full px-8 flex items-center ${cat.id.toString() === category && 'bg-[#af695c] text-gray-100'}`}>{cat.name}</div>)}
        </div>
      </div>

      <div className='w-full flex flex-col mt-4 mb-10'>
        <div className='flex justify-between'>
          <label className='poppins-light' htmlFor="category">News Sources</label>
          <div onClick={() => {
            const params = new URLSearchParams(searchParams)
            params.delete("source")
            replace(`${pathname}?${params.toString()}`)
          }} className='flex gap-1 cursor-pointer items-center'>
            clear
            <FiTrash2 className='text-[11px]' />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-1">
          {_prefData?.sources.map((source) => <div onClick={() => {
            const params = new URLSearchParams(searchParams)
            params.set("source", source.toString())
            replace(`${pathname}?${params.toString()}`)
          }} key={`source_${source}`} className={`h-10 border justify-center cursor-pointer rounded-full px-8 flex items-center ${source === sourceFilter && 'bg-[#af695c] text-gray-100'}`}>{source}</div>)}
        </div>
      </div>
    </>
  )
}
