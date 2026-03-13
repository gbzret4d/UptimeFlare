import type { MaintenanceConfig, MonitorTarget, PageConfig, WorkerConfig } from './src/types'

/**
 * PureDNS Status Page Configuration
 * Deployed at: https://status.pure-dns.org
 *
 * Node IPs are used for TCP checks internally (Cloudflare Worker),
 * but NEVER displayed on the public status page.
 * Visitors only see the friendly name (e.g. "🇩🇪 Frankfurt (DE-01)").
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
    statusPageLink: 'https://status.pure-dns.org',
    timeZone: 'Europe/Vienna',
    // Grace period: 2 consecutive failures before alerting (= 2 minutes minimum downtime)
    gracePeriod: 2,
  },
  monitors: [
    // ─── DNS Edge Nodes ───────────────────────────────────────────────────────
    // IPs are used by the Cloudflare Worker for TCP checks; not displayed publicly.
    {
      id: 'node-de-01',
      name: '🇩🇪 Frankfurt',
      description: 'DNS Node — Germany',
      method: 'TCP',
      target: '45.145.42.184:443',
      tooltip: 'DNS-over-HTTPS',
      statusPageLink: 'https://pure-dns.org',
    },
    {
      id: 'node-at-01',
      name: '🇦🇹 Vienna',
      description: 'DNS Node — Austria',
      method: 'TCP',
      target: '91.244.70.155:443',
      tooltip: 'DNS-over-HTTPS',
      statusPageLink: 'https://pure-dns.org',
    },
    {
      id: 'node-rs-01',
      name: '🇷🇸 Belgrade',
      description: 'DNS Node — Serbia',
      method: 'TCP',
      target: '195.252.108.16:443',
      tooltip: 'DNS-over-HTTPS',
      statusPageLink: 'https://pure-dns.org',
    },
    {
      id: 'node-us-01',
      name: '🇺🇸 New York',
      description: 'DNS Node — United States',
      method: 'TCP',
      target: '143.20.112.35:443',
      tooltip: 'DNS-over-HTTPS',
      statusPageLink: 'https://pure-dns.org',
    },
    {
      id: 'node-hk-01',
      name: '🇭🇰 Hong Kong',
      description: 'DNS Node — Hong Kong',
      method: 'TCP',
      target: '175.29.22.9:443',
      tooltip: 'DNS-over-HTTPS',
      statusPageLink: 'https://pure-dns.org',
    },
    {
      id: 'node-pl-01',
      name: '🇵🇱 Warsaw',
      description: 'DNS Node — Poland',
      method: 'TCP',
      target: '31.59.137.88:443',
      tooltip: 'DNS-over-HTTPS',
      statusPageLink: 'https://pure-dns.org',
    },

    // ─── Central Infrastructure ───────────────────────────────────────────────
    {
      id: 'api-health',
      name: '⚙️ API',
      description: 'PureDNS Central API',
      method: 'GET',
      target: 'https://pure-dns.org/api/health',
      tooltip: 'API health endpoint',
      expectedCodes: [200],
      statusPageLink: 'https://pure-dns.org',
    },
    {
      id: 'website',
      name: '🌐 Website',
      description: 'pure-dns.org',
      method: 'GET',
      target: 'https://pure-dns.org',
      tooltip: 'pure-dns.org',
      expectedCodes: [200],
      statusPageLink: 'https://pure-dns.org',
    },
  ] satisfies MonitorTarget[],
}

const maintenances: MaintenanceConfig[] = []

export { maintenances, pageConfig, workerConfig }
