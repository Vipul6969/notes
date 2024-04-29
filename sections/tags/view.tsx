"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Sidebar } from "../../components/sidebar/view";
import { docsConfig } from "@/config/docs";

import { Button } from "@/components/ui/button";

import { getAsync } from "@/utilities/page";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Note {
  id: string;
  title: string;
  content: string;
  tags?: string[];
}

const Tags = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      // Fetch all notes with tags
      const notesData = await getAsync<Note[]>("http://localhost:3000/notes");
      setNotes(notesData || []);
      setFilteredNotes(notesData || []);
    } catch (error) {
      console.error("Error fetching notes:", error);
      setNotes([]);
      setFilteredNotes([]);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <div style={{ flex: "0 0 10%" }}>
        <Sidebar items={docsConfig.sidebarNav} />
      </div>
      <div className="w-full">
        <div className="flex items-center py-2">
          <Input
            placeholder="Filter Tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Title</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNotes.map((note) => (
                <TableRow key={note.id}>
                  <TableCell>{note.id}</TableCell>
                  <TableCell>{note.tags?.join(", ")}</TableCell>
                  <TableCell>{note.title}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Tags;
