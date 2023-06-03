import { atom } from 'recoil'

const isLoginState = atom({
  key: 'isLoginState',
  default: false,
})

const isAdminState = atom({
  key: 'isAdminState',
  default: false,
})


export { isLoginState, isAdminState }