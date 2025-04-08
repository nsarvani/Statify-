import { pgTable, text, serial, integer, real, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const songs = pgTable("songs", {
  id: serial("id").primaryKey(),
  trackName: text("track_name").notNull(),
  artists: text("artists").notNull(),
  releasedDate: date("released_date").notNull(),
  streams: integer("streams").notNull(),
  bpm: integer("bpm").notNull(),
  key: text("key").notNull(),
  mode: text("mode").notNull(),
  danceability: real("danceability").notNull(),
  valence: real("valence").notNull(),
  energy: real("energy").notNull(),
  acousticness: real("acousticness").notNull(),
  instrumentalness: real("instrumentalness").notNull(),
  liveness: real("liveness").notNull(),
  speechiness: real("speechiness").notNull()
});

export const insertSongSchema = createInsertSchema(songs);

export type InsertSong = z.infer<typeof insertSongSchema>;
export type Song = typeof songs.$inferSelect;