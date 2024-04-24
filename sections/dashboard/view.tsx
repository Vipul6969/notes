"use client";

import React from "react";
import { Sidebar } from "../../components/sidebar/view";
import { docsConfig } from "@/config/docs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card";
import { AuthContext } from "@/provider/AuthProvider";

export default function Dashboard() {
  const { user }: any = AuthContext();

  const notes = [
    {
      id: 1,
      title: "Meeting Notes",
      content: "Discuss project timelines",
      icon: "📅",
    },
    { id: 2, title: "Ideas", content: "Brainstorm new features", icon: "💡" },
    {
      id: 3,
      title: "To-Do List",
      content: "Complete tasks by EOD",
      icon: "📝",
    },
    {
      id: 4,
      title: "Personal Reminders",
      content: "Buy groceries",
      icon: "🛒",
    },
    {
      id: 5,
      title: "Goals",
      content: "Plan for the upcoming week",
      icon: "🎯",
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        // border:"20px solid red",
      }}
    >
      <div style={{ flex: "0 0 10%" }}>
        <Sidebar items={docsConfig.sidebarNav} />
      </div>
      {user?.isLogin ? (
        <div
          style={{
            flex: 1,
            backgroundImage: `notes\public\galaxy.jpg`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "20px",
              padding: "2rem",
            }}
          >
            {notes.map((note) => (
              <Card
                key={note.id}
                style={{
                  background: "#f9f9f9",
                  borderRadius: "10px",
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                  width: "100%",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.boxShadow =
                    "0px 8px 12px rgba(0, 0, 0, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow =
                    "0px 4px 6px rgba(0, 0, 0, 0.1)";
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "5px",
                    left: "5px",
                  }}
                >
                  {note.icon}
                </div>
                <h4 style={{ textAlign: "center", marginTop: "30px" }}>
                  {note.title}
                </h4>
                <CardContent
                  style={{
                    padding: "15px",
                    textAlign: "center",
                    flex: "1 1 auto",
                  }}
                >
                  <CardContent style={{ fontSize: "0.9rem", color: "#555" }}>
                    {note.content}
                  </CardContent>
                </CardContent>
                <CardFooter
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px",
                  }}
                >
                  <Button
                    variant="outline"
                    onClick={() => console.log("Edit clicked")}
                    style={{ flex: "1 1 auto" }}
                  >
                    Edit
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => console.log("Delete clicked")}
                    style={{ flex: "1 1 auto", marginLeft: "10px" }}
                  >
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            fontSize: "1.5rem",
            color: "#333",
            backgroundColor: "#f8f9fa",
            borderRadius: "10px",
            padding: "20px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="#FF6B6B"
          >
            <path d="M18.13 2H5.87C4.9 2 4.13 2.78 4.13 3.76v16.47c0 1 .77 1.76 1.74 1.76h12.26c.97 0 1.74-.77 1.74-1.76V3.76C19.87 2.78 19.1 2 18.13 2zM16.5 18H7.5v-2h9zm0-4.5H7.5v-2h9zm0-4.5H7.5v-2h9zm2.5 9v2.25a.25.25 0 01-.25.25H18.5v-2h.75a.25.25 0 01.25.25zm0-4.5v2a.25.25 0 01-.25.25H18.5v-2h.75a.25.25 0 01.25.25zm0-4.5v2a.25.25 0 01-.25.25H18.5v-2h.75a.25.25 0 01.25.25z" />
          </svg>
          <p style={{ textAlign: "center", marginTop: "10px" }}>
            Oops! No notes found.
          </p>
        </div>
      )}
    </div>
  );
}
