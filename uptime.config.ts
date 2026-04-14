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
    '🇩🇪 Germany – Frankfurt':         ['node-de-01-doh', 'node-de-01-dot', 'node-de-01-doq'],
    '🇧🇪 Belgium – Brussels':          ['node-be-01-doh', 'node-be-01-dot', 'node-be-01-doq'],
    '🇳🇱 Netherlands':                 ['node-nl-01-doh', 'node-nl-01-dot', 'node-nl-01-doq'],
    '🇫🇷 France – Paris':              ['node-fr-01-doh', 'node-fr-01-dot', 'node-fr-01-doq'],
    '🇭🇷 Croatia – Zagreb':             ['node-hr-01-doh', 'node-hr-01-dot', 'node-hr-01-doq'],
    '🇭🇰 Hong Kong':                  ['node-hk-01-doh', 'node-hk-01-dot', 'node-hk-01-doq'],
    '🇯🇵 Japan – Tokyo':               ['node-jp-01-doh', 'node-jp-01-dot', 'node-jp-01-doq'],
    '🇳🇬 Nigeria – Lagos':             ['node-ng-01-doh', 'node-ng-01-dot', 'node-ng-01-doq'],
    '🇺🇸 United States (East) – NY':   ['node-us-02-doh', 'node-us-02-dot', 'node-us-02-doq'],
    '🇺🇸 United States (West) – LA':   ['node-us-03-doh', 'node-us-03-dot', 'node-us-03-doq'],
    '🇺🇸 United States (West) – SJ':   ['node-us-04-doh', 'node-us-04-dot', 'node-us-04-doq'],
    '⚙️ Infrastructure':               ['api-health', 'website'],
  },
}

/** Build DoH + DoT + DoQ monitors for a single edge node. */
function nodeMonitors(prefix: string, label: string, ip: string, host: string): MonitorTarget[] {
  return [
    {
      id: `${prefix}-doh`,
      name: 'DoH (HTTPS)',
      // TCP_PING on port 443 is blocked by Cloudflare Workers egress policy.
      // Use HTTP GET with the node hostname so Cloudflare proxies it normally.
      method: 'GET',
      target: `https://${host}/dns-query`,
      expectedCodes: [200, 400],  // 400 = no DNS query param, but server is up
      tooltip: `DNS-over-HTTPS · ${label}`,
      statusPageLink: 'https://pure-dns.org/docs',
    },
    {
      id: `${prefix}-dot`,
      name: 'DoT (TLS)',
      method: 'TCP_PING',
      target: `${ip}:853`,
      tooltip: `DNS-over-TLS · ${label}`,
      statusPageLink: 'https://pure-dns.org/docs',
      timeout: 10000,
    },
    {
      id: `${prefix}-doq`,
      name: 'DoQ (QUIC)',
      method: 'TCP_PING',
      target: `${ip}:853`,
      tooltip: `DNS-over-QUIC port 853 · ${label}`,
      statusPageLink: 'https://pure-dns.org/docs',
      timeout: 10000,
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
    // ─── Active Fleet — updated 2026-04-14 ───────────────────────────────────────
    // Added: fr-01 (Paris), hr-01 (Zagreb), us-04 (San Jose)
    // Removed: at-01, rs-01, us-01, pl-01 (decommissioned)
    ...nodeMonitors('node-de-01', 'Frankfurt, Germany',      '45.145.42.184',   'de-01-base.pure-dns.org'),
    ...nodeMonitors('node-be-01', 'Brussels, Belgium',       '79.127.224.10',   'be-01-base.pure-dns.org'),
    ...nodeMonitors('node-nl-01', 'Netherlands',             '82.25.56.137',    'nl-01-base.pure-dns.org'),
    ...nodeMonitors('node-fr-01', 'Paris, France',           '109.61.81.68',    'fr-01-base.pure-dns.org'),
    ...nodeMonitors('node-hr-01', 'Zagreb, Croatia',         '169.150.242.11',  'hr-01-base.pure-dns.org'),
    ...nodeMonitors('node-hk-01', 'Hong Kong',               '175.29.22.9',     'hk-01-base.pure-dns.org'),
    ...nodeMonitors('node-jp-01', 'Tokyo, Japan',            '95.173.204.39',   'jp-01-base.pure-dns.org'),
    ...nodeMonitors('node-ng-01', 'Lagos, Nigeria',          '31.59.137.88',    'ng-01-base.pure-dns.org'),
    ...nodeMonitors('node-us-02', 'New York, USA (East)',    '95.173.192.152',  'us-02-base.pure-dns.org'),
    ...nodeMonitors('node-us-03', 'Los Angeles, USA (West)', '79.127.250.38',   'us-03-base.pure-dns.org'),
    ...nodeMonitors('node-us-04', 'San Jose, USA (West)',    '169.150.221.209', 'us-04-base.pure-dns.org'),
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
