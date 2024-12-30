// slices/counterSlice.js
import { UserManagementStoreData } from '@/interfaces/user-account-interface'
import { createSlice } from '@reduxjs/toolkit'

const initialState: UserManagementStoreData = {
  account: null,
  token: null
}
const userManagementSlice = createSlice({
  name: 'user-management',
  initialState,
  reducers: {
    setAccount: (state, action) => {
      state.account = action.payload
    },
    setToken: (state, action) => {
      state.token = action.payload
    },
  },
})

export const { setAccount, setToken } = userManagementSlice.actions
export default userManagementSlice.reducer
