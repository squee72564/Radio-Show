// Seeding script for development testing

import { prisma } from "@/lib/db/prismaClient"
import { encryptSync } from "@/lib/utils"

async function main() {
  // Create default system configuration
  await prisma.systemConfig.upsert({
    where: { id: 'main' },
    update: {},
    create: {
      id: 'main',
      siteName: process.env.SITE_NAME || 'Radio Show',
      siteUrl: process.env.SITE_URL || 'http://localhost:3000',
      description: 'A community internet radio platform',
      
      maxConcurrentStreams: 10,
      maxStreamDurationHours: 6,
      maxRecordingSizeMB: 2000,

      defaultMaxStreams: 2,
      defaultMaxListeners: 100,
      defaultMaxSchedules: 10,

      maxArchiveSizeMB: 2000,

      fallbackEnabled: true,
      fallbackCrossfade: 3,
      deadAirTimeoutSeconds: 30,

      requireStreamApproval: true,
      requireScheduleApproval: true,

      chatEnabled: true,
      analyticsEnabled: true,

      smtpConfigured: !!process.env.SMTP_HOST,
      pushConfigured: !!process.env.VAPID_PUBLIC_KEY,
    },
  })

  // Create default IceCast server
  await prisma.icecastServer.upsert({
    where: { id: 'main-server' },
    update: {},
    create: {
      id: 'main-server',
      name: 'Main IceCast Server',
      hostname: process.env.ICECAST_HOST || 'localhost',
      port: parseInt(process.env.ICECAST_PORT || '8000'),
      
      adminUser: process.env.ICECAST_ADMIN_USER || 'admin',
      adminPass: encryptSync(process.env.ICECAST_ADMIN_PASS || 'hackme'),
      
      maxClients: 1000,
      maxSources: 25,
      location: 'Local Development',
      description: 'Primary streaming server',
      
      isActive: true,
      healthStatus: 'UNKNOWN',
    },
  })

  // Create mount point pool
  const server = await prisma.icecastServer.findUnique({
    where: { id: 'main-server' }
  })

  if (server) {
    // Create default mount points
    const mountPoints = [
      '/live'
    ]

    for (const mountPoint of mountPoints) {
      await prisma.mountPointPool.upsert({
        where: { mountPoint },
        update: {},
        create: {
          mountPoint,
          serverId: server.id,
          isReserved: false,
          isAvailable: true,
          maxBitrate: 320,
          maxListeners: 200,
        },
      })
    }
  }

  // Create default fallback playlist
  await prisma.fallbackPlaylist.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      name: 'Default Fallback',
      description: 'Default playlist when no live streams are active',
      playOrder: 'WEIGHTED_RANDOM',
      shuffle: true,
      crossfade: 3,
      isActive: true,
      isDefault: true,
    },
  })

}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })