/* eslint-disable @next/next/no-img-element */
"use client";
import { IsMobileAtom } from "@/app/Atom/IsMobile";
import { ToastAtom } from "@/app/Atom/ToastAtom";
import { LoggedAtom } from "@/app/Atom/IsLogged";
import React, { useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import './../home/home.css';
import Loading from "@/app/Components/Loading";
const HomePage = () => {
  const isMobileAtom = useRecoilValue(IsMobileAtom);
  const isLoggedAtom = useRecoilValue(LoggedAtom);
  const [loading, setLoading] = useState(false);
  const [uploadingCV, setUploadingCV] = useState(false);
  const [form, setForm] = useState({
    email: '',
    content: ''
  });
  const email = "tuannguyenwin01@gmail.com";

  const setToast = useSetRecoilState(ToastAtom);
  const copyToClipboard = () => {
    navigator.clipboard.writeText(email)
      .then(() => {
        setToast({
          isOpen: true,
          message: 'Copy to clipboard',
          isAutoHide: false,
          status: 'INFO'
        });
        setTimeout(() => {
          setToast({
            isOpen: false,
            message: '',
            isAutoHide: false,
            status: ''
          });
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
  };

  const handleCVUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate PDF
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setToast({
        isOpen: true,
        message: 'Please select a PDF file only',
        isAutoHide: false,
        status: 'ERROR'
      });
      setTimeout(() => {
        setToast({
          isOpen: false,
          message: '',
          isAutoHide: false,
          status: ''
        });
      }, 2000);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setToast({
        isOpen: true,
        message: 'File size must be less than 10MB',
        isAutoHide: false,
        status: 'ERROR'
      });
      setTimeout(() => {
        setToast({
          isOpen: false,
          message: '',
          isAutoHide: false,
          status: ''
        });
      }, 2000);
      return;
    }

    try {
      setUploadingCV(true);
      const formData = new FormData();
      formData.append('pdf', file);

      const response = await fetch('/api/cv/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.isSuccess && data.data) {
        setUploadingCV(false);
        setToast({
          isOpen: true,
          message: 'CV uploaded successfully!',
          isAutoHide: false,
          status: 'SUCCESS'
        });
        setTimeout(() => {
          setToast({
            isOpen: false,
            message: '',
            isAutoHide: false,
            status: ''
          });
        }, 2000);
        // Reset file input
        event.target.value = '';
      } else {
        setUploadingCV(false);
        setToast({
          isOpen: true,
          message: data.message || 'CV upload failed',
          isAutoHide: false,
          status: 'ERROR'
        });
        setTimeout(() => {
          setToast({
            isOpen: false,
            message: '',
            isAutoHide: false,
            status: ''
          });
        }, 2000);
      }
    } catch (error: any) {
      setUploadingCV(false);
      console.error('CV upload error:', error);
      setToast({
        isOpen: true,
        message: 'Failed to upload CV',
        isAutoHide: false,
        status: 'ERROR'
      });
      setTimeout(() => {
        setToast({
          isOpen: false,
          message: '',
          isAutoHide: false,
          status: ''
        });
      }, 2000);
    }
  };

  const handleSubmit = async () => {
    const data = {
      service_id: 'Porfolio_001',
      template_id: 'template_os9a3rd',
      user_id: 'vc3VpRoVUcwGXo6Wm',
      template_params: {
        'from_name': form.email,
        'message': form.content,
        'to_name': 'Tuan'
      }
    };
    if (form.content !== '' || form.email !== '') {
      try {
        setLoading(true);
        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });

        if (response.ok) {
          setLoading(false);
          setToast({
            isOpen: true,
            message: 'Your mail is sent!',
            isAutoHide: false,
            status: ''
          });
          setTimeout(() => {
            setToast({
              isOpen: false,
              message: '',
              isAutoHide: false,
              status: ''
            });
          }, 2000); // Reset tooltip after 2 seconds
          setForm({
            email: '',
            content: ''
          });
        } else {
          setLoading(false);
          setToast({
            isOpen: true,
            message: 'Send mail fail!',
            isAutoHide: false,
            status: 'ERROR'
          });
          setTimeout(() => {
            setToast({
              isOpen: false,
              message: '',
              isAutoHide: false,
              status: ''
            });
          }, 2000); // Reset tooltip after 2 seconds

        }
      } catch (error: any) {
        setLoading(false);
        console.log('error: ', error);
      }
    } else {
      setLoading(false);
      setToast({
        isOpen: true,
        message: 'Email and content are required',
        isAutoHide: false,
        status: 'ERROR'
      });
      setTimeout(() => {
        setToast({
          isOpen: false,
          message: '',
          isAutoHide: false,
          status: 'INFO'
        });
      }, 2000); // Reset tooltip after 2 seconds

    }
  };

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
          {isLoggedAtom && (
            <label className="w-10 h-10 border rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition">
              <input
                type="file"
                accept=".pdf"
                onChange={handleCVUpload}
                disabled={uploadingCV}
                className="hidden"
              />
              {uploadingCV ? (
                <Loading width={'20px'} height={'20px'} />
              ) : (
                <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />  <polyline points="17 8 12 3 7 8" />  <line x1="12" y1="3" x2="12" y2="15" /></svg>
              )}
            </label>
          )}
        </div>
      </div>
      <p className="text-xl font-bold">Contact !!!</p>
      <div className="border-2 rounded-lg w-20 mb-4"></div>
      <div className={`flex ${isMobileAtom ? 'flex-col' : 'flex-row justify-between'} w-full `}>
        <div className="w-full">
          <div className="w-full flex flex-col gap-2 text-lg">
            <label className="block mb-2 text-gray-900 dark:text-white">Gmail</label>
            <input className="mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-[#202023] dark:border-white dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={form.email} onChange={(e) => handleChangeInput(e, 'email')} />
            <label className="block mb-2  text-gray-900 dark:text-white">Content</label>
            <textarea className="bg-gray-50 min-h-20 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-[#202023] dark:border-white dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={form.content} onChange={(e) => handleChangeInput(e, 'content')} />
          </div>
          <div className="w-full flex items-center justify-center mt-6">
            <button className={`${loading ? 'flex items-center justify-between' : ''} hover-border border-2 border-transparent rounded-md text-lg px-6 py-2 w-36`} onClick={handleSubmit}>
              Submit
              {loading ?
                <Loading width={'20px'} height={'20px'} /> : <></>
              }
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
export default HomePage;
