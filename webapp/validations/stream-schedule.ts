import { z } from "zod";

export const streamScheduleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  tags: z.string(),

  "start-time": z.string().regex(/^\d{2}:\d{2}$/, "Invalid start time"),
  "end-time": z.string().regex(/^\d{2}:\d{2}$/, "Invalid end time"),
  "start-date": z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid start date"),
  "end-date": z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid end date"),

  days: z.array(z.enum(["MO", "TU", "WE", "TH", "FR", "SA", "SU"])).nonempty("At least one day is required"),

  password: z.string()
    .min(8, "Minimum 8 characters")
    .max(32, "Maximum 32 characters")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/\d/, "Must contain at least one number"),
});