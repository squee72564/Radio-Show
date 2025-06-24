import {
  Account,
  Authenticator,
  Session,
  StreamArchive,
  StreamInstance,
  StreamSchedule,
  User,
} from "@prisma/client";

export type UserRelations = {
  accounts: Account[];
  sessions: Session[];
  Authenticator: Authenticator[];
  streamSchedules: StreamSchedule[];
  streamInstances: StreamInstance[];
  streamArchives: StreamArchive[];
};

export type StreamScheduleRelations = {
  user: User;
  StreamInstance: StreamInstance[];
  streamArchives: StreamArchive[];
};

export type StreamInstanceRelations = {
  user: User;
  streamSchedule: StreamSchedule;
  streamArchives: StreamArchive[];
};

export type StreamArchiveRelations = {
  user: User;
  streamSchedule: StreamSchedule;
  streamInstance: StreamInstance;
};