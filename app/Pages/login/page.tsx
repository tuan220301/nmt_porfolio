"use client"
import { IsMobileAtom } from "@/app/Atom/IsMobile";
import { LoginFormType, LoginResponeType } from "@/app/Ults";
import { Suspense, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import Loading from "@/app/Components/Loading";
import Spline from "@splinetool/react-spline";
import InputComponent from "@/app/Components/Input";
import { LoggedAtom } from "@/app/Atom/IsLogged";
import { ToastAtom } from "@/app/Atom/ToastAtom";
import { useApi } from "@/app/hooks/useApi";
import { ResponseApi } from "@/app/api/models/response";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const { callApi } = useApi();
  const router = useRouter();
  const isMobileAtom = useRecoilValue(IsMobileAtom);
  const setToastAtom = useSetRecoilState(ToastAtom);
  const setIsLoggedAtom = useSetRecoilState(LoggedAtom);
  const [formLogin, setFormLogin] = useState<LoginFormType>(
    {
      email: '',
      password: ''
    }
  );
  const [isShowPass, setIsShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChangeIcon = () => {
    setIsShowPass(!isShowPass);
  };

  const handleChangeInput = (e: any, field: string) => {
    setFormLogin({
      ...formLogin,
      [field]: e.target.value
    });
  };
  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const data: ResponseApi<LoginResponeType> = await callApi("/auth/login", "POST", formLogin);
      if (data && data.isSuccess) {

        localStorage.setItem("user_id", data.data ? data.data._id : '');

        setToastAtom({
          isOpen: true,
          message: data.message,
          isAutoHide: true,
          status: 'SUCCESS'
        })

        router.push("/Pages/work"); // Chuyển hướng khi token hết hạn

        setIsLoggedAtom(true);
      }
      else {
        setToastAtom({
          isOpen: true,
          message: data.message,
          isAutoHide: true,
          status: 'ERROR'
        })
      }
    } catch (error: any) {
      setToastAtom({
        isOpen: true,
        message: error.toString(),
        isAutoHide: true,
        status: 'ERROR'
      });
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className={isMobileAtom ? 'w-full' : 'w-1/2'}>
      <div className="w-full flex items-center justify-center mb-6 text-center text-lg">
        With this feature, I can prove who I am and then upload my personal projects to this portfolio
      </div>
      <div className=" font-bold w-4/5">
        <p>Login !!!</p>
        <div className="border-2 border-gray-500 dark:border-grey-100 rounded-lg w-12"></div>
      </div>
      <div className={`w-full flex items-center ${isMobileAtom ? 'justify-center' : 'justify-between'}`}>
        {
          isMobileAtom ? <></> : <div>
            <Suspense fallback={<Loading />}>
              <div style={{ height: '400px', width: '250px' }}>
                <Spline
                  scene="https://prod.spline.design/kKTerfjRkSZKgYVA/scene.splinecode"
                />
              </div>
            </Suspense>
          </div>
        }
        <div className={`flex flex-col ${isMobileAtom ? 'w-full' : 'w-1/2'} gap-2 justify-center mt-4`}>
          <div>
            Email:
          </div>
          <div className="h-12">
            <InputComponent value={formLogin.email} type="text"
              onChangeText={(e) => handleChangeInput(e, 'email')} />
          </div>
          <div>
            Password:
          </div>
          <div className="h-12">
            <InputComponent value={formLogin.password} type={isShowPass ? 'text' : 'password'}
              onChangeText={(e) => handleChangeInput(e, 'password')}
              onEnter={handleSubmit}
              icon={
                <button onClick={handleChangeIcon} className="h-full flex items-center justify-center">
                  {
                    isShowPass ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg> : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                  }
                </button>
              }
            />
          </div>
          <div>
            <div className="w-full flex items-center justify-center mt-6">
              <button className={`${isLoading ? 'flex items-center justify-between' : ''} hover-border border-2 border-transparent rounded-md text-lg px-6 py-2 w-36`} onClick={handleSubmit}>
                Submit
                {isLoading ?
                  <Loading width={'20px'} height={'20px'} /> : <></>
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default LoginPage
