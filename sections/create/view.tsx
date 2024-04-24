"use client";

import React, { useState, ChangeEvent } from "react";
import { Sidebar } from "../../components/sidebar/view";
import { docsConfig } from "@/config/docs";
import { EditorState, ContentState, convertToRaw } from "draft-js";
import { Remarkable } from "remarkable";
import "remarkable/lib/index.js";
import "remarkable/dist/remarkable.min.css";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";

interface Tag {
  id: number;
  name: string;
}

export default function Create() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [tagInput, setTagInput] = useState<string>("");
  const [editorState, setEditorState] = useState<EditorState>(() =>
    EditorState.createEmpty()
  );
  const mdParser = new Remarkable();

  const handleTagInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTagInput(event.target.value);
  };

  const handleAddTag = () => {
    if (tagInput.trim() !== "") {
      const newTag: Tag = { id: tags.length + 1, name: tagInput.trim() };
      setTags([...tags, newTag]);
      setTagInput("");
    }
  };

  const onChange = (newEditorState: EditorState) => {
    setEditorState(newEditorState);
  };

  const saveNote = async () => {
    try {
      const contentState: ContentState = editorState.getCurrentContent();
      const content = convertToRaw(contentState);
      // Send HTTP request to save note with 'content' and 'tags'
      console.log("Note content:", content);
      console.log("Tags:", tags);
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ flex: "0 0 20%", minWidth: "200px" }}>
        <Sidebar items={docsConfig.sidebarNav} />
      </div>
      <div
        style={{
          flex: "1",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div>
          <input
            type="text"
            value={tagInput}
            onChange={handleTagInputChange}
            placeholder="Enter tags"
          />
          <button onClick={handleAddTag}>Add Tag</button>
        </div>
        <div>
          {tags.map((tag) => (
            <span key={tag.id}>{tag.name}</span>
          ))}
        </div>
        <div style={{ flex: "1", marginTop: "20px" }}>
          <h3>Markdown Editor:</h3>
          <MdEditor
            value={editorState.getCurrentContent().getPlainText()}
            renderHTML={(text) => mdParser.render(text)}
            onChange={({ text }) =>
              setEditorState(
                EditorState.createWithContent(
                  ContentState.createFromText(text)
                )
              )
            }
          />
        </div>
        <button onClick={saveNote}>Save Note</button>
      </div>
    </div>
  );
}
