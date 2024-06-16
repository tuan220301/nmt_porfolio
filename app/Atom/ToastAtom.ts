import { atom } from "recoil";

export const ToastAtom = atom({
  key: 'toastAtom',
  default: {
    isOpen: false,
    message: ''
  }
})
