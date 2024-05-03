"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { SidebarNavItem } from "@/types/nav";
import { paths } from "@/paths";
import { AuthContext } from "@/provider/AuthProvider";
import { signOut } from "firebase/auth";
import { auth } from "@/service/firebase";
import { IoMdLogIn } from "react-icons/io";
import { IoMdPersonAdd } from "react-icons/io";
import { TbLogout2 } from "react-icons/tb";
import { FaMicrophoneLines } from "react-icons/fa6";
import { FaArrowCircleLeft } from "react-icons/fa";
import { FaArrowCircleRight } from "react-icons/fa";
import { FaStickyNote } from "react-icons/fa";

export interface DocsSidebarNavProps {
  items: SidebarNavItem[];
}

export function Sidebar({ items }: DocsSidebarNavProps) {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const pathname = usePathname();
  const { user }: any = AuthContext();

  const handleClickLogin = () => {
    window.location.href = paths.login.root;
  };

  const handleClickSignUp = () => {
    window.location.href = paths.register.root;
  };

  const handleVoice = () => {
    window.location.href = paths.create.voice;
  };

  const handleClickLogout = () => {
    signOut(auth)
      .then(() => {
        window.location.href = "/login";
      })
      .catch(console.error);
  };

  return (
    <div className="h-full flex">
      <div
        className={`flex flex-col h-full w-64 bg-black text-white border-r border-gray-800 transition-all duration-300 ${
          sidebarVisible ? "" : "hidden"
        }`}
      >
        <div className="p-4">
          <div className="flex items-center">
            <h2 className="text-xl font-semibold ml-2">𝙽𝚘𝚝𝚎𝚅𝚎𝚛𝚜𝚎</h2>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto">
          <div className="p-4">
            <Button
              variant="secondary"
              className="w-full "
              onClick={() => (window.location.href = paths.create.root)}
            >
              <FaStickyNote style={{ marginRight: "10px" }} />
              New Note
            </Button>
          </div>
          <div className="p-4">
            {items.map((item, index) => (
              <div key={index} className="mb-4">
                <i
                  className={`mb-2 text-sm font-semibold transition-all duration-300 hover:text-gray-500 ${
                    pathname === item.href ? "text-orange-500" : ""
                  }`}
                  // onClick={() => {window.location.href = item.href;}}
                >
                  {item.title}
                </i>
                <div style={{ marginTop: "1rem" }}>
                  {item?.items?.length && (
                    <DocsSidebarNavItems
                      items={item.items}
                      pathname={pathname}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          className="p-4"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Button
            variant="secondary"
            style={{ borderRadius: "100%" }}
            onClick={handleVoice}
          >
            <FaMicrophoneLines />
          </Button>
        </div>

        {/* Footer area for login/logout */}
        <div className="p-4 w-full border-t border-gray-800 mt-auto">
          <div style={{ margin: "1rem" }}>
            <i>You need to logIn/SignUp for creating notes.</i>{" "}
          </div>
          {!user?.isLogin ? (
            <>
              <Button
                variant="secondary"
                className="w-full mb-2"
                onClick={handleClickLogin}
              >
                <IoMdLogIn style={{ marginRight: "10px" }} />
                Log in
              </Button>
              <Button
                variant="secondary"
                className="w-full"
                onClick={handleClickSignUp}
              >
                <IoMdPersonAdd style={{ marginRight: "10px" }} />
                Sign Up
              </Button>
            </>
          ) : (
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleClickLogout}
            >
              <TbLogout2 style={{ marginRight: "10px" }} />
              Logout
            </Button>
          )}
        </div>
      </div>

      <div
        className="relative top-2 z-10 p-1"
        onClick={() => setSidebarVisible(!sidebarVisible)}
      >
        {sidebarVisible ? <FaArrowCircleLeft /> : <FaArrowCircleRight />}
      </div>
    </div>
  );
}

interface DocsSidebarNavItemsProps {
  items: SidebarNavItem[];
  pathname: string | null;
}

export function DocsSidebarNavItems({
  items,
  pathname,
}: DocsSidebarNavItemsProps) {
  return items?.length ? (
    <div className="grid grid-flow-row auto-rows-max text-md gap-4">
      {items.map((item, index) =>
        item.href && !item.disabled ? (
          <Link
            key={index}
            href={item.href}
            className={`group flex items-center rounded-md px-2 py-1 hover:bg-gray-800 transition-colors duration-200 ${
              pathname === item.href
                ? "font-medium text-orange-500"
                : "text-white"
            }`}
            target={item.external ? "_blank" : ""}
            rel={item.external ? "noreferrer" : ""}
          >
            <div style={{ fontWeight: "bolder", fontSize: "15px" }}>
              {item.icon}
              {item.title}
            </div>

            {item.label && (
              <span className="ml-2 rounded-md bg-primary-light text-xs text-primary-dark px-1.5 py-0.5">
                {item.label}
              </span>
            )}
          </Link>
        ) : (
          <span
            key={index}
            className={`flex items-center rounded-md px-2 py-1 hover:bg-white transition-colors duration-200 ${
              item.disabled ? "cursor-not-allowed opacity-80" : ""
            }`}
            // style={{
            //   backgroundColor: item.disabled ? "#f3f4f6" : "white",
            //   boxShadow: item.disabled
            //     ? "none"
            //     : "0 2px 4px rgba(0, 0, 0, 0.1)",
            //   border: item.disabled ? "none" : "1px solid #cbd5e0",
            //   color: item.disabled ? "white" : "white",
            //   transition: "all 0.3s ease-in-out",
            //   cursor: item.disabled ? "not-allowed" : "pointer",
            // }}
          >
            <h2 className="hover:pl-3 hover:pr-3 transition-all">
              {item.title}
            </h2>
            {item.label && (
              <h3
                className="ml-2 rounded-md bg-gray-200 text-xs text-gray-600 px-1.5 py-0.5"
                style={{ backgroundColor: "#e2e8f0" }}
              >
                {item.label}
              </h3>
            )}
          </span>
        )
      )}
    </div>
  ) : null;
}
