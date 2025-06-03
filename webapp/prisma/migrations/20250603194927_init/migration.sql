-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('LISTENER', 'STREAMER', 'ADMIN');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "MountType" AS ENUM ('DEDICATED', 'DYNAMIC', 'SHARED');

-- CreateEnum
CREATE TYPE "ServerHealth" AS ENUM ('HEALTHY', 'DEGRADED', 'UNHEALTHY', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "ScheduleStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'ACTIVE', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "StreamStatus" AS ENUM ('SCHEDULED', 'PREPARING', 'LIVE', 'ENDING', 'ENDED', 'CANCELLED', 'FAILED');

-- CreateEnum
CREATE TYPE "RecordingStatus" AS ENUM ('PENDING', 'RECORDING', 'STOPPING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "ArchiveStatus" AS ENUM ('PROCESSING', 'READY', 'FAILED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "PlayOrder" AS ENUM ('SEQUENTIAL', 'RANDOM', 'WEIGHTED_RANDOM', 'POPULARITY');

-- CreateEnum
CREATE TYPE "PlayingType" AS ENUM ('LIVE', 'ARCHIVE', 'SILENCE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
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
CREATE TABLE "StreamerApplication" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "contentDescription" TEXT NOT NULL,
    "plannedSchedule" TEXT,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StreamerApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IcecastServer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hostname" TEXT NOT NULL,
    "port" INTEGER NOT NULL DEFAULT 8000,
    "adminUser" TEXT NOT NULL DEFAULT 'admin',
    "adminPass" TEXT NOT NULL,
    "maxClients" INTEGER NOT NULL DEFAULT 1000,
    "maxSources" INTEGER NOT NULL DEFAULT 25,
    "location" TEXT,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastHealthCheck" TIMESTAMP(3),
    "healthStatus" "ServerHealth" NOT NULL DEFAULT 'UNKNOWN',
    "responseTime" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IcecastServer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MountPointPool" (
    "id" TEXT NOT NULL,
    "serverId" TEXT NOT NULL,
    "mountPoint" TEXT NOT NULL,
    "isReserved" BOOLEAN NOT NULL DEFAULT false,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "maxBitrate" INTEGER NOT NULL DEFAULT 320,
    "maxListeners" INTEGER NOT NULL DEFAULT 200,
    "totalUsageHours" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lastUsed" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MountPointPool_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stream" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "slug" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mountType" "MountType" NOT NULL DEFAULT 'DYNAMIC',
    "dedicatedMount" TEXT,
    "icecastServerId" TEXT NOT NULL,
    "defaultBitrate" INTEGER NOT NULL DEFAULT 128,
    "defaultFormat" TEXT NOT NULL DEFAULT 'mp3',
    "maxBitrate" INTEGER NOT NULL DEFAULT 128,
    "channels" INTEGER NOT NULL DEFAULT 2,
    "sampleRate" INTEGER NOT NULL DEFAULT 44100,
    "maxListeners" INTEGER NOT NULL DEFAULT 100,
    "maxStreamHours" INTEGER NOT NULL DEFAULT 24,
    "autoRecord" BOOLEAN NOT NULL DEFAULT true,
    "enableChat" BOOLEAN NOT NULL DEFAULT true,
    "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "totalSessions" INTEGER NOT NULL DEFAULT 0,
    "totalListeners" INTEGER NOT NULL DEFAULT 0,
    "totalHours" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stream_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StreamCredentials" (
    "id" TEXT NOT NULL,
    "streamId" TEXT NOT NULL,
    "sourcePassword" TEXT NOT NULL,
    "streamKey" TEXT NOT NULL,
    "harborPassword" TEXT,
    "harborPort" INTEGER,
    "allowedIPs" JSONB,
    "lastUsedIP" TEXT,
    "lastUsed" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "rotatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StreamCredentials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StreamTag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StreamTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StreamSchedule" (
    "id" TEXT NOT NULL,
    "streamId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "recurrenceRule" TEXT,
    "recurrenceEnd" TIMESTAMP(3),
    "exceptions" JSONB,
    "status" "ScheduleStatus" NOT NULL DEFAULT 'PENDING',
    "approvedAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StreamSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StreamSession" (
    "id" TEXT NOT NULL,
    "streamId" TEXT NOT NULL,
    "scheduleId" TEXT,
    "mountPointId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "scheduledStart" TIMESTAMP(3) NOT NULL,
    "scheduledEnd" TIMESTAMP(3) NOT NULL,
    "actualStart" TIMESTAMP(3),
    "actualEnd" TIMESTAMP(3),
    "status" "StreamStatus" NOT NULL DEFAULT 'SCHEDULED',
    "sourceIp" TEXT,
    "userAgent" TEXT,
    "streamUrl" TEXT,
    "statsUrl" TEXT,
    "actualBitrate" INTEGER,
    "actualFormat" TEXT,
    "actualChannels" INTEGER,
    "peakListeners" INTEGER NOT NULL DEFAULT 0,
    "totalListeners" INTEGER NOT NULL DEFAULT 0,
    "totalBytes" BIGINT NOT NULL DEFAULT 0,
    "averageListeners" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StreamSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StreamAnalytics" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "listeners" INTEGER NOT NULL,
    "bandwidth" BIGINT NOT NULL,
    "sourceQuality" JSONB,

    CONSTRAINT "StreamAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StreamRecording" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "format" TEXT NOT NULL DEFAULT 'mp3',
    "bitrate" INTEGER NOT NULL DEFAULT 128,
    "autoStart" BOOLEAN NOT NULL DEFAULT true,
    "status" "RecordingStatus" NOT NULL DEFAULT 'PENDING',
    "startTime" TIMESTAMP(3),
    "endTime" TIMESTAMP(3),
    "tempFilePath" TEXT,
    "duration" INTEGER,
    "fileSize" BIGINT,
    "processingStarted" TIMESTAMP(3),
    "processingCompleted" TIMESTAMP(3),
    "processingError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StreamRecording_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StreamArchive" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT,
    "recordingId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "originalUrl" TEXT NOT NULL,
    "audioUrl" TEXT NOT NULL,
    "audioSize" BIGINT NOT NULL,
    "duration" INTEGER NOT NULL,
    "format" TEXT NOT NULL,
    "bitrate" INTEGER,
    "alternativeFormats" JSONB,
    "thumbnailUrl" TEXT,
    "processingStatus" "ArchiveStatus" NOT NULL DEFAULT 'PROCESSING',
    "processingError" TEXT,
    "processingSteps" JSONB,
    "playCount" INTEGER NOT NULL DEFAULT 0,
    "downloadCount" INTEGER NOT NULL DEFAULT 0,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StreamArchive_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemConfig" (
    "id" TEXT NOT NULL,
    "siteName" TEXT NOT NULL DEFAULT 'Internet Radio',
    "siteUrl" TEXT NOT NULL,
    "description" TEXT,
    "maxConcurrentStreams" INTEGER NOT NULL DEFAULT 10,
    "maxStreamDurationHours" INTEGER NOT NULL DEFAULT 6,
    "maxRecordingSizeMB" INTEGER NOT NULL DEFAULT 2000,
    "defaultMaxStreams" INTEGER NOT NULL DEFAULT 1,
    "defaultMaxListeners" INTEGER NOT NULL DEFAULT 100,
    "defaultMaxSchedules" INTEGER NOT NULL DEFAULT 10,
    "maxArchiveSizeMB" INTEGER NOT NULL DEFAULT 2000,
    "fallbackEnabled" BOOLEAN NOT NULL DEFAULT true,
    "fallbackCrossfade" INTEGER NOT NULL DEFAULT 3,
    "deadAirTimeoutSeconds" INTEGER NOT NULL DEFAULT 30,
    "requireStreamApproval" BOOLEAN NOT NULL DEFAULT false,
    "requireScheduleApproval" BOOLEAN NOT NULL DEFAULT false,
    "chatEnabled" BOOLEAN NOT NULL DEFAULT true,
    "analyticsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_StreamToStreamTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_StreamToStreamTag_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "Authenticator_credentialID_key" ON "Authenticator"("credentialID");

-- CreateIndex
CREATE UNIQUE INDEX "StreamerApplication_userId_key" ON "StreamerApplication"("userId");

-- CreateIndex
CREATE INDEX "StreamerApplication_status_idx" ON "StreamerApplication"("status");

-- CreateIndex
CREATE INDEX "IcecastServer_isActive_idx" ON "IcecastServer"("isActive");

-- CreateIndex
CREATE INDEX "IcecastServer_healthStatus_idx" ON "IcecastServer"("healthStatus");

-- CreateIndex
CREATE UNIQUE INDEX "MountPointPool_mountPoint_key" ON "MountPointPool"("mountPoint");

-- CreateIndex
CREATE INDEX "MountPointPool_serverId_idx" ON "MountPointPool"("serverId");

-- CreateIndex
CREATE INDEX "MountPointPool_isAvailable_isReserved_idx" ON "MountPointPool"("isAvailable", "isReserved");

-- CreateIndex
CREATE UNIQUE INDEX "Stream_slug_key" ON "Stream"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Stream_dedicatedMount_key" ON "Stream"("dedicatedMount");

-- CreateIndex
CREATE INDEX "Stream_userId_idx" ON "Stream"("userId");

-- CreateIndex
CREATE INDEX "Stream_slug_idx" ON "Stream"("slug");

-- CreateIndex
CREATE INDEX "Stream_isActive_isPublic_idx" ON "Stream"("isActive", "isPublic");

-- CreateIndex
CREATE INDEX "Stream_icecastServerId_idx" ON "Stream"("icecastServerId");

-- CreateIndex
CREATE UNIQUE INDEX "StreamCredentials_streamId_key" ON "StreamCredentials"("streamId");

-- CreateIndex
CREATE UNIQUE INDEX "StreamCredentials_streamKey_key" ON "StreamCredentials"("streamKey");

-- CreateIndex
CREATE INDEX "StreamCredentials_streamKey_idx" ON "StreamCredentials"("streamKey");

-- CreateIndex
CREATE INDEX "StreamCredentials_isActive_idx" ON "StreamCredentials"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "StreamTag_name_key" ON "StreamTag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "StreamTag_slug_key" ON "StreamTag"("slug");

-- CreateIndex
CREATE INDEX "StreamTag_usageCount_idx" ON "StreamTag"("usageCount");

-- CreateIndex
CREATE INDEX "StreamTag_isActive_idx" ON "StreamTag"("isActive");

-- CreateIndex
CREATE INDEX "StreamSchedule_streamId_idx" ON "StreamSchedule"("streamId");

-- CreateIndex
CREATE INDEX "StreamSchedule_userId_idx" ON "StreamSchedule"("userId");

-- CreateIndex
CREATE INDEX "StreamSchedule_startTime_endTime_idx" ON "StreamSchedule"("startTime", "endTime");

-- CreateIndex
CREATE INDEX "StreamSchedule_status_idx" ON "StreamSchedule"("status");

-- CreateIndex
CREATE UNIQUE INDEX "StreamSession_mountPointId_key" ON "StreamSession"("mountPointId");

-- CreateIndex
CREATE INDEX "StreamSession_streamId_idx" ON "StreamSession"("streamId");

-- CreateIndex
CREATE INDEX "StreamSession_scheduleId_idx" ON "StreamSession"("scheduleId");

-- CreateIndex
CREATE INDEX "StreamSession_scheduledStart_idx" ON "StreamSession"("scheduledStart");

-- CreateIndex
CREATE INDEX "StreamSession_status_idx" ON "StreamSession"("status");

-- CreateIndex
CREATE INDEX "StreamSession_actualStart_idx" ON "StreamSession"("actualStart");

-- CreateIndex
CREATE INDEX "StreamAnalytics_sessionId_idx" ON "StreamAnalytics"("sessionId");

-- CreateIndex
CREATE INDEX "StreamAnalytics_timestamp_idx" ON "StreamAnalytics"("timestamp");

-- CreateIndex
CREATE INDEX "StreamRecording_sessionId_idx" ON "StreamRecording"("sessionId");

-- CreateIndex
CREATE INDEX "StreamRecording_status_idx" ON "StreamRecording"("status");

-- CreateIndex
CREATE UNIQUE INDEX "StreamArchive_sessionId_key" ON "StreamArchive"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "StreamArchive_recordingId_key" ON "StreamArchive"("recordingId");

-- CreateIndex
CREATE INDEX "StreamArchive_processingStatus_idx" ON "StreamArchive"("processingStatus");

-- CreateIndex
CREATE INDEX "StreamArchive_isPublic_idx" ON "StreamArchive"("isPublic");

-- CreateIndex
CREATE INDEX "StreamArchive_playCount_idx" ON "StreamArchive"("playCount");

-- CreateIndex
CREATE INDEX "StreamArchive_createdAt_idx" ON "StreamArchive"("createdAt");

-- CreateIndex
CREATE INDEX "_StreamToStreamTag_B_index" ON "_StreamToStreamTag"("B");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Authenticator" ADD CONSTRAINT "Authenticator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StreamerApplication" ADD CONSTRAINT "StreamerApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MountPointPool" ADD CONSTRAINT "MountPointPool_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "IcecastServer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stream" ADD CONSTRAINT "Stream_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stream" ADD CONSTRAINT "Stream_icecastServerId_fkey" FOREIGN KEY ("icecastServerId") REFERENCES "IcecastServer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StreamCredentials" ADD CONSTRAINT "StreamCredentials_streamId_fkey" FOREIGN KEY ("streamId") REFERENCES "Stream"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StreamSchedule" ADD CONSTRAINT "StreamSchedule_streamId_fkey" FOREIGN KEY ("streamId") REFERENCES "Stream"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StreamSchedule" ADD CONSTRAINT "StreamSchedule_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StreamSession" ADD CONSTRAINT "StreamSession_streamId_fkey" FOREIGN KEY ("streamId") REFERENCES "Stream"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StreamSession" ADD CONSTRAINT "StreamSession_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "StreamSchedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StreamSession" ADD CONSTRAINT "StreamSession_mountPointId_fkey" FOREIGN KEY ("mountPointId") REFERENCES "MountPointPool"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StreamAnalytics" ADD CONSTRAINT "StreamAnalytics_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "StreamSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StreamRecording" ADD CONSTRAINT "StreamRecording_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "StreamSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StreamArchive" ADD CONSTRAINT "StreamArchive_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "StreamSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StreamArchive" ADD CONSTRAINT "StreamArchive_recordingId_fkey" FOREIGN KEY ("recordingId") REFERENCES "StreamRecording"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StreamToStreamTag" ADD CONSTRAINT "_StreamToStreamTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Stream"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StreamToStreamTag" ADD CONSTRAINT "_StreamToStreamTag_B_fkey" FOREIGN KEY ("B") REFERENCES "StreamTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
