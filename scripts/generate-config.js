#!/usr/bin/env node
// generate-config.js
// Called by GitHub Actions workflow with SERVERS_JSON env var
// Generates uptime.config.ts from the PureDNS fleet data

const servers = JSON.parse(process.env.SERVERS_JSON);

const COUNTRY_EMOJI = {
  DE: '🇩🇪', AT: '🇦🇹', RS: '🇷🇸', US: '🇺🇸',
  HK: '🇭🇰', PL: '🇵🇱', FR: '🇫🇷', NL: '🇳🇱',
  GB: '🇬🇧', CH: '🇨🇭', SE: '🇸🇪', FI: '🇫🇮',
  NO: '🇳🇴', DK: '🇩🇰', BE: '🇧🇪', ES: '🇪🇸',
  IT: '🇮🇹', PT: '🇵🇹', SG: '🇸🇬', JP: '🇯🇵',
  CA: '🇨🇦', AU: '🇦🇺', BR: '🇧🇷', NG: '🇳🇬',
};

function getMonitorId(server) {
  // Convert puredns-edge-de-01 → node-de-01
  const parts = server.name.split('-');
  if (parts.length >= 4) {
    return 'node-' + parts[parts.length - 2] + '-' + parts[parts.length - 1];
  }
  return 'node-' + server.name.replace(/[^a-z0-9]/g, '-');
}

const monitors = servers
  .filter(s => s.is_active)
  .filter(s => !s.maintenance_mode)
  .map(s => {
    const emoji = COUNTRY_EMOJI[s.country_code] || '🌐';
    const city = s.city || s.country_code;
    return {
      id: getMonitorId(s),
      name: emoji + ' ' + city,
      method: 'TCP_PING',
      target: s.ip_address_v4 + ':443',
      tooltip: 'DNS-over-HTTPS · ' + city + ', ' + s.country_code,
      statusPageLink: 'https://pure-dns.org',
    };
  });

// Add central infrastructure monitors
monitors.push({
  id: 'api-health',
  name: '⚙️ API',
  method: 'GET',
  target: 'https://pure-dns.org/api/health',
  tooltip: 'PureDNS Central API health endpoint',
  expectedCodes: [200],
  statusPageLink: 'https://pure-dns.org',
});
monitors.push({
  id: 'website',
  name: '🌐 Website',
  method: 'GET',
  target: 'https://pure-dns.org',
  tooltip: 'pure-dns.org',
  expectedCodes: [200],
  statusPageLink: 'https://pure-dns.org',
});

// Build maintenances for nodes in maintenance_mode
const maintenances = servers
  .filter(s => s.is_active && s.maintenance_mode)
  .map(s => {
    const now = Date.now();
    const endFarFuture = now + 365 * 24 * 60 * 60 * 1000;
    return {
      monitors: [getMonitorId(s)],
      title: 'Scheduled Maintenance',
      body: s.maintenance_reason || 'Node is under scheduled maintenance.',
      start: now,
      end: endFarFuture,
    };
  });

const monitorsJson = JSON.stringify(monitors, null, 4);
const maintenancesJson = JSON.stringify(maintenances, null, 4);

const config = `import type { MaintenanceConfig, MonitorTarget, PageConfig, WorkerConfig } from './types/config'

/**
 * PureDNS Status Page Configuration
 * Deployed at: https://status.pure-dns.org
 *
 * AUTO-GENERATED — managed by PureDNS Admin Dashboard.
 * Generated: ${new Date().toISOString()}
 *
 * Node IPs are used for TCP checks internally (Cloudflare Worker),
 * but NEVER displayed on the public status page.
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
    gracePeriod: 2,
  },
  monitors: ${monitorsJson} as MonitorTarget[],
}

const maintenances: MaintenanceConfig[] = ${maintenancesJson}

export { maintenances, pageConfig, workerConfig }
`;

require('fs').writeFileSync('uptime.config.ts', config);
console.log(`Generated uptime.config.ts with ${monitors.length} monitors and ${maintenances.length} maintenances.`);
