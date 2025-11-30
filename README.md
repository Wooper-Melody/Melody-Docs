# Melody Documentation

This repository contains the official documentation for the Melody application. It is built with Quartz and intended to be published to GitHub Pages.


## Content

This site is the canonical handbook for the Melody application. The documentation is organized so you can quickly find design artifacts, practical how-tos, and developer references.

- **User Manual:** Step-by-step guides for end users (getting started, account flows, player usage, playlists, profiles, settings, FAQs, and troubleshooting).
- **Developer Manual:** Setup and development instructions for contributors and maintainers (local dev, architecture, code structure, testing, CI/CD, and deployment).
- **Architecture & Diagrams:** System diagrams (high-level architecture, service boundaries, data flow, deployment topology) and explanations of design decisions.
- **Decision Log / ADRs:** Architectural Decision Records documenting trade-offs and rationale for key choices (databases, microservices, third-party services, authentication model).
- **API & Integration Docs:** Server API references, expected payloads, authentication, and examples for integrating clients (mobile or web).
- **Tutorials & Examples:** Short walkthroughs that show common tasks end-to-end (create a playlist, upload content as an artist, connect a social login, run the app locally).


## User Manual 

The User Manual provides instructions and screenshots for everyday users. Typical topics:

- Account creation, login (email/password, federated providers), and password recovery
- Profile management and public profile sharing
- Browsing the catalog, searching, and recommendations
- Playback controls, queue management, and playlists
- Managing liked songs and library
- Privacy settings and notifications


## Developer Manual
The Developer Manual is aimed at contributors and maintainers. It will include:

- Local development setup: cloning, required tools, environment variables, how to run the site and services locally
- Project architecture: service boundaries, data stores, message flows, and deployment topology
- Build, test, and lint commands, plus how to run the test suite and measure coverage
- CI/CD: workflow overview, how releases are built and published (GitHub Actions or equivalent)
- How to extend the docs site (adding pages, assets, and custom Quartz plugins)


## Quick setup & build (local)

Prerequisites: Node.js (>= 22), npm.

Install dependencies and build the docs locally:

```bash
npm install
# build and serve the docs (the `docs` script runs a local server)
npm run docs
```

Or run the Quartz CLI directly:

```bash
npx quartz build --serve -d docs
```

After building, the generated site will be available in the `public/` output folder (and served when using the `--serve` option).

## Where to edit content

- Main content: `content/` — Markdown pages (.md) are the source of truth.
- Static assets (images, icons): `quartz/static/` — these are copied into the site during the build.

### Favicon

The site favicon is produced from `quartz/static/icon.png`. To change the favicon, replace that file with a square PNG (recommended 256×256 or 512×512), then rebuild — the Quartz Favicon emitter will generate `public/favicon.ico` automatically.

## Contributing

1. Edit or add Markdown files under `content/`.
2. Add any static images to `quartz/static/`.
3. Run `npm run docs` locally to preview changes.
4. Commit and push; GitHub Pages will publish the `public/` output (or any GitHub Pages workflow you have configured).


