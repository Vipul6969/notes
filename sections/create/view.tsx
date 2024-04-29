"use client";

import { postAsync } from "@/utilities/page";
import React, { useState } from "react";
import { Sidebar } from "@/components/sidebar/view";
import { docsConfig } from "@/config/docs";
import MdEditor from "react-markdown-editor-lite";
import { Button } from "@/components/ui/button";
import "react-markdown-editor-lite/lib/index.css";
import { Remarkable } from "remarkable";

interface Tag {
  id: number;
  name: string;
}

export default function Create() {
  const [tag, setTag] = useState<Tag | null>(null);
  const [tagInput, setTagInput] = useState<string>("");
  const [editorText, setEditorText] = useState<string>("");
  const mdParser = new Remarkable();

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
    try {
      const data = {
        content: editorText,
        title: "Your title",
        tags: tag ? [tag.name] : [],
      };
      const response = await postAsync<any>(
        "http://localhost:3000/notes/create",
        data
      );
      console.log("Note saved successfully:", response);
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

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
                height: 800,
                border: "2px dashed black",
                backgroundColor: "GrayText",
                color: "white",
                fontSize:"25px"
              }}
              value={editorText}
              renderHTML={(text) => mdParser.render(text)}
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
