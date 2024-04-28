import { relations, sql } from "drizzle-orm";
import { text, boolean, pgTable } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name:text("name").notNull(),
  email:text("email").notNull().unique(),
  password:text("password").notNull(),
  createdAt:text("createdAt").default(sql`CURRENT_TIMESTAMP`).notNull(),

});


export const notes = pgTable("notes", {
    id: text("id").primaryKey(),
    title:text("title").notNull(),
    content:text("content").notNull(),
    tag:text("tag"),
    userId:text("userId").references(()=>user.id,{onDelete:"cascade"}),
    createdAt:text("createdAt").default(sql`CURRENT_TIMESTAMP`).notNull(),
  });


//   ONE TO ONE MAPPING of table task to user

export const notesRelation=relations(notes,({one})=>({
    author:one(user,{
        fields:[notes.userId],
        references:[user.id]
    })
}))



// ONE TO MANY MAPPPING OF USER TO TASK TABLE
export const userRelation=relations(user,({many})=>({
    notes:many(notes),
}))