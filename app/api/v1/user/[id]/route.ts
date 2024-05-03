import { NextApiResponse } from "next";
import { NextRequest } from "next/server";
import db from "@/db/drizzle";
import { notes } from "@/db/scheme";
import { v4 as uuidv4 } from "uuid";
import { eq, and } from "drizzle-orm";

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const id = params.id;
    //   const noteID = req.url.split("/").pop();
    const userId = req.headers.get("User-Id");
    console.log(id, userId);

    if (!userId) {
      return Response.json({ error: "User-Id header is missing" });
    }

    const existingNote = await db
      .select()
      .from(notes)
      .where(eq(notes.userId, userId))
      .execute();

    if (existingNote.length === 0) {
      return Response.json({ error: "Note not found or access denied" });
    }

    await db.delete(notes).where(eq(notes.id, id)).execute();

    return Response.json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ error: "Internal server error" });
  }
};

export const PUT = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const id = params.id;

    const userId = req.headers.get("User-Id");
    const data = await req.json();
    const { title, content, tag } = data;

    if (!userId) {
      return Response.json({ error: "User-Id header is missing" });
    }

    const existingNote = await db
      .select()
      .from(notes)
      .where(eq(notes.userId, userId))
      .execute();

    if (existingNote.length === 0) {
      return Response.json({ error: "Note not found or access denied" });
    }

    await db
      .update(notes)
      .set({
        title: title ?? existingNote[0].title,
        content: content ?? existingNote[0].content,
        tag: tag ?? existingNote[0].tag,
      })
      .where(eq(notes.id, id))
      .execute();

    return Response.json({ message: "Note updated successfully" });
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ error: error });
  }
};
