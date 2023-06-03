import { atom } from 'recoil'

const navRerenderState = atom({
  key: 'navRerenderState',
  default: '',
});

export { navRerenderState }