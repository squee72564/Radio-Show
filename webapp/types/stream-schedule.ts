import {streamScheduleSchema } from "@/validations/stream-schedule";
import z from "zod";

export type StreamScheduleFormValues = z.infer<typeof streamScheduleSchema>;

export type StreamScheduleFormStateFieldErrorMap = Partial<{
  title: string[];
  tags: string[];
  "start-time": string[];
  "end-time": string[];
  "start-date": string[];
  "end-date": string[];
  days: string[];
  description: string[];
  conflicts: string[];
  password: string[];
}>;

export type StreamScheduleFormState = {
  success: boolean;
  message?: string;
  errors: StreamScheduleFormStateFieldErrorMap;
  values: Partial<StreamScheduleFormValues>;
};

export type Weekday = "MO" | "TU" | "WE" | "TH" | "FR" | "SA" | "SU";
export const weekdays: Weekday[] = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];
