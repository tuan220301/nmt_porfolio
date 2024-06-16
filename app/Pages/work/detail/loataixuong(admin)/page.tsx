"use client";
import React from "react";
import LayOutDetail from "../layoutDetail/layoutDetail";
import { IsMobileAtom } from "@/app/Atom/IsMobile";
import { useRecoilValue } from "recoil";

const LoataixuongAdmin = () => {
  const isMobileAtom = useRecoilValue(IsMobileAtom);

  return (
    <LayOutDetail title="Loa tai xuong (admin)">
      <div className="w-full p-2">
        <img src={'/img/loataixuong(admin).png'} alt="img" className="w-full h-full object-cover" />
      </div>
      <div className="mt-2">
        <h1>This is the admin page for the loataixuong.com website. It is used to manage products, blog posts, and users.</h1>
      </div>
      <div className="pr-2">
        <p className="font-bold">Technologies Used:</p>
        <ul className="list-disc pl-4">
          <li>
            <div className={isMobileAtom ? "" : "flex items-center gap-1"}>
              <p className="font-bold">
                Frontend (FE):
              </p>
              React.js, Radix UI
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
              MongoDB
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
        <p className="font-bold">Key Features:</p>
        <ul className="list-disc pl-4">
          <li>
            <div className={isMobileAtom ? "" : "flex items-center gap-1"}>
              Role-based access control:
              <p className="font-bold">
              </p>
              Admins can grant different levels of access to users.
            </div>
            <div className="w-full p-2">
              <img src={'/img/role_admin.png'} alt="img" className="w-full h-full object-cover" />
            </div>
          </li>
          <li>
            <div className={isMobileAtom ? "" : "flex items-center gap-1"}>
              <p className="font-bold">
                All route for admin:
              </p>
            </div>
            <ul className="list-decimal pl-4">
              <li>
                <div>
                  <p>From admin I have been set route for user can access</p>
                  <div className="w-full p-2">
                    <img src={'/img/role_detail.png'} alt="img" className="w-full h-full object-cover" />
                  </div>
                </div>
              </li>
              <li>
                <div>
                  <p>After that i login with account with role is user</p>
                  <div className="w-full p-2">
                    <img src={'/img/update_role.png'} alt="img" className="w-full h-full object-cover" />
                  </div>
                </div>
              </li>
            </ul>
          </li>
          <li>
            <div className={isMobileAtom ? "" : "flex items-center gap-1"}>
              <p className="font-bold">
                Route-based authorization:
              </p>
              <div>Each user role has a set of associated routes that they can access.</div>
            </div>
          </li>
          <li>
            <div className={isMobileAtom ? "" : "flex items-center gap-1"}>
              <p className="font-bold">
                Database-stored routes:
              </p>
              <div>Routes are stored in the database for easy management.</div>
            </div>
          </li>
          <li>
            <div className={isMobileAtom ? "" : "flex items-center gap-1"}>
              <p className="font-bold">
                Blog:
              </p>
            </div>
            <ul className="list-decimal pl-4">
              <li>
                <div>
                  <p>List blog</p>
                  <div className="w-full p-2">
                    <img src={'/img/list_blog.png'} alt="img" className="w-full h-full object-cover" />
                  </div>
                </div>
              </li>
              <li>
                <div>
                  <p>Edit blog</p>
                  <div className="w-full p-2">
                    <img src={'/img/edit_blog.png'} alt="img" className="w-full h-full object-cover" />
                  </div>
                </div>
              </li>
              <li>
                <div>
                  <p>Add new blog</p>
                  <div className="w-full p-2">
                    <img src={'/img/add_blog.png'} alt="img" className="w-full h-full object-cover" />
                  </div>
                </div>
              </li>

            </ul>
          </li>
          <li>
            <div className={isMobileAtom ? "" : "flex items-center gap-1"}>
              <p className="font-bold">
                Product:
              </p>
            </div>
            <ul className="list-decimal pl-4">
              <li>
                <div>
                  <p>List product</p>
                  <div className="w-full p-2">
                    <img src={'/img/list_product.png'} alt="img" className="w-full h-full object-cover" />
                  </div>
                </div>
              </li>
              <li>
                <div>
                  <p>Edit product</p>
                  <div className="w-full p-2">
                    <img src={'/img/edit_product.png'} alt="img" className="w-full h-full object-cover" />
                  </div>
                </div>
              </li>
              <li>
                <div>
                  <p>Add new product</p>
                  <div className="w-full p-2">
                    <img src={'/img/add_product.png'} alt="img" className="w-full h-full object-cover" />
                  </div>
                </div>
              </li>

            </ul>
          </li>
          <li>
            <div className={isMobileAtom ? "" : "flex items-center gap-1"}>
              <p className="font-bold">
                User:
              </p>
            </div>
            <ul className="list-decimal pl-4">
              <li>
                <div>
                  <p>List user</p>
                  <div className="w-full p-2">
                    <img src={'/img/list_user.png'} alt="img" className="w-full h-full object-cover" />
                  </div>
                </div>
              </li>
              <li>
                <div>
                  <p>Edit user</p>
                  <div className="w-full p-2">
                    <img src={'/img/edit_user.png'} alt="img" className="w-full h-full object-cover" />
                  </div>
                </div>
              </li>
              <li>
                <div>
                  <p>Add new user</p>
                  <div className="w-full p-2">
                    <img src={'/img/add_user.png'} alt="img" className="w-full h-full object-cover" />
                  </div>
                </div>
              </li>

            </ul>
          </li>
          <li>
            <div className={isMobileAtom ? "" : "flex items-center gap-1"}>
              <p className="font-bold">
                Categories:
              </p>
            </div>
            <div className="w-full p-2">
              <img src={'/img/categories.png'} alt="img" className="w-full h-full object-cover" />
            </div>
          </li>
        </ul>
        <p className="font-bold">Current Development:</p>
        <ul className="list-disc pl-4">
          <li>
            <div className={isMobileAtom ? "" : "flex items-center gap-1"}>
              <p className="font-bold">
                Payment integration:
              </p>
              Integrating with Momo for payment processing and order status updates.
            </div>
          </li>
          <li>
            <div className={isMobileAtom ? "" : "flex items-center gap-1"}>
              <p className="font-bold">
                Dashboard development:
              </p>
              Creating a dashboard for businesses to easily manage their products and orders.
            </div>
          </li>
        </ul>
        <p className="font-bold">Future Plans:</p>
        <ul className="list-disc pl-4">
          <li>
            <div className={isMobileAtom ? "" : "flex items-center gap-1"}>
              <p className="font-bold">
                Continuous improvement:
              </p>
              Adding new features and enhancements based on user feedback.
            </div>
          </li>
          <li>
            <div className={isMobileAtom ? "" : "flex items-center gap-1"}>
              <p className="font-bold">
                Expanded functionality:
              </p>
              Expanding the admin page to include more management capabilities.            </div>
          </li>
        </ul>
        <p className="font-bold">Notes:</p>
        <ul className="list-disc pl-4">
          <li>
            <div className={isMobileAtom ? "" : "flex items-center gap-1"}>
              The admin page is still under development and new features are being added regularly.
            </div>
          </li>
        </ul>
      </div>

    </LayOutDetail>
  );
};
export default LoataixuongAdmin;
