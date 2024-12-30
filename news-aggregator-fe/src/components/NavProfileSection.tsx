import { Account } from '@/interfaces/user-account-interface'
import { useGetNewsPreferencesData, useSavePreferences } from '@/services/newsroom.service'
import { Button, Menu, MenuButton, MenuItem, MenuList, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react'
import Link from 'next/link'
import { setAccount } from '@/store/slices/user-management'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useCustomToast } from '@/hooks/useCustomToast'

export default function NavProfileSection ({ account }: { account: Account }) {
  const dispatch = useDispatch()
  const toast = useCustomToast()
  const [preferences, setPreferences] = useState<{
    author: string[]
    source: string[]
    category: number[]
  }>({
    author: [],
    source: [],
    category: []
  })
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { data: _prefData } = useGetNewsPreferencesData(isOpen)
  const { mutateAsync: _savePreferences, isPending: _saving } = useSavePreferences()

  useEffect(() => {
    let act = structuredClone(account)
    if (act.preferences) {
      setPreferences(act.preferences)
    }
  }, [account])
  return (
    <>
      <div className='flex items-center gap-3'>
        <div>{account.name.split(" ")[0]}</div>
        <Menu>
          <MenuButton className='h-12 w-12 rounded-full !bg-black text-xl'>
            {account.name.split(" ").slice(0, 2).map(e => e.charAt(0))}
          </MenuButton>
          <MenuList className='!bg-black border-none'>
            <MenuItem onClick={onOpen} className='!bg-black text-sm hover:!bg-white/20'>Preferences</MenuItem>
            <MenuItem as={Link} href={"/auth/logout"} className='!bg-black text-sm hover:!bg-white/20'>Logout</MenuItem>
          </MenuList>
        </Menu>
      </div>

      {isOpen && <Modal isOpen={isOpen} size={'2xl'} isCentered={true} onClose={onClose}>
        <ModalOverlay />
        <ModalContent className='!text-brand-darker'>
          <ModalHeader>Preferences</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className='w-full flex flex-col mt-4'>
              <div className='flex justify-between'>
                <label className='poppins-light' htmlFor="category">Category</label>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-1">
                {_prefData?.categories.map((cat) => <div onClick={() => {
                  let copy = { ...preferences }
                  if (copy.category.includes(cat.id)) {
                    copy.category = copy.category.filter(e => e !== cat.id)
                  } else {
                    copy.category.push(cat.id)
                  }
                  setPreferences(copy)
                }} key={`category_${cat.id}`} className={`h-10 border justify-center cursor-pointer rounded-full px-8 flex items-center ${preferences.category.includes(cat.id) && 'bg-[#af695c] text-gray-100'}`}>{cat.name}</div>)}
              </div>
            </div>

            <div className='w-full flex flex-col mt-4 mb-10'>
              <div className='flex justify-between'>
                <label className='poppins-light' htmlFor="category">News Sources</label>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-1">
                {_prefData?.sources.map((source) => <div onClick={() => {
                  let copy = { ...preferences }
                  if (copy.source.includes(source)) {
                    copy.source = copy.source.filter(e => e !== source)
                  } else {
                    copy.source.push(source)
                  }
                  setPreferences(copy)
                }} key={`category_${source}`} className={`h-10 border justify-center cursor-pointer rounded-full px-8 flex items-center ${preferences?.source.includes(source) && 'bg-[#af695c] text-gray-100'}`}>{source}</div>)}
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button type='button' variant={'ghost'} mr={3} onClick={onClose}>
              Close
            </Button>
            <Button isLoading={_saving} isDisabled={_saving} onClick={async () => {
              const res = await _savePreferences(preferences)
              const clone: Account = { ...structuredClone(account), preferences: res.preferences }
              dispatch(setAccount(clone))
              toast({
                title: "Preferences updated!!",
                description: 'You have been successfully updated your preferences',
                status: "success"
              })
            }} type='button' className='bg-brand-dark text-white hover:bg-brand-dark disabled:bg-brand-dark/50 hover:disabled:bg-brand-dark/50 rounded-full px-8'>Save changes</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>}
    </>
  )
}