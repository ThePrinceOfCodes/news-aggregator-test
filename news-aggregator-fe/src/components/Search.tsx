"use client"
import { Suspense, useEffect, useState } from "react"
import { LuSearch } from 'react-icons/lu'
import { useDebouncedCallback } from "use-debounce"

export function Search ({ placeholder, onSearch }: { placeholder: string, onSearch: (search: string) => void }) {
  const [value, setValue] = useState("")

  const handleSearch = useDebouncedCallback((term) => {
    onSearch(term)
  }, 300)

  useEffect(() => {
    handleSearch(value)
  }, [value])

  return (
    <Suspense>
      <div className="grow flex h-12 max-w-[590px] min-w-[400px]">
        <label htmlFor="search" className="sr-only">
          Search
        </label>
        <div className='w-full relative'>
          <input
            type="search"
            placeholder={placeholder || "Search"}
            value={value}
            className="grow bg-transparent border-solid border-[1px] border-[#898989] focus-within:outline-none focus-within:border-2 focus-within:border-[#898989] py-3 px-4 h-12 pr-12 absolute top-0 left-0 w-full rounded-full placeholder-gray-dark"
            onChange={(event) => setValue(event.target.value)}
          />
          <div className='top-0 right-0 flex justify-center items-center h-12 w-12 absolute'>
            <LuSearch className='text-2xl' />
          </div>
        </div>
      </div>
    </Suspense>
  )
}
