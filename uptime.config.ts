import type { MaintenanceConfig, MonitorTarget, PageConfig, WorkerConfig } from './types/config'

/**
 * PureDNS Status Page Configuration
 * Deployed at: https://status.pure-dns.org
 *
 * Node IPs are used for TCP checks internally (Cloudflare Worker),
 * but NEVER displayed on the public status page.
 * Visitors only see the friendly name (e.g. "🇩🇪 Frankfurt (DE-01)").
 *
 * AUTO-GENERATED CONFIG — managed by PureDNS Admin Dashboard.
 * Do not edit manually unless you know what you're doing.
 */

const pageConfig: PageConfig = {
  title: 'PureDNS Status',
  links: [
    { link: 'https://pure-dns.org', label: 'Website' },
  ],
}

const workerConfig: WorkerConfig = {
  kvWriteCooldownMinutes: 3,
  notification: {
    timeZone: 'Europe/Vienna',
    // Grace period: 2 consecutive failures before alerting (~2 min minimum downtime)
    gracePeriod: 2,
  },
  monitors: [
    // ─── DNS Edge Nodes ───────────────────────────────────────────────────────
    // IPs are used by the Cloudflare Worker for TCP checks; not displayed publicly.
    {
      id: 'node-de-01',
      name: '🇩🇪 Frankfurt',
      method: 'TCP',
      target: '45.145.42.184:443',
      tooltip: 'DNS-over-HTTPS · Frankfurt, Germany',
      statusPageLink: 'https://pure-dns.org',
    },
    {
      id: 'node-at-01',
      name: '🇦🇹 Vienna',
      method: 'TCP',
      target: '91.244.70.155:443',
      tooltip: 'DNS-over-HTTPS · Vienna, Austria',
      statusPageLink: 'https://pure-dns.org',
    },
    {
      id: 'node-rs-01',
      name: '🇷🇸 Belgrade',
      method: 'TCP',
      target: '195.252.108.16:443',
      tooltip: 'DNS-over-HTTPS · Belgrade, Serbia',
      statusPageLink: 'https://pure-dns.org',
    },
    {
      id: 'node-us-01',
      name: '🇺🇸 New York',
      method: 'TCP',
      target: '143.20.112.35:443',
      tooltip: 'DNS-over-HTTPS · New York, United States',
      statusPageLink: 'https://pure-dns.org',
    },
    {
      id: 'node-hk-01',
      name: '🇭🇰 Hong Kong',
      method: 'TCP',
      target: '175.29.22.9:443',
      tooltip: 'DNS-over-HTTPS · Hong Kong',
      statusPageLink: 'https://pure-dns.org',
    },
    {
      id: 'node-pl-01',
      name: '🇵🇱 Warsaw',
      method: 'TCP',
      target: '31.59.137.88:443',
      tooltip: 'DNS-over-HTTPS · Warsaw, Poland',
      statusPageLink: 'https://pure-dns.org',
    },

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
