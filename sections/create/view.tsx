"use client";

import { postAsync } from "@/utilities/page";
import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar/view";
import { docsConfig } from "@/config/docs";
import MdEditor from "react-markdown-editor-lite";
import { Button } from "@/components/ui/button";
import "react-markdown-editor-lite/lib/index.css";
import { Remarkable } from "remarkable";
import { jwtDecode } from "jwt-decode";
import { Badge } from "@/components/ui/badge";

interface Tag {
  id: number;
  name: string;
}

export default function Create() {
  const [tag, setTag] = useState<Tag | null>(null);
  const [tagInput, setTagInput] = useState<string>("");
  const [editorText, setEditorText] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const mdParser = new Remarkable();
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const handleTagInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(event.target.value);
  };

  const handleAddTag = () => {
    if (tagInput.trim() !== "") {
      const newTag: Tag = { id: 1, name: tagInput.trim() };
      setTag(newTag);
      setTagInput("");
    }
  };

  const handleRemoveTag = () => {
    setTag(null);
  };

  const handleEditorChange = ({ text }: { text: string }) => {
    setEditorText(text);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const saveNote = async () => {
    if (!token || !userId || !title) {
      console.log("Authentication token, user ID, or title is missing.");
      return;
    }

    const data = {
      title: title,
      content: editorText,
      tag: tag ? tag.name : "",
    };

    const headers = {
      Authorization: `Bearer ${token}`,
      "User-ID": userId.toString(),
    };

    const response = await postAsync<any>("/api/v1/user", data, headers);
    window.location.href = "/dashboard";
    console.log("Note saved successfully:", response?.data);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("mySecret");
    if (storedToken) {
      setToken(storedToken);
      const decoded: { user_id?: string } = jwtDecode(storedToken);
      if (decoded.user_id) {
        setUserId(decoded.user_id);
      }
    }
  }, []);

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Sidebar items={docsConfig.sidebarNav} />
      <div
        style={{
          flex: 1,
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <h1 style={{ marginBottom: "1rem", textAlign: "center" }}>
          Create Awesome Notes
        </h1>
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Enter your title"
          style={{
            marginBottom: "10px",
            padding: "12px",
            fontSize: "18px",
            width: "100%",
            borderRadius: "8px",
            border: "none",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            boxSizing: "border-box",
            outline: "none",
            color: "#333",
            backgroundColor: "#fff",
          }}
        />
        <MdEditor
          style={{
            border: "none",
            borderRadius: "8px",
            width: "100%",
            minHeight: "300px",
            marginBottom: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
          value={editorText}
          renderHTML={(text) => (
            <div dangerouslySetInnerHTML={{ __html: mdParser.render(text) }} />
          )}
          onChange={handleEditorChange}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            padding: "3rem",
            width: "100%",
          }}
        >
          {tag ? (
            <div
              style={{ display: "flex", flexDirection: "row", width: "90%" }}
            >
              <div
                style={{
                  marginRight: "10px",
                  padding: "10px",
                  fontSize: "14px",
                }}
              >
                <Badge variant="outline"> {tag.name}</Badge>
              </div>
              <Button
                variant="secondary"
                onClick={handleRemoveTag}
                style={{
                  padding: "18px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  background: "#fff",
                  color: "#E74C3C",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                Remove Tag
              </Button>
            </div>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "row", width: "90%" }}
            >
              <input
                type="text"
                value={tagInput}
                onChange={handleTagInputChange}
                placeholder="Enter tag"
                style={{
                  padding: "10px",
                  fontSize: "14px",
                  width: "200px",
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  boxSizing: "border-box",
                  outline: "none",
                  color: "#333",
                  backgroundColor: "#fff",
                }}
              />
              <Button
                variant="secondary"
                onClick={handleAddTag}
                style={{
                  padding: "18px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  marginLeft: "10px",
                  background: "#fff",
                  color: "#2980B9",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                Add Tag
              </Button>
            </div>
          )}
          <Button
            variant="secondary"
            onClick={saveNote}
            style={{
              padding: "16px 32px",
              fontSize: "18px",
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              transition: "transform 0.3s ease-in-out",
              width: "fit-content",
            }}
            onMouseDown={(e) =>
              (e.currentTarget.style.transform = "translateY(2px)")
            }
            onMouseUp={(e) =>
              (e.currentTarget.style.transform = "translateY(-2px)")
            }
          >
            Save Note
          </Button>
        </div>
      </div>
    </div>
  );
}
