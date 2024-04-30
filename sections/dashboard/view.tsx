"use client";

import React, { useState, useEffect, useContext } from "react";
import { Sidebar } from "../../components/sidebar/view";
import { docsConfig } from "@/config/docs";
import { Card, CardFooter, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/provider/AuthProvider";
import { getAsync, putAsync, deleteAsync } from "@/utilities/page";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
  DialogTrigger,
} from "@/components/ui/dialog";

import { jwtDecode } from "jwt-decode";

interface Note {
  id: string;
  title: string;
  content: string;
  tags?: string[];
}

interface EditNoteDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editNote: Note;
  setEditNote: (note: Note) => void;
  handleEditNote: () => Promise<void>;
}

interface DeleteNoteDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  handleDeleteNote: () => Promise<void>;
}

export default function Dashboard() {
  const { user }: any = AuthContext();
  const [notes, setNotes] = useState<Note[]>([]);

  const [editNote, setEditNote] = useState<Note>({
    id: "",
    title: "",
    content: "",
    tags: [],
  });
  const [deleteNoteId, setDeleteNoteId] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const cardStyle = {
    width: "12rem",
    height: "10rem",
    borderRadius: "8px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.3s ease",
    transform: isHovered ? "scale(1.05)" : "scale(1)",
  };

  const handleEditNote = async () => {
    try {
      const updatedNote = await putAsync<Note>(
        `http://localhost:3000/dashboard/${editNote.id}`,
        {
          title: editNote.title,
          content: editNote.content,
          tags: editNote.tags || [],
        }
      );

      if (updatedNote) {
        console.log("Updated Note:", updatedNote);
        setEditDialogOpen(false);
        setNotes(
          notes.map((note) => (note.id === editNote.id ? updatedNote : note))
        );
      } else {
        throw new Error("Failed to update the note");
      }
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  const handleDeleteNote = async () => {
    try {
      await deleteAsync(`http://localhost:3000/dashboard/${deleteNoteId}`);
      setDeleteDialogOpen(false);
      setNotes(notes.filter((note) => note.id !== deleteNoteId));
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  useEffect(() => {
    const fetchNotes = async () => {
      if (!userId) {
        console.error("User ID is missing");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "User-ID": userId.toString(),
      };
      try {
        const notesData = await getAsync<Note[]>("/api/v1/user", { headers });
        console.log(notesData);
        setNotes(notesData || []);
      } catch (error) {
        console.error("Error fetching notes:", error);
        setNotes([]);
      }
    };

    fetchNotes();
  }, [userId, token]);

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
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <div style={{ flex: "0 0 10%" }}>
        <Sidebar items={docsConfig.sidebarNav} />
      </div>
      <div
        style={{
          flex: 1,
          padding: "2rem",
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        {notes.length > 0 ? (
          notes.map((note) => (
            <Card
              key={note.id}
              style={{
                width: "calc(20% - 20px)",
                height: "12rem",
                borderRadius: "8px",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                overflow: "auto",
                background: "linear-gradient(180deg, #ffffff 0%, #f3f3f3 100%)",
              }}
            >
              <CardContent style={{ textAlign: "center" }}>
                <div style={{ textAlign: "center", height: "3rem" }}>
                  <h4
                    style={{
                      marginBottom: "1rem",
                      fontSize: "20px",
                      fontWeight: "bold",
                    }}
                  >
                    {note.title}
                  </h4>
                </div>
                <div style={{ textAlign: "initial", height: "3rem" }}>
                  <p>{note.content}</p>
                </div>
              </CardContent>
              <CardFooter
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  alignSelf: "flex-end",
                  marginTop: "auto",
                }}
              >
                <Button
                  style={{ backgroundColor: "#4caf50", color: "#fff" }}
                  onClick={() => {
                    setEditNote(note);
                    setEditDialogOpen(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  style={{ backgroundColor: "#f44336", color: "#fff" }}
                  onClick={() => {
                    setDeleteNoteId(note.id);
                    setDeleteDialogOpen(true);
                  }}
                >
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div
            style={{
              flex: "1 1 100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              fontSize: "1.5rem",
              borderRadius: "10px",
              padding: "20px",
              border: "2px dashed #ddd",
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
      {editDialogOpen && (
        <EditNoteDialog
          isOpen={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          editNote={editNote as Note}
          setEditNote={setEditNote}
          handleEditNote={handleEditNote}
        />
      )}
      {deleteDialogOpen && (
        <DeleteNoteDialog
          isOpen={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          handleDeleteNote={handleDeleteNote}
        />
      )}
    </div>
  );
}

export function EditNoteDialog({
  isOpen,
  onOpenChange,
  editNote,
  setEditNote,
  handleEditNote,
}: EditNoteDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Note</DialogTitle>

          <DialogDescription>
            You can change your title and content here.
          </DialogDescription>
        </DialogHeader>
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
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            onClick={() => {
              handleEditNote();
              onOpenChange(false);
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function DeleteNoteDialog({
  isOpen,
  onOpenChange,
  handleDeleteNote,
}: DeleteNoteDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">Open Delete Confirmation</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Delete</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Are you sure you want to delete this note?
        </DialogDescription>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            onClick={() => {
              handleDeleteNote();
              onOpenChange(false); // Optionally close the dialog after the action
            }}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
