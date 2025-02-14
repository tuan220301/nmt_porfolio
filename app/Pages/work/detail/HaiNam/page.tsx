/* eslint-disable @next/next/no-img-element */
"use client"

import React from "react"
import { useRecoilValue } from "recoil"
import { IsMobileAtom } from "@/app/Atom/IsMobile";
import LayOutDetail from "../layoutDetail/layoutDetail";
const HaiNam = () => {

  const isMobileAtom = useRecoilValue(IsMobileAtom);

  return (
    <LayOutDetail title="Hai Nam">
      <div className="w-full p-2 ">
        <div className="mt-2">
          <h1>This is a project about an Android mobile app used for scanning QR code information to support warehouse import and export needs, as well as inventory management, product information entry for different stages, and label printing.</h1>
        </div>
        <div className="w-full p-2">
          <img src={'/img/HaiNam.png'}
            alt="img" className="w-full h-full object-cover" />
          <div className="pr-2 mt-2">
            <p className="font-bold">Technologies Used:</p>
            <ul className="list-disc pl-4">
              <li>
                <div className={isMobileAtom ? "" : "flex items-center gap-1"}>
                  <p className="font-bold">
                    Frontend (FE):
                  </p>
                  ReactNative, Recoil
                </div>
              </li>
              <li>
                <div className={isMobileAtom ? "" : "flex items-center gap-1"}>
                  <p className="font-bold">
                    Backend (BE):
                  </p>
                  Dotnet 8
                </div>
              </li>
              <li>
                <div className={isMobileAtom ? "" : "flex items-center gap-1"}>
                  <p className="font-bold">
                    Database (DB):
                  </p>
                  SqlServer
                </div>
              </li>
              <li>
                <div className={isMobileAtom ? "" : "flex items-center gap-1"}>
                  <p className="font-bold">
                    Docker:
                  </p>
                  Used to streamline API deployment to the server.
                </div>
              </li>
            </ul>
            <p className="font-bold">Key Feature:</p>
            <ul>
              <li>
                <div className={isMobileAtom ? "" : "flex items-center gap-1"}>
                  After logging in, the API will return a token used for authentication and authorization.
                </div>
              </li>
              <li>
                <div className={isMobileAtom ? "" : "flex items-center gap-1"}>
                  Once the token is received, it will be stored locally to be used for API requests.
                </div>
              </li>
              <li>
                <div className={isMobileAtom ? "" : "flex items-center gap-1"}>
                  After login successfully, it will go to this screen.
                </div>
                <div className="w-full p-2">
                  <img src={'/img/HaiNamMain.jpg'} alt="img" className="w-full h-full object-cover" />
                </div>
                <div className={isMobileAtom ? "" : "flex items-center gap-1"}>
                  I use React Navigator for navigate screen.
                </div>
              </li>
              <li>
                <div className={isMobileAtom ? "" : "flex items-center gap-1"}>
                  First screen is list of created production orders
                </div>
                <div className="w-full p-2">
                  <img src={'/img/ListProduce.jpg'} alt="img" className="w-full h-full object-cover" />
                </div>
                <div className={isMobileAtom ? "" : "flex items-center gap-1"}>
                  When press the plus button in the top right corner, it will navigate to the detail page, where a new production order can be created.
                </div>
                <div className={isMobileAtom ? "" : "flex items-center gap-1"}>
                  When press the line in table, it will navigate to the detail or production order.
                </div>
              </li>
              <li>
                <div className={isMobileAtom ? "" : "flex items-center gap-1"}>
                  This sceen is Detail of production order
                </div>
                <div className="w-full p-2">
                  <img src={'/img/DetailProduceEdit.jpg'} alt="img" className="w-full h-full object-cover" />
                </div>
                <div className={isMobileAtom ? "" : "flex items-center gap-1"}>
                  This is the product detail page, which includes a useful feature: label printing. Each line has a print button, and when clicked, it sends the information to the nearest printer for printing (using ZPL to send print commands).
                </div>
                <div className={isMobileAtom ? "" : "flex items-center gap-1"}>
                  Next to the print button is the duplicate button, which automatically creates a new line with the same content as the previous one, making it easier to add information quickly.
                </div>
              </li>
              <li>
                <div className="w-full p-2">
                  <img src={'/img/TalbleSettingProductDetail.jpg'} alt="img" className="w-full h-full object-cover" />
                </div>
                <div className={isMobileAtom ? "" : "flex items-center gap-1"}>
                  The columns that are checked will be displayed on the table.
                </div>
              </li>
              <li>
                <div className="w-full p-2">
                  <img src={'/img/DetailProduce.jpg'} alt="img" className="w-full h-full object-cover" />
                </div>
                <div className={isMobileAtom ? "" : "flex items-center gap-1"}>
                  Similarly, for editing, the UI of the new creation screen is the same, and the features are identical. The only difference is that there is no initial input information.
                </div>
                <div className={isMobileAtom ? "" : "flex items-center gap-1"}>
                  After scanning the information, just like in the Roll Input section, the data will be inserted into the table. Once saved, a record will be created and stored in the database.
                </div>
              </li>
            </ul>
          </div>
        </div>


      </div>
    </LayOutDetail>
  )
}
export default HaiNam;
