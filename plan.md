product spec (crisp)

input: concept prompt (“growing star”), style tags (“pixel, neon, outline”), frame count preset (4, 9 default, 16, 25), canvas size (e.g., 128×128), background (transparent/solid), guidance level (loose vs strict).

output: PNG sprite sheet, ZIP of individual frames, JSON atlas (frame x,y,w,h), and the per-frame prompts used.

AI behavior: LLM converts base concept + style into a frame plan, then generates a prompt per frame describing progression. image model generates each frame with consistent style.

pricing: free tier for 4 and 9. paid for 16/25 and HD > 256 px, transparent bg, and priority queue.

templates: prebuilt animations (growing star, blinking eye, walking cycle, flame, loading spinner) for one-click generation.

architecture (high level)

frontend: Next.js 14 (App Router), React, Tailwind, shadcn/ui. Client for auth + Stripe. Edge runtime for landing pages; server actions for jobs.

backend: Next.js API routes or a tiny NestJS/FastAPI service if you prefer separation. Use a job queue (BullMQ/Redis) to render frames off the request path.

LLM: prompt-writer component. Options: OpenAI/Anthropic for text; cache outputs by concept+style+frames.

image gen: pick one now, keep provider abstraction:

local: Stable Diffusion XL via ComfyUI or Automatic1111 API.

cloud: Stability API, Replicate, or AWS Bedrock SDXL/Kandinsky.

consistency layer:

fixed seed per animation; deterministic sampler.

style-lock: use LoRA/style preset or IP-Adapter reference image to enforce style.

frame progression via img2img chain: frame n+1 uses frame n as init with a strength schedule (low noise for small changes).

optional ControlNet (tile/lineart) to preserve structure while changing only scale/pose.

storage & delivery: S3-compatible bucket (R2/S3), Cloudflare Images or imgix for CDN. Signed URLs for downloads.

database: Postgres (Neon or Supabase). Redis for queue and short caches.

payments: Stripe Checkout + Billing (tiers). Webhooks to provision limits.

analytics/observability: PostHog + OpenTelemetry traces. Sentry for errors. Cron for cleanup.

SEO infra: Next sitemaps, OpenGraph images, schema.org, programmatic landing pages per template + style.

core data model (Postgres)

users(id, email, auth_provider, role, created_at)

projects(id, user_id, title, base_prompt, style_tags[], frames_count, size, bg, status, created_at)

frame_plans(id, project_id, llm_version, plan_json, created_at) // per-frame descriptions

jobs(id, project_id, status: queued|running|done|error, provider, seed, params_json, started_at, finished_at)

frames(id, project_id, index, s3_url, prompt_text, seed, strength, created_at)

assets(id, project_id, type: spritesheet|zip|atlas_json|preview, s3_url, meta_json)

subscriptions(user_id, stripe_customer_id, tier, limits_json)

rate_limits(user_id, window, count)

API surface (REST-ish)

POST /api/projects // create from base prompt + options

POST /api/projects/:id/plan // generate per-frame plan via LLM

POST /api/projects/:id/run // enqueue render job

GET /api/projects/:id // status + metadata

GET /api/projects/:id/frames

POST /api/projects/:id/spritesheet // assemble grid + atlas

GET /api/download/:assetId // signed download

POST /api/stripe/webhook

GET /api/templates // preset animations

GET /api/health // liveness

generation pipeline (state machine)

validate request and limits.

build style context:

normalize style tags to a locked descriptor: “pixel-art, 2-bit outline, neon edges, thick outline, flat shading.”

optional: allow user to upload a reference image for style. extract CLIP embedding for IP-Adapter.

LLM prompt-writing:

inputs: base_concept, frames_count, style_context, motion_type (scale, rotate, morph), bg, size.

outputs: plan_json = [{i, textual_change, parameters: {scale:+10%, rotation: +5deg}}...]

enforce constraints: keep subject identity constant, background constant, camera static.

