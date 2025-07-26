import { z } from "zod";

export const NewsletterGroupsSchema = z.object({
  id: z.number(),
  name: z.string(),
  person_ids: z.array(z.number()),
});

export const NewsletterPeopleSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  designation: z.string(),
});

export type NewsletterGroups = z.infer<typeof NewsletterGroupsSchema>;
export type NewsletterPeople = z.infer<typeof NewsletterPeopleSchema>;
