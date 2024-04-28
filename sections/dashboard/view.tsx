"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "../../components/sidebar/view";
import { docsConfig } from "@/config/docs";
import { Card } from "@/components/ui/card";
import { CardFooter } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/provider/AuthProvider";
import { getAsync, putAsync, deleteAsync } from "@/utilities/page";
import {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { v4 as uuidv4 } from "uuid";


interface Note {
  id: string;
  title: string;
  content: string;
  tags?: string[];
}

export default function Dashboard() {
  const { user }: any = AuthContext();
  const [notes, setNotes] = useState<any[] | undefined>(undefined);

  const [editNote, setEditNote] = useState({
    id: uuidv4(),
    title: "",
    content: "",
    tags: [],
  });
  const [deleteNoteId, setDeleteNoteId] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const getNotes = async () => {
    try {
      const notesData = await getAsync<any[]>("http://localhost:3000");
      setNotes(notesData);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  useEffect(() => {
    getNotes();
  }, []);

  const handleEditNote = async () => {
    try {
      const updatedNote = await putAsync<any>(
        `http://localhost:3000/dashboard/${editNote.id}`,
        {
          title: editNote.title,
          content: editNote.content,
          tags: editNote.tags || [],
        }
      );
      console.log("Updated Note:", updatedNote);
      setEditDialogOpen(false);
      setNotes(
        notes?.map((note) => (note.id === editNote.id ? updatedNote : note))
      );
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  const handleDeleteNote = async () => {
    try {
      const response = await deleteAsync<any>(
        `http://localhost:3000/dashboard/${deleteNoteId}`
      );
      console.log("Delete Note Response:", response);
      setDeleteDialogOpen(false);
      setNotes(notes?.filter((note) => note.id !== deleteNoteId));
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <div style={{ flex: "0 0 10%" }}>
        <Sidebar items={docsConfig.sidebarNav} />
      </div>
      {user?.isLogin ? (
        <div
          style={{
            flex: 1,
            backgroundImage: `url(notes/public/galaxy.jpg)`,
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
            {notes?.map((note) => (
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
                    onClick={() => {
                      setEditNote({
                        id: note.id,
                        title: note.title,
                        content: note.content,
                      });
                      setEditDialogOpen(true);
                    }}
                    style={{ flex: "1 1 auto" }}
                  >
                    Edit
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => {
                      setDeleteNoteId(note.id);
                      setDeleteDialogOpen(true);
                    }}
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
      {editDialogOpen && (
        <DialogOverlay>
          <EditNoteDialog
            isOpen={editDialogOpen}
            onClose={() => setEditDialogOpen(false)}
            editNote={editNote}
            setEditNote={setEditNote}
            handleEditNote={handleEditNote}
          />
        </DialogOverlay>
      )}
      {/* Delete dialog */}
      {deleteDialogOpen && (
        <DialogOverlay>
          <DeleteNoteDialog
            isOpen={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
            handleDeleteNote={handleDeleteNote}
          />
        </DialogOverlay>
      )}
    </div>
  );
}

interface EditNoteDialog{
  isOpen: any,
  onClose:any,

}

// EditNoteDialog component
export function EditNoteDialog({
  isOpen,
  onClose,
  editNote,
  setEditNote,
  handleEditNote,
}) {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogHeader>
        <DialogTitle>Edit Note</DialogTitle>
      </DialogHeader>
      <DialogContent>
        {/* Your form inputs for editing */}
        <input
          type="text"
          value={editNote.title}
          onChange={(e) => setEditNote({ ...editNote, title: e.target.value })}
        />
        <textarea
          value={editNote.content}
          onChange={(e) =>
            setEditNote({ ...editNote, content: e.target.value })
          }
        />
      </DialogContent>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleEditNote}>Save</Button>
      </DialogFooter>
    </Dialog>
  );
}

// DeleteNoteDialog component
export function DeleteNoteDialog({ isOpen, onClose, handleDeleteNote }) {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogHeader>
        <DialogTitle>Confirm Delete</DialogTitle>
      </DialogHeader>
      <DialogContent>
        <DialogDescription>
          Are you sure you want to delete this note?
        </DialogDescription>
      </DialogContent>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleDeleteNote}>Delete</Button>
      </DialogFooter>
    </Dialog>
  );
}
