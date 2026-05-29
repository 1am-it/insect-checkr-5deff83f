# InsectAlert — Frontend

Frontend voor [InsectAlert](https://insect-alert.com): een consumenten-tool die
insect-ingrediënten in voedingslabels detecteert en uitlegt.

## Tech stack

Geverifieerd tegen `package.json`, `wrangler.jsonc` en `vite.config.ts`:

- **Taal**: TypeScript (strict)
- **Build tool**: Vite 7
- **Package manager**: Bun (`bun.lock` aanwezig)
- **Framework**: TanStack Start + TanStack Router (file-based routing in `src/routes/`)
- **UI**: React 19, Tailwind CSS v4, shadcn/ui (Radix primitives), lucide-react
- **Forms/validatie**: react-hook-form + Zod
- **Data**: TanStack Query
- **Runtime target**: Cloudflare Workers — `wrangler.jsonc` met `nodejs_compat`,
  entry `src/server.ts`, plus `@cloudflare/vite-plugin` in de bundle
- **Deploy**: via Lovable's publish-flow (geen `deploy`-script in `package.json`,
  geen `vercel.json` in deze repo)

## Lokale development

```bash
bun install
bun run dev        # vite dev server
bun run build      # productie-build
bun run build:dev  # development-mode build (sneller, voor preview/QA)
bun run preview    # serve productie-build lokaal
bun run lint       # eslint
bun run format     # prettier
```

## Hosting

| Omgeving       | URL                                                                |
| -------------- | ------------------------------------------------------------------ |
| Productie      | https://insect-alert.com                                           |
| Published      | https://insect-alert.lovable.app                                   |
| Preview (dev)  | https://id-preview--627efccb-9577-4d30-8a2d-569c3986d57f.lovable.app |

Deployment loopt volledig via Lovable. De Worker-bundle (`src/server.ts`) wordt
door het Cloudflare-Vite-plugin geproduceerd; publicatie naar het custom domain
wordt vanuit Lovable getriggerd.

## Backend

De API leeft in een aparte repo: **`1am-it/insect-alert`**. Deze frontend
spreekt die API aan via `src/lib/insectalert-api.ts`. Wijzigingen aan het
classifier-contract (vraag-categorisatie, kaart-data-shapes) horen daar thuis,
niet hier.

## Structuur (kort)

- `src/routes/` — file-based routes; root layout in `__root.tsx`
- `src/components/` — kaart-componenten (DecoderCard, DeflectionCard,
  ClarificationCard, FallbackCard) + QuestionResolver
- `src/components/insectalert/` — InsectAlert-specifieke UI primitives
  (StickerCard, PillButton, Blob, …)
- `src/lib/` — API-client en utilities
- `src/styles.css` — Tailwind v4 + design tokens (oklch)
