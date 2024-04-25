import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { SidebarNavItem } from "@/types/nav";
import { paths } from "@/paths";
import { AuthContext } from "@/provider/AuthProvider";
import { signOut } from "firebase/auth";
import { auth } from "@/service/firebase";

export interface DocsSidebarNavProps {
  items: SidebarNavItem[];
}

export function Sidebar({ items }: DocsSidebarNavProps) {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const pathname = usePathname();
  const { user }: any = AuthContext();

  const handleClickLogin = async () => {
    console.log("in func");
    window.location.href = paths.login.root;
  };

  const handleClickSignUp = async () => {
    console.log("in func");
    window.location.href = paths.register.root;
  };

  const handleVoice = () => {
    window.location.href = paths.create.voice;
  };

  const handleClickLogout = async () => {
    signOut(auth)
      .then((response) => {
        console.log("response:", response);
        window.location.href = "/login";
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const divStyle: React.CSSProperties = {
    //
  };

  const handleNew = () => {
    window.location.href = paths.create.root;
  };

  return (
    <div className="h-full flex" style={divStyle}>
      <div
        className={`flex flex-col h-full w-64 bg-white border-r border-gray-200 ${
          sidebarVisible ? "" : "hidden"
        }`}
      >
        <div className="p-4">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold ml-2">Notefy Master!</h1>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto">
          <div className="p-4">
            <Button variant="outline" className="w-full" onClick={handleNew}>
              New Note
            </Button>
          </div>
          <div className="p-4">
            {items.map((item, index) => (
              <div key={index} className="mb-4">
                <h4 className="mb-2 text-sm font-semibold text-gray-800">
                  {item.title}
                </h4>
                {item?.items?.length && (
                  <DocsSidebarNavItems items={item.items} pathname={pathname} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-4">
          <Button
            variant="outline"
            className="w-full mb-2"
            onClick={handleVoice}
          >
            Voice Note
          </Button>
          <Button variant="outline" className="w-full">
            Settings
          </Button>
        </div>

        {/* Footer area for login/logout */}
        <div className="p-4 w-full border-t border-gray-200 mt-auto">
          {!user?.isLogin ? (
            <>
              <Button
                variant="secondary"
                className="w-full mb-2"
                onClick={handleClickLogin}
              >
                Log in
              </Button>
              <Button
                variant="secondary"
                className="w-full"
                onClick={handleClickSignUp}
              >
                Sign Up
              </Button>
            </>
          ) : (
            <Button
              variant="secondary"
              className="w-full"
              onClick={handleClickLogout}
            >
              Logout
            </Button>
          )}
        </div>
      </div>

      <div className="relative top-4 right-4 z-10">
        <Button
          variant="outline"
          onClick={() => setSidebarVisible(!sidebarVisible)}
          className="bg-white rounded-full p-1 transition-transform duration-300 hover:scale-110"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            style={{ transform: sidebarVisible ? "" : "rotate(180deg)" }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </Button>
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
    <div className="grid grid-flow-row auto-rows-max text-sm gap-2">
      {items.map((item, index) =>
        item.href && !item.disabled ? (
          <Link
            key={index}
            href={item.href}
            className={cn(
              "group flex items-center rounded-md px-2 py-1 hover:bg-gray-100 transition-colors duration-200",
              pathname === item.href
                ? "font-medium text-primary"
                : "text-gray-800",
              item.disabled && "cursor-not-allowed opacity-60"
            )}
            target={item.external ? "_blank" : ""}
            rel={item.external ? "noreferrer" : ""}
          >
            {item.title}
            {item.label && (
              <span className="ml-2 rounded-md bg-primary-light text-xs text-primary-dark px-1.5 py-0.5">
                {item.label}
              </span>
            )}
          </Link>
        ) : (
          <span
            key={index}
            className={cn(
              "flex items-center rounded-md px-2 py-1 hover:bg-gray-100 transition-colors duration-200",
              item.disabled && "cursor-not-allowed opacity-60"
            )}
            style={{
              backgroundColor: item.disabled ? "#f3f4f6" : "transparent",
              boxShadow: item.disabled
                ? "none"
                : "0 2px 4px rgba(0, 0, 0, 0.1)",
              border: item.disabled ? "none" : "1px solid #cbd5e0",
              color: item.disabled ? "#718096" : "#4a5568",
              transition: "width 0.3s ease-in-out",
              cursor: "pointer",
            }}
          >
            <span
              className="hover:pl-2 hover:pr-2 transition-all"
              style={{ display: "inline-block", width: "auto" }}
            >
              {item.title}
            </span>
            {item.label && (
              <span
                className="ml-2 rounded-md bg-gray-200 text-xs text-gray-600 px-1.5 py-0.5"
                style={{ backgroundColor: "#e2e8f0" }}
              >
                {item.label}
              </span>
            )}
          </span>
        )
      )}
    </div>
  ) : null;
}