inject a “style lock” suffix for each frame: “same palette, same outline width, identical camera, 1 subject.”

seed & schedule:

choose a single seed for the run; sampler = Euler a/DPMPP2M; cfg fixed.

for frame 1, text2img.

frames 2..N: img2img from previous, strength ramp e.g., 0.15 → 0.35 across frames to prevent drift.

if ControlNet used, feed canny/lineart from previous frame to preserve edges.

rendering workers:

queue worker pulls job, iterates frames, retries with jittered seed only if failure.

store each frame to S3, record prompt used.

assembly:

pack into grid: compute rows/cols based on preset (3×3 for 9, 4×4 for 16, 5×5 for 25, 1×4 for the weird horizontal 4).

compose to spritesheet PNG; build atlas JSON: {frames:{“0”:{x,y,w,h},…}, meta:{size, scale, version}}.

generate preview GIF/MP4 at 8–12 fps.

deliverables:

store assets table, return signed URLs, update project status=done.

frontend ux

home: hero + template gallery + interactive demo (4 frames) to entice signups.

“create” flow:

concept + style tags, frame count, size, bg.

style reference upload (optional).

generate plan preview: show per-frame captions; allow quick edits.

render. show live progress per frame.

results: preview loop, download spritesheet/zip/atlas, “open in” links for Phaser/Unity/Three.js samples.

history: list of past projects with re-run and upscale.

pricing: free vs pro. pro unlocks 16/25, larger sizes, transparent PNG, higher priority.

docs: how-to, SDK snippets, SEO candy.

image-provider abstraction

create an interface:

interface ImageProvider {
  text2img(opts): Promise<Image>;
  img2img(opts): Promise<Image>;
  controlNetImg2img?(opts): Promise<Image>;
}


implement adapters:

StabilityAdapter

ReplicateAdapter

LocalComfyAdapter

swap via env var.

consistency tactics that actually work

lock seed + style keywords + negative prompts (“no extra limbs, no camera change, single subject center”).

img2img chain with low strength.

IP-Adapter style reference embedding to enforce palette/line style.

if animation is geometric (like growing star), generate a vector mask per frame in code and feed as ControlNet depth/lineart to constrain silhouette.

optional: for pixel art, downscale to small, quantize palette, upscale with nearest neighbor to kill diffusion fuzz.

billing & limits

free: 9 frames at 128×128 max, opaque background, low queue priority.

pro: 16/25 frames, up to 512×512, transparent PNG, priority, batch runs.

rate limits: token bucket keyed by user_id; display remaining in UI.

Stripe: Checkout session, customer portal, webhooks to flip tier.

file outputs

spritesheet.png

frames.zip

atlas.json:

{
  "frames": {
    "frame_0": {"x":0,"y":0,"w":128,"h":128},
    "frame_1": {"x":128,"y":0,"w":128,"h":128}
  },
  "meta": {"size":{"w":384,"h":384}, "format":"grid", "fps": 10}
}


prompts.json: array of per-frame prompts for transparency.

security & abuse

prompt safety filter before LLM/image gen.

per-user sandboxed queues.

signed, short-lived URLs for downloads.

audit logs on generation events.

SEO plan that doesn’t flop

site architecture:

/ landing with clear H1 “Sprite Sheet Generator” and secondary “AI animation prompt writer.”

/templates/[slug] for each animation: growing-star, blinking-eye, fire-flame, walking-cycle, loading-spinner.

/styles/[slug] for styles: pixel-art, neon-outline, cel-shaded, vaporwave.

/gallery/[id] static pages for public opt-in user creations.

/docs/*: “how to make a sprite sheet,” “sprite sheet for Unity,” “Phaser sprite sheet,” “what is a spritesheet,” “json atlas format.”

programmatic SEO:

pre-render 50–100 template+style combos as static pages with unique copy, sample outputs, and schema.

technical SEO:

Next SEO tags, canonical URLs, human-friendly slugs.

OpenGraph + Twitter image for every template using a dynamic OG renderer that composites the first 4 frames into a strip.

sitemap.xml + robots.txt; incremental static regen for freshness.

schema.org:

Product for app

HowTo for docs

FAQPage on landing

page speed: images lazy-loaded, edge caching via Cloudflare.

content strategy:

10 pillar posts with code samples and downloadable sprites, internal linking to templates.

comparison posts: “sprite sheet vs GIF,” “best sprite sheet generators,” with your tool featured.

UGC gallery pages are indexable; captions include concept, style, frame count.

analytics:

track search terms users try; generate new template pages based on volume.

to-do list (from zero to live)
0) groundwork

set up monorepo (pnpm workspaces): apps/web, packages/core, workers/render.

env management with dotenv; secrets via Doppler or Vercel envs.

pick provider: start with Stability or Replicate for speed; keep LocalComfy adapter behind a feature flag.

1) backend foundation

scaffold Next.js app with App Router.

add Postgres via Prisma schema (tables above).

add Redis, BullMQ queue, worker process (separate Vercel/Server/EC2).

implement ImageProvider interface with a real adapter.

implement /api/projects, /plan, /run, /spritesheet.

write image compositor (node-canvas or sharp) to assemble sheets and export atlas JSON.

S3 client for upload; return signed URLs.

2) LLM prompt-writer

system prompt: “you are an animation planning engine. maintain style. do not change background or camera.”

function: buildFramePlan(base_concept, frames, style, motion_type). deterministic output order.

cache by hash(base_concept+style+frames) in Redis.

3) rendering worker

job schema: params, seed, steps schedule, control toggles.

loop frames: text2img then chained img2img; store each frame; record prompt used.

retries with backoff; if repeated drift, reduce strength by 0.05 and re-run that frame.

final assembly + store assets.

4) frontend app

landing: hero, template grid, feature callouts, SEO copy.

create wizard:

step 1: inputs

step 2: plan preview table with editable per-frame descriptions

step 3: render progress with logs

result page: preview loop, download buttons, “publish to gallery” toggle, “copy atlas JSON.”

account + history page. show credits remaining.

pricing page with Stripe Checkout integration.

5) auth, billing, limits

add Auth.js or Clerk. protect project routes.

integrate Stripe Checkout + webhook. set subscription.tier and quotas.

middleware to enforce quotas (frames_count, resolution, transparent BG).

6) templates & programmatic pages

create 20 starter templates x 6 styles. seed DB with sample outputs.

dynamic OG image function to show a 4-frame strip.

generate sitemap, structured data.

7) docs & dev snippets

write guides: Unity, Phaser, Godot import steps.

code snippets to auto-play the sheet in HTML canvas.

8) QA & hardening

fuzz test prompts for safety and drift.

determinism test: same seed → same first frame across runs.

load test: queue under burst of 50 jobs; verify isolation.

backups: daily DB snapshot; prune S3 temp files.

9) growth hooks

shareable preview page with one-tap post to social, watermark optional.

referral credits.

“remix this template” buttons on gallery pages.

10) post-MVP upgrades

keyframes mode: user defines frame 1 and frame N, app interpolates.

onion-skin overlay in preview.

vector export for simple shapes.

WebGPU local inference fallback for power users.

technical details worth stealing

strength schedule example for 9 frames: [0.18, 0.18, 0.20, 0.22, 0.24, 0.26, 0.28, 0.30, 0.32].

negative prompt baseline: “no extra limbs, no background change, no camera zoom, no text, no watermark, single centered subject, consistent palette.”

file naming: projectId/frame_000.png, spritesheet@128.png
, atlas.json.

grid math: cols = ceil(sqrt(n)) unless user picks fixed layout; for 9 use 3×3; for 4-horizontal force 4×1.

quick success checklist

 generate per-frame plan that reads like a storyboard

 chain img2img with fixed seed and strength schedule

 export spritesheet + atlas

 programmatic SEO pages live with OG previews

 Stripe paywall for 16/25 grids

 templates that look good even on free tier