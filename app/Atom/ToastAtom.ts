import { atom } from "recoil";

type status = 'INFO' | 'ERROR' | 'SUCCESS' | '';

export const ToastAtom = atom({
  key: 'toastAtom',
  default: {
    isOpen: false,
    message: '',
    isAutoHide: false,
    status: '' as status
  }
})
