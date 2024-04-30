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



interface Tag {
  id: number;
  name: string;
}

// const jwt_decode = require('jwt-decode');


export default function Create() {
  const [tag, setTag] = useState<Tag | null>(null);
  const [tagInput, setTagInput] = useState<string>("");
  const [editorText, setEditorText] = useState<string>("");
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

  const saveNote = async () => {
    if (!token || !userId) {
      console.log("Authentication token or user ID is missing.");
      return;
    }
  
    const data = {
      content: editorText,
      title: "Your title",
      tag: tag ? [tag.name] : [],
    };
  
    const headers = {
      Authorization: `Bearer ${token}`,
      "User-ID": userId.toString(), 
    };
  
    const response = await postAsync<any>("/api/v1/user", data, headers);
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
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>Create Notes</h2>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ flex: 1, marginRight: "20px" }}>
            <MdEditor
              style={{
                height: 700,
                border: "2px dashed black",
                backgroundColor: "GrayText",
                color: "white",
                fontSize: "25px",
              }}
              value={editorText}
              // renderHTML={(text) => mdParser.render(text)}
              renderHTML={(text) => <div dangerouslySetInnerHTML={{ __html: mdParser.render(text) }} />}
              onChange={handleEditorChange}
            />
            <div style={{ marginTop: "1rem", textAlign: "right" }}>
              <Button variant="secondary" onClick={saveNote}>
                Save Note
              </Button>
            </div>
          </div>
          <div style={{ width: 300 }}>
            {tag ? (
              <div style={{ marginBottom: 10 }}>
                <span
                  style={{
                    display: "inline-block",
                    background: "#e1e1e1",
                    borderRadius: "4px",
                    padding: "6px 12px",
                    marginRight: "4px",
                  }}
                >
                  {tag.name}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleRemoveTag}
                  style={{ cursor: "pointer" }}
                >
                  Remove
                </Button>
              </div>
            ) : (
              <div style={{ marginBottom: 10 }}>
                <input
                  type="text"
                  value={tagInput}
                  onChange={handleTagInputChange}
                  placeholder="Enter tag"
                  style={{ width: "100%" }}
                />
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleAddTag}
                  style={{ marginTop: "5px", width: "100%" }}
                >
                  Add Tag
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
