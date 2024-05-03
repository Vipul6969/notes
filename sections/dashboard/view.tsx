"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Sidebar } from "../../components/sidebar/view";
import { docsConfig } from "@/config/docs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardFooter, CardContent } from "@/components/ui/card";
import { getAsync, putAsync, deleteAsync } from "@/utilities/page";
import { jwtDecode } from "jwt-decode";
import ReactMarkdown from "react-markdown";
import { FcSearch } from "react-icons/fc";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Note {
  id: string;
  title: string;
  content: string;
  tag?: string;
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
  const [notes, setNotes] = useState<Note[]>([]);
  const [userDetail, setUserDetail] = useState<string>("");
  const [editNote, setEditNote] = useState<Note>({
    id: "",
    title: "",
    content: "",
    tag: "",
  });
  const [deleteNoteId, setDeleteNoteId] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState<string | null>(null);
  const [searchMode, setSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleEditNote = async (id: string) => {
    if (!userId) {
      console.error("User ID is missing");
      return;
    }
    const headers = {
      Authorization: `Bearer ${token}`,
      "User-ID": userId.toString(),
    };
    try {
      const updatedNote: Note | undefined = await putAsync(
        `/api/v1/user/${id}`,
        {
          title: editNote.title,
          content: editNote.content,
          tag: editNote.tag || "",
        },
        { headers }
      );

      if (updatedNote !== undefined) {
        console.log("Updated Note:", updatedNote);
        setEditDialogOpen(false);
        setNotes((prevNotes) =>
          prevNotes.map((note) =>
            note.id === editNote.id ? updatedNote : note
          )
        );
        fetchNotes();
      } else {
        throw new Error("Failed to update the note");
      }
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  const handleDeleteNote = async (id: string) => {
    if (!userId) {
      console.error("User ID is missing");
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      "User-ID": userId.toString(),
    };
    try {
      await deleteAsync(`/api/v1/user/${id}`, { headers });
      console.log("success");
      setDeleteDialogOpen(false);
      setNotes(notes.filter((note) => note.id !== id));
      fetchNotes();
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  function formatEmail(email: string | null) {
    if (!email) return "";
    const namePart = email.split("@")[0];
    return namePart.charAt(0).toUpperCase() + namePart.slice(1);
  }

  const fetchNotes = useCallback(async () => {
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
  }, [userId, token, setNotes]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  useEffect(() => {
    if (localStorage) {
      const userEmail = localStorage.getItem("userEmail");
      if (userEmail) {
        const formattedName = formatEmail(userEmail);
        setUserDetail(formattedName);
      }
    }
  }, []);

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

  const filteredNotes = notes.filter(
    (note) =>
      note.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (note.tag && note.tag?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <>
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <div style={{ flex: "0 0 10%" }}>
          <Sidebar items={docsConfig.sidebarNav} />
        </div>
        <div
          style={{
            display: "flex",
            minHeight: "100vh",

            flexDirection: "column",
            width: "100%",
          }}
        >
          <i style={{ marginLeft: "1rem" }}>Ready to start taking notes?</i>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",

              margin: "1rem",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                padding: "1rem",
                gap: "1rem",
              }}
            >
              <div>
                <AvatarDemo
                  initials={formatEmail(userDetail.charAt(0).toUpperCase())}
                />
              </div>
              <div>
                <h4
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    fontFamily: "Arial, sans-serif",
                  }}
                >
                  {userDetail || "user"}&apos; home !
                </h4>
              </div>
            </div>

            <div
              style={{
                position: "absolute",
                top: "2rem",
                right: "20px",
                cursor: "pointer",
              }}
            >
              <FcSearch
                style={{ fontSize: "30px" }}
                onClick={() => setSearchMode(!searchMode)}
              />
            </div>
          </div>
          {notes.length === 0 && (
            <div
              style={{
                textAlign: "center",

                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
                fontSize: "1.5rem",
                borderRadius: "10px",
                // paddingLeft: "10rem",
                // border: "2px dashed #ddd",
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

          {searchMode && (
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Notes..."
              style={{
                padding: "10px",
                margin: "1rem",

                width: "fit-content",
              }}
            />
          )}

          <div
            style={{
              padding: "2rem",
              display: "flex",
              height: "100%",
              width: "100%",
              flexWrap: "wrap",
              gap: "20px",
              // marginTop: "5rem",
            }}
          >
            {filteredNotes.length > 0 &&
              filteredNotes.map((note) => (
                <Card
                  key={note.id}
                  onMouseEnter={() => setIsHovered(note.id)}
                  onMouseLeave={() => setIsHovered(null)}
                  style={{
                    width: "calc(20% - 20px)",
                    minWidth: "15rem",

                    height: "fit-content",
                    borderRadius: "8px",
                    boxShadow:
                      isHovered === note.id
                        ? "0px 0px 15px rgba(255, 165, 0, 0.75)"
                        : "0px 4px 8px rgba(0, 0, 0, 0.1)",
                    background:
                      "linear-gradient(180deg, #ffffff 0%, #f3f3f3 100%)",
                    transform:
                      isHovered === note.id ? "scale(1.05)" : "scale(1)",
                    transition:
                      "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                    position: "relative",
                  }}
                >
                  {note.tag && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>
                        <Badge
                          variant="secondary"
                          style={{ padding: "8px", margin: "10px" }}
                        >
                          {note.tag.replace(/["{}]/g, "").toLowerCase() ||
                            "Not Available"}
                        </Badge>
                      </div>
                      <div style={{ padding: "10px" }}>
                        <Popover>
                          <PopoverTrigger>
                            <IoIosArrowDropdownCircle />
                          </PopoverTrigger>
                          <PopoverContent
                            style={{
                              gap: "1rem",
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
                            {" "}
                            <Button
                              variant="default"
                              size="sm"
                              // style={{ width: "100%" }}
                              onClick={() => {
                                setEditNote(note);
                                setEditDialogOpen(true);
                              }}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              // style={{ width: "100%" }}
                              onClick={() => {
                                setDeleteNoteId(note.id);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              Delete
                            </Button>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  )}
                  <CardContent
                    style={{
                      textAlign: "center",
                      overflow: "auto",
                      marginBottom: "1rem",
                    }}
                  >
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
                      <ReactMarkdown>{note.content}</ReactMarkdown>
                    </div>
                    {editDialogOpen && (
                    <EditNoteDialog
                      isOpen={editDialogOpen}
                      onOpenChange={setEditDialogOpen}
                      editNote={editNote}
                      setEditNote={setEditNote}
                      handleEditNote={() => handleEditNote(note.id)}
                    />
                  )}
                  {deleteDialogOpen && (
                    <DeleteNoteDialog
                      isOpen={deleteDialogOpen}
                      onOpenChange={setDeleteDialogOpen}
                      handleDeleteNote={() => handleDeleteNote(note.id)}
                    />
                  )}
                  </CardContent>

                 
                </Card>
              ))}
          </div>
        </div>
      </div>
    </>
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
              onOpenChange(false);
            }}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function AvatarDemo({ initials }: { initials: string }) {
  return (
    <Avatar>
      {/* Conditionally render image or initials */}
      {initials ? (
        <AvatarFallback>{initials}</AvatarFallback>
      ) : (
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      )}
    </Avatar>
  );
}
