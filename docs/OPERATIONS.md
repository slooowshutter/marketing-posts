# Operations

Charlot runs on the home Mac from `/Users/marclamy/Code/charlot`. A symlink at `/Users/marclamy/Desktop/charlot` keeps the project visible on the Desktop without placing the background process inside macOS's protected Desktop directory.

## Runtime

- Next.js production backend: `127.0.0.1:3000`
- Process supervisor: Homebrew `supervisor`
- Supervisor program: `/opt/homebrew/etc/supervisor.d/charlot.ini`
- Start wrapper: `scripts/start-production.sh`
- HTTPS reverse proxy: Homebrew `caddy`
- Caddy configuration: `/opt/homebrew/etc/Caddyfile`
- Public review base URL: `https://charlot.176-130-165-0.sslip.io`
- Authentication: HTTP Basic Auth at Caddy; credentials are intentionally not stored in this repository

The backend binds only to loopback. Public traffic reaches Caddy through Bbox UPnP mappings:

- WAN TCP 80 → `192.168.1.123:8080` for ACME certificate challenges and HTTPS redirects
- WAN TCP 443 → `192.168.1.123:8443` for HTTPS

A default-profile Hermes watchdog renews these temporary mappings every 12 hours and alerts only when something breaks. Its script is `~/.hermes/scripts/charlot-network-watchdog.py`.

## Common commands

```bash
# App status and logs
supervisorctl status charlot
supervisorctl tail charlot

# Rebuild and restart safely
supervisorctl stop charlot
npm run check
supervisorctl start charlot

# Proxy status and config validation
brew services list
caddy validate --config /opt/homebrew/etc/Caddyfile
brew services restart caddy

# Router mappings
upnpc -l

# Local and public checks
curl -I http://127.0.0.1:3000/
curl -I https://charlot.176-130-165-0.sslip.io/
```

The unauthenticated public check must return `401`. An authenticated request must return `200`.

## Agent access

The default, marketing, and machine-observer Hermes profiles have the `charlot-carousel-studio` skill. Carousel agents must still read `AGENTS.md` and `content/carousels/README.md`, validate every JSON file, send the exact post review URL, and wait for Marc's explicit approval before preparing an OmniSocials publish action.

## Deploying code changes

```bash
git pull --ff-only
npm ci
supervisorctl stop charlot
npm run check
supervisorctl start charlot
```

New or edited JSON carousel files are loaded per request and do not require a rebuild. Changes to React, TypeScript, CSS, configuration, or dependencies require `npm run check` followed by a supervisor restart.

## Tailscale migration

The public Bbox route is temporary. Once Tailscale restores ownership of the `marclamy.com` tailnet:

1. Reconnect the Mac to the recovered tailnet.
2. Enable HTTPS certificates/Serve in the Tailscale admin console.
3. Run `tailscale serve --bg 3000` and verify the private URL.
4. Update the profile skills to use the Tailscale review base URL.
5. Remove WAN mappings 80 and 443 from the Bbox.
6. Stop Caddy if it has no other sites, then pause/remove the network watchdog.

Do not enable Tailscale Funnel; Charlot should remain private once Serve works.
