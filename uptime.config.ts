import type { MaintenanceConfig, MonitorTarget, PageConfig, WorkerConfig } from './types/config'

/**
 * PureDNS Status Page Configuration
 * Deployed at: https://status.pure-dns.org
 *
 * Monitore sind nach Standort und Protokoll gruppiert.
 * IPs werden vom Worker für TCP-Checks verwendet; nie öffentlich angezeigt.
 */

const pageConfig: PageConfig = {
  title: 'PureDNS Status',
  logo: '/puredns-status-logo.svg',
  customFooter:
    '<p style="text-align: center; font-size: 12px; margin-top: 10px; color: #888;">PureDNS — Privacy-first DNS. <a href="https://pure-dns.org" target="_blank" style="color: #0099cc;">pure-dns.org</a></p>',
  links: [
    { link: 'https://pure-dns.org', label: 'Website' },
    { link: 'https://pure-dns.org/docs', label: 'Setup Guide' },
  ],
  group: {
    '🇩🇪 Germany – Frankfurt':   ['node-de-01-doh', 'node-de-01-dot', 'node-de-01-doq'],
    '🇦🇹 Austria – Vienna':     ['node-at-01-doh', 'node-at-01-dot', 'node-at-01-doq'],
    '🇷🇸 Serbia – Belgrade':    ['node-rs-01-doh', 'node-rs-01-dot', 'node-rs-01-doq'],
    '🇺🇸 United States – New York': ['node-us-01-doh', 'node-us-01-dot', 'node-us-01-doq'],
    '🇭🇰 Hong Kong – Hong Kong': ['node-hk-01-doh', 'node-hk-01-dot', 'node-hk-01-doq'],
    '🇵🇱 Poland – Warsaw':      ['node-pl-01-doh', 'node-pl-01-dot', 'node-pl-01-doq'],
    '⚙️ Infrastructure':        ['api-health', 'website'],
  },
}

/** Build DoH + DoT + DoQ monitors for a single edge node. */
function nodeMonitors(prefix: string, label: string, ip: string): MonitorTarget[] {
  return [
    {
      id: `${prefix}-doh`,
      name: 'DoH (HTTPS)',
      method: 'TCP_PING',
      target: `${ip}:443`,
      tooltip: `DNS-over-HTTPS · ${label}`,
      statusPageLink: 'https://pure-dns.org/docs',
      timeout: 10,
    },
    {
      id: `${prefix}-dot`,
      name: 'DoT (TLS)',
      method: 'TCP_PING',
      target: `${ip}:853`,
      tooltip: `DNS-over-TLS · ${label}`,
      statusPageLink: 'https://pure-dns.org/docs',
      timeout: 10,
    },
    {
      id: `${prefix}-doq`,
      name: 'DoQ (QUIC)',
      method: 'TCP_PING',
      target: `${ip}:853`,
      tooltip: `DNS-over-QUIC · ${label} (port 853)`,
      statusPageLink: 'https://pure-dns.org/docs',
      timeout: 10,
    },
  ]
}

const workerConfig: WorkerConfig = {
  kvWriteCooldownMinutes: 3,
  notification: {
    timeZone: 'Europe/Vienna',
    gracePeriod: 2,
  },
  monitors: [
    ...nodeMonitors('node-de-01', 'Frankfurt, Germany',    '45.145.42.184'),
    ...nodeMonitors('node-at-01', 'Vienna, Austria',       '91.244.70.155'),
    ...nodeMonitors('node-rs-01', 'Belgrade, Serbia',      '195.252.108.16'),
    ...nodeMonitors('node-us-01', 'New York, USA',         '143.20.112.35'),
    ...nodeMonitors('node-hk-01', 'Hong Kong',             '175.29.22.9'),
    ...nodeMonitors('node-pl-01', 'Warsaw, Poland',        '31.59.137.88'),
    // ─── Central Infrastructure ───────────────────────────────────────────────
    {
      id: 'api-health',
      name: '⚙️ API',
      method: 'GET',
      target: 'https://pure-dns.org/api/health',
      tooltip: 'PureDNS Central API health endpoint',
      expectedCodes: [200],
      statusPageLink: 'https://pure-dns.org',
    },
    {
      id: 'website',
      name: '🌐 Website',
      method: 'GET',
      target: 'https://pure-dns.org',
      tooltip: 'pure-dns.org',
      expectedCodes: [200],
      statusPageLink: 'https://pure-dns.org',
    },
  ] as MonitorTarget[],
}

const maintenances: MaintenanceConfig[] = []

export { maintenances, pageConfig, workerConfig }
