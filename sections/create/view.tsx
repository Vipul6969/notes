"use client";

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
  const [tags, setTags] = useState<Tag[]>([]);
  const [tagInput, setTagInput] = useState<string>("");
  const [editorText, setEditorText] = useState<string>("");
  const mdParser = new Remarkable();

  const handleTagInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(event.target.value);
  };

  const handleAddTag = () => {
    if (tagInput.trim() !== "") {
      const newTag: Tag = { id: tags.length + 1, name: tagInput.trim() };
      setTags([...tags, newTag]);
      setTagInput("");
    }
  };

  const handleEditorChange = ({ text }: { text: string }) => {
    setEditorText(text);
  };

  const saveNote = async () => {
    console.log("Note content:", editorText);
    console.log("Tags:", tags);
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar items={docsConfig.sidebarNav} />
      <div
        style={{
          flex: 1,
          padding: "20px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <i>Create Notes</i>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <div style={{ flex: 1, padding: "1rem" }}>
            <MdEditor
              style={{ height: 300 }}
              value={editorText}
              renderHTML={(text) => mdParser.render(text)}
              onChange={handleEditorChange}
            />
            <div
              style={{
                marginTop: "1rem ",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Button variant="outline" onClick={saveNote}>
                Save Note
              </Button>
            </div>
          </div>
          <div
            style={{
              width: 300,
              marginLeft: 20,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ marginBottom: 10 }}>
              <input
                type="text"
                value={tagInput}
                onChange={handleTagInputChange}
                placeholder="Enter tags"
              />
              <Button variant="outline" size="sm" onClick={handleAddTag}>
                Add Tag
              </Button>
            </div>
            <div>
              {tags.map((tag) => (
                <span
                  key={tag.id}
                  style={{
                    display: "inline-block",
                    background: "#e1e1e1",
                    borderRadius: "4px",
                    padding: "6px 12px",
                    margin: "0 4px 4px 0",
                    transition: "background 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#ccc";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#e1e1e1";
                  }}
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
