"use client"
import FilterNews from '@/components/FilterNews'
import NewsEntry from '@/components/NewsItem'
import { Search } from '@/components/Search'
import { useGetNewsHeadlines, useGetNewsPreferencesData } from '@/services/newsroom.service'
import { RootState } from '@/store'
import { Popover, PopoverBody, PopoverContent, PopoverTrigger, Skeleton } from '@chakra-ui/react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React from 'react'
import { FiChevronRight, FiFilter } from 'react-icons/fi'
import { useSelector } from 'react-redux'

export default function page () {
  const account = useSelector((state: RootState) => state.user.account)
  const searchParams = useSearchParams()
  const search = searchParams.get("search")
  const { replace } = useRouter()
  const pathname = usePathname()
  const { data: _prefData } = useGetNewsPreferencesData()

  const page = searchParams.get("page") || "1"
  const category = searchParams.get("category")
  const perPage = searchParams.get("per_page") || "50"
  const pubDate = searchParams.get("pub_date")
  const sourceFilter = searchParams.get("source")
  const { data, isLoading } = useGetNewsHeadlines({
    page: page ? parseInt(page) : undefined, page_size: perPage ? parseInt(perPage) : undefined, search: search ? search : undefined, source: sourceFilter ? sourceFilter : undefined, category: category ? category : undefined, authed: !!account, pubDate: pubDate ? pubDate : undefined
  })
  const premiums = [4, 12, 22]
  return (

    <div className='py-5'>
      <div className='flex justify-center items-center pb-5 gap-5'>
        <Search onSearch={(search) => {
          const params = new URLSearchParams(searchParams)
          if (search && search !== "Search") {
            params.set("search", search)
          } else {
            params.delete("search")
          }
          params.set("page", "1")
          replace(`${pathname}?${params.toString()}`)
        }} placeholder='Search news' />
        <Popover>
          <PopoverTrigger>
            <div className='flex cursor-pointer border h-12 px-5 rounded-full items-center gap-3'>
              <FiFilter />
              Filter</div>
          </PopoverTrigger>
          <PopoverContent className='outline-none w-[500px]'>
            <PopoverBody className='min-h-96 outline-none text-brand-darker'>
              {_prefData && <FilterNews data={_prefData} />}
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {isLoading && new Array(6).fill(0).map((_, index) => <div key={`loading_skel_${index}`} className='h-96'>
          <Skeleton startColor='#af695c' endColor='#2a2a2a' className='h-full w-full' />
        </div>)}
        {data?.data.map((article, index) => {

          return <Link key={article.id} href={`/${article.id}`}>
            <NewsEntry index={index} article={article} promoted={premiums.includes(index)} />
          </Link>
        })}
        <div onClick={() => {
          const params = new URLSearchParams(searchParams)
          params.set("page", (Number(page) + 1).toString())
          replace(`${pathname}?${params.toString()}`)
        }} className='border cursor-pointer flex justify-center items-center'>
          <div className='flex gap-2 items-center text-lg font-semibold'>
            <FiChevronRight /> More
          </div>
        </div>
      </div>

    </div>
  )
}
