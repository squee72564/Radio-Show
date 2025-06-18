-- CreateEnum
CREATE TYPE "ScheduleStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'STREAMER', 'ADMIN', 'OWNER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "bio" TEXT,
    "status" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("provider","providerAccountId")
);

-- CreateTable
CREATE TABLE "Session" (
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("identifier","token")
);

-- CreateTable
CREATE TABLE "Authenticator" (
    "credentialID" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "credentialPublicKey" TEXT NOT NULL,
    "counter" INTEGER NOT NULL,
    "credentialDeviceType" TEXT NOT NULL,
    "credentialBackedUp" BOOLEAN NOT NULL,
    "transports" TEXT,

    CONSTRAINT "Authenticator_pkey" PRIMARY KEY ("userId","credentialID")
);

-- CreateTable
CREATE TABLE "StreamSchedule" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "ScheduleStatus" NOT NULL DEFAULT 'PENDING',
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT 'No Description',
    "tags" TEXT[] DEFAULT ARRAY['Muzak']::TEXT[],
    "startTime" TIMETZ(0) NOT NULL,
    "endTime" TIMETZ(0) NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "rrule" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "StreamSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StreamInstance" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "scheduledStart" TIMESTAMP(3) NOT NULL,
    "scheduledEnd" TIMESTAMP(3) NOT NULL,
    "streamScheduleId" TEXT NOT NULL,

    CONSTRAINT "StreamInstance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StreamArchive" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "streamScheduleId" TEXT NOT NULL,
    "streamInstanceId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "durationInSeconds" INTEGER,
    "fileSizeBytes" INTEGER,
    "format" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StreamArchive_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "Authenticator_credentialID_key" ON "Authenticator"("credentialID");

-- CreateIndex
CREATE INDEX "StreamSchedule_userId_password_idx" ON "StreamSchedule"("userId", "password");

-- CreateIndex
CREATE UNIQUE INDEX "StreamSchedule_userId_password_key" ON "StreamSchedule"("userId", "password");

-- CreateIndex
CREATE UNIQUE INDEX "StreamArchive_streamInstanceId_key" ON "StreamArchive"("streamInstanceId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Authenticator" ADD CONSTRAINT "Authenticator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StreamSchedule" ADD CONSTRAINT "StreamSchedule_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StreamInstance" ADD CONSTRAINT "StreamInstance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StreamInstance" ADD CONSTRAINT "StreamInstance_streamScheduleId_fkey" FOREIGN KEY ("streamScheduleId") REFERENCES "StreamSchedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StreamArchive" ADD CONSTRAINT "StreamArchive_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StreamArchive" ADD CONSTRAINT "StreamArchive_streamScheduleId_fkey" FOREIGN KEY ("streamScheduleId") REFERENCES "StreamSchedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StreamArchive" ADD CONSTRAINT "StreamArchive_streamInstanceId_fkey" FOREIGN KEY ("streamInstanceId") REFERENCES "StreamInstance"("id") ON DELETE CASCADE ON UPDATE CASCADE;
