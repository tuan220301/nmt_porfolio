"use client"
import { IsMobileAtom } from "@/app/Atom/IsMobile";
import { ToastAtom } from "@/app/Atom/ToastAtom";
import React, { useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import './../home/home.css';
const HomePage = () => {
  const isMobileAtom = useRecoilValue(IsMobileAtom);
  const [form, setForm] = useState({
    email: '',
    content: ''
  })
  const email = "tuannguyenwin01@gmail.com";

  const setToast = useSetRecoilState(ToastAtom);
  const copyToClipboard = () => {
    navigator.clipboard.writeText(email)
      .then(() => {
        setToast({
          isOpen: true,
          message: 'Copy to clipboard'
        })
        setTimeout(() => {
          setToast({
            isOpen: false,
            message: ''
          })
        }, 2000); // Reset tooltip after 2 seconds
      })
      .catch((err) => {
        console.error('Could not copy email: ', err);
      });
  };
  const handleChangeInput = (e: any, field: string) => {
    setForm({
      ...form,
      [field]: e.target.value
    });
  }
  const handleSubmit = () => {
    console.log('form: ', form);
  }
  return (
    <div className={isMobileAtom ? 'w-full' : 'w-1/2'}>
      <div className="w-full flex items-center justify-center mb-6 text-center text-lg">
        Please find my contact information below. I welcome your feedback, suggestions, and inquiries about potential collaborations.
      </div>
      <div className="w-full flex items-center justify-center mb-6">
        <div className="flex items-center gap-4 ">
          <a href="https://www.facebook.com/ngmituan" className="w-10 h-10 border rounded-lg flex items-center justify-center ">
            <svg className="h-8 w-8 " viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
          </a>
          <a href="https://github.com/tuan220301" className="w-10 h-10 border rounded-lg flex items-center justify-center">
            <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></svg>
          </a>
          <button onClick={copyToClipboard} className="w-10 h-10 border rounded-lg flex items-center justify-center">
            <svg className="h-8 w-8" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <rect x="3" y="5" width="18" height="14" rx="2" />  <polyline points="3 7 12 13 21 7" /></svg>
          </button>
        </div>
      </div>
      <p className="text-xl font-bold">Contact !!!</p>
      <div className="border-2 rounded-lg w-28 mb-4"></div>
      <div className={`flex ${isMobileAtom ? 'flex-col' : 'flex-row justify-between'} w-full `}>
        <div className="w-full">
          <div className="w-full flex flex-col gap-2 text-lg">
            <label className="block mb-2 text-gray-900 dark:text-white">Gmail</label>
            <input className="mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-[#202023] dark:border-white dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={form.email} onChange={(e) => handleChangeInput(e, 'email')} />
            <label className="block mb-2  text-gray-900 dark:text-white">Content</label>
            <textarea className="bg-gray-50 min-h-20 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-[#202023] dark:border-white dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={form.content} onChange={(e) => handleChangeInput(e, 'content')} />
          </div>
          <div className="w-full flex items-center justify-center mt-6">
            <button className="hover-border border-2 border-transparent rounded-md text-lg px-6 py-2" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}
export default HomePage
