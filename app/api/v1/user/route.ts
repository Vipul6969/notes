import { NextApiResponse } from "next";
import { NextRequest } from "next/server";
import db from "../../../../db/drizzle";
import { notes } from "@/db/scheme";
import { v4 as uuidv4 } from "uuid";
import { eq, and } from "drizzle-orm";

export const POST = async (req: NextRequest, res: NextApiResponse) => {
  try {
    console.log(req);
    const data = await req.json();
    const { title, content, tag } = data;

    if (!title) {
      return Response.json({ error: "title is required" });
    }
    if (!content) {
      return Response.json({ error: "content is required" });
    }
    const userId = req.headers.get("User-Id");

    if (!userId) {
      return Response.json({ error: "User-Id header is missing" });
    }

    const task = await db
      .insert(notes)
      .values({
        id: uuidv4(),
        title: title,
        content: content,
        tag: tag,
        userId: userId,
      })
      .returning();

    return Response.json(task);
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ error: error });
  }
};

export const GET = async (req: NextRequest, res: NextApiResponse) => {
  try {
    const userId = req.headers.get("User-Id") as string;

    const userNotes = await db
      .select()
      .from(notes)
      .where(eq(notes.userId, userId))
      .execute();

    return Response.json(userNotes);
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ error: error });
  }
};



