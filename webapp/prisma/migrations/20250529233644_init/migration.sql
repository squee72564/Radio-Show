-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" DATETIME,
    "image" TEXT,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "role" TEXT NOT NULL DEFAULT 'LISTENER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL
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

    PRIMARY KEY ("userId", "credentialID"),
    CONSTRAINT "Authenticator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "StreamerApplication" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "contentDescription" TEXT NOT NULL,
    "plannedSchedule" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "reviewedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "StreamerApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "IcecastServer" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
    "lastHealthCheck" DATETIME,
    "healthStatus" TEXT NOT NULL DEFAULT 'UNKNOWN',
    "responseTime" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "MountPointPool" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "serverId" TEXT NOT NULL,
    "mountPoint" TEXT NOT NULL,
    "isReserved" BOOLEAN NOT NULL DEFAULT false,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "maxBitrate" INTEGER NOT NULL DEFAULT 320,
    "maxListeners" INTEGER NOT NULL DEFAULT 200,
    "totalUsageHours" REAL NOT NULL DEFAULT 0,
    "lastUsed" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MountPointPool_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "IcecastServer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Stream" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "slug" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mountType" TEXT NOT NULL DEFAULT 'DYNAMIC',
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
    "enableFallback" BOOLEAN NOT NULL DEFAULT true,
    "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "fallbackOrder" INTEGER,
    "fallbackWeight" INTEGER NOT NULL DEFAULT 1,
    "totalSessions" INTEGER NOT NULL DEFAULT 0,
    "totalListeners" INTEGER NOT NULL DEFAULT 0,
    "totalHours" REAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Stream_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Stream_icecastServerId_fkey" FOREIGN KEY ("icecastServerId") REFERENCES "IcecastServer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "StreamCredentials" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "streamId" TEXT NOT NULL,
    "sourcePassword" TEXT NOT NULL,
    "streamKey" TEXT NOT NULL,
    "harborPassword" TEXT,
    "harborPort" INTEGER,
    "allowedIPs" JSONB,
    "lastUsedIP" TEXT,
    "lastUsed" DATETIME,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "rotatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "StreamCredentials_streamId_fkey" FOREIGN KEY ("streamId") REFERENCES "Stream" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "StreamTag" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "StreamSchedule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "streamId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "startTime" DATETIME NOT NULL,
    "endTime" DATETIME NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "recurrenceRule" TEXT,
    "recurrenceEnd" DATETIME,
    "exceptions" JSONB,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "approvedAt" DATETIME,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "StreamSchedule_streamId_fkey" FOREIGN KEY ("streamId") REFERENCES "Stream" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "StreamSchedule_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "StreamSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "streamId" TEXT NOT NULL,
    "scheduleId" TEXT,
    "mountPointId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "scheduledStart" DATETIME NOT NULL,
    "scheduledEnd" DATETIME NOT NULL,
    "actualStart" DATETIME,
    "actualEnd" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
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
    "averageListeners" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "StreamSession_streamId_fkey" FOREIGN KEY ("streamId") REFERENCES "Stream" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "StreamSession_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "StreamSchedule" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "StreamSession_mountPointId_fkey" FOREIGN KEY ("mountPointId") REFERENCES "MountPointPool" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "StreamAnalytics" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "listeners" INTEGER NOT NULL,
    "bandwidth" BIGINT NOT NULL,
    "sourceQuality" JSONB,
    CONSTRAINT "StreamAnalytics_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "StreamSession" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "StreamRecording" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "format" TEXT NOT NULL DEFAULT 'mp3',
    "bitrate" INTEGER NOT NULL DEFAULT 128,
    "autoStart" BOOLEAN NOT NULL DEFAULT true,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "startTime" DATETIME,
    "endTime" DATETIME,
    "tempFilePath" TEXT,
    "duration" INTEGER,
    "fileSize" BIGINT,
    "processingStarted" DATETIME,
    "processingCompleted" DATETIME,
    "processingError" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "StreamRecording_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "StreamSession" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "NowPlaying" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "sessionId" TEXT,
    "archiveId" TEXT,
    "startedAt" DATETIME,
    "duration" INTEGER,
    "position" INTEGER,
    "listeners" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "StreamArchive" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
    "waveformData" JSONB,
    "thumbnailUrl" TEXT,
    "processingStatus" TEXT NOT NULL DEFAULT 'PROCESSING',
    "processingError" TEXT,
    "processingSteps" JSONB,
    "playCount" INTEGER NOT NULL DEFAULT 0,
    "downloadCount" INTEGER NOT NULL DEFAULT 0,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "StreamArchive_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "StreamSession" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "StreamArchive_recordingId_fkey" FOREIGN KEY ("recordingId") REFERENCES "StreamRecording" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FallbackPlaylist" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "playOrder" TEXT NOT NULL DEFAULT 'WEIGHTED_RANDOM',
    "shuffle" BOOLEAN NOT NULL DEFAULT true,
    "crossfade" INTEGER NOT NULL DEFAULT 3,
    "categories" JSONB,
    "tags" JSONB,
    "minDuration" INTEGER,
    "maxDuration" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "totalPlays" INTEGER NOT NULL DEFAULT 0,
    "lastPlayed" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "FallbackPlaylistItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "playlistId" TEXT NOT NULL,
    "archiveId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL DEFAULT 1,
    "customTitle" TEXT,
    "fadeIn" INTEGER,
    "fadeOut" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "FallbackPlaylistItem_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "FallbackPlaylist" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "FallbackPlaylistItem_archiveId_fkey" FOREIGN KEY ("archiveId") REFERENCES "StreamArchive" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "streamId" TEXT,
    "sessionId" TEXT,
    "archiveId" TEXT,
    "data" JSONB,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" DATETIME,
    "channels" JSONB NOT NULL,
    "deliveredAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "NotificationSubscription" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "streamReminders" BOOLEAN NOT NULL DEFAULT true,
    "streamStart" BOOLEAN NOT NULL DEFAULT true,
    "streamEnd" BOOLEAN NOT NULL DEFAULT false,
    "newArchives" BOOLEAN NOT NULL DEFAULT true,
    "systemAnnouncements" BOOLEAN NOT NULL DEFAULT true,
    "emailEnabled" BOOLEAN NOT NULL DEFAULT true,
    "pushEnabled" BOOLEAN NOT NULL DEFAULT false,
    "webEnabled" BOOLEAN NOT NULL DEFAULT true,
    "reminderMinutes" INTEGER NOT NULL DEFAULT 15,
    "quietHoursStart" TEXT,
    "quietHoursEnd" TEXT,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "pushSubscription" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "NotificationSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SystemConfig" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "siteName" TEXT NOT NULL DEFAULT 'Internet Radio',
    "siteUrl" TEXT NOT NULL,
    "description" TEXT,
    "maxConcurrentStreams" INTEGER NOT NULL DEFAULT 10,
    "maxStreamDurationHours" INTEGER NOT NULL DEFAULT 6,
    "maxRecordingSizeMB" INTEGER NOT NULL DEFAULT 500,
    "defaultMaxStreams" INTEGER NOT NULL DEFAULT 1,
    "defaultMaxListeners" INTEGER NOT NULL DEFAULT 100,
    "defaultMaxSchedules" INTEGER NOT NULL DEFAULT 10,
    "archiveRetentionDays" INTEGER NOT NULL DEFAULT 365,
    "autoDeleteEnabled" BOOLEAN NOT NULL DEFAULT false,
    "maxArchiveSizeMB" INTEGER NOT NULL DEFAULT 1000,
    "fallbackEnabled" BOOLEAN NOT NULL DEFAULT true,
    "fallbackCrossfade" INTEGER NOT NULL DEFAULT 3,
    "deadAirTimeoutSeconds" INTEGER NOT NULL DEFAULT 30,
    "requireStreamApproval" BOOLEAN NOT NULL DEFAULT false,
    "requireScheduleApproval" BOOLEAN NOT NULL DEFAULT false,
    "contentModerationEnabled" BOOLEAN NOT NULL DEFAULT true,
    "chatEnabled" BOOLEAN NOT NULL DEFAULT true,
    "analyticsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "smtpConfigured" BOOLEAN NOT NULL DEFAULT false,
    "pushConfigured" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "_StreamToStreamTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_StreamToStreamTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Stream" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_StreamToStreamTag_B_fkey" FOREIGN KEY ("B") REFERENCES "StreamTag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

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
CREATE INDEX "NowPlaying_type_idx" ON "NowPlaying"("type");

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
CREATE INDEX "FallbackPlaylist_isActive_isDefault_idx" ON "FallbackPlaylist"("isActive", "isDefault");

-- CreateIndex
CREATE INDEX "FallbackPlaylistItem_playlistId_position_idx" ON "FallbackPlaylistItem"("playlistId", "position");

-- CreateIndex
CREATE INDEX "FallbackPlaylistItem_weight_idx" ON "FallbackPlaylistItem"("weight");

-- CreateIndex
CREATE UNIQUE INDEX "FallbackPlaylistItem_playlistId_archiveId_key" ON "FallbackPlaylistItem"("playlistId", "archiveId");

-- CreateIndex
CREATE INDEX "Notification_userId_isRead_idx" ON "Notification"("userId", "isRead");

-- CreateIndex
CREATE INDEX "Notification_type_idx" ON "Notification"("type");

-- CreateIndex
CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationSubscription_userId_key" ON "NotificationSubscription"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "_StreamToStreamTag_AB_unique" ON "_StreamToStreamTag"("A", "B");

-- CreateIndex
CREATE INDEX "_StreamToStreamTag_B_index" ON "_StreamToStreamTag"("B");
