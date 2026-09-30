# Oswal Kiln Seals R2 Image Architecture Prompt

Use this file as the exact handoff prompt for an AI working inside the `Oswal_Kiln_Seals` project.

## Goal

Implement the same image architecture used in the OSWAR Rotocorp project:

- source images are compressed to `webp` with `sharp`
- images are uploaded to Cloudflare R2 using the S3-compatible AWS SDK
- the app resolves image URLs through a single helper
- the frontend can load images either from a CDN/public R2 URL or through a Next.js proxy fallback
- upload scripts are reusable and organized by asset type

Important:

- use the same existing Cloudflare R2 credentials from secure local/project secrets
- do not hardcode or commit secrets
- use the shared `oswar-assets` bucket for the project
- separate project assets using a root folder prefix (e.g., `website_name/`)
- standardize on `R2_BUCKET` as the bucket env var name
- if older docs/examples mention `R2_BUCKET_NAME`, treat that as legacy and do not make it the primary variable

## Bucket / Naming Rules

Use the existing Cloudflare account and keys, and point them to the shared `oswar-assets` bucket. All uploads must be prefixed with the project's identifier.

Expected env shape:

```env
R2_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=<same-existing-key>
R2_SECRET_ACCESS_KEY=<same-existing-secret>
R2_BUCKET=oswar-assets
NEXT_PUBLIC_R2_CDN_URL=
NEXT_PUBLIC_R2_PUBLIC_URL=
```

Notes:

- `R2_BUCKET` must be the only required bucket variable used by code
- `NEXT_PUBLIC_R2_CDN_URL` is preferred if a custom CDN/domain exists
- `NEXT_PUBLIC_R2_PUBLIC_URL` is optional if using a public `*.r2.dev` URL
- if neither public URL is available, the app must still work via `/api/r2-image/[...path]`

## Architecture To Recreate

Implement these pieces in the target project.

### 1. Shared R2 client

Create `lib/r2/client.ts`.

Requirements:

- export `getR2Client()`
- use `@aws-sdk/client-s3`
- set `region: "auto"`
- read `R2_ENDPOINT`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`
- throw a clear error if any required env vars are missing

Behavior to match:

```ts
import { S3Client } from "@aws-sdk/client-s3";

export function getR2Client() {
  const endpoint = process.env.R2_ENDPOINT;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!endpoint || !accessKeyId || !secretAccessKey) {
    throw new Error("Missing R2 environment variables.");
  }

  return new S3Client({
    region: "auto",
    endpoint,
    credentials: { accessKeyId, secretAccessKey },
    forcePathStyle: true,
  });
}
```

### 2. Shared URL helper

Create `lib/r2/config.ts`.

Requirements:

- centralize the bucket name and public URL rules
- export `getR2AssetUrl(path: string)`
- remove a leading slash from incoming paths
- resolve URLs in this order:
  1. `NEXT_PUBLIC_R2_CDN_URL`
  2. `NEXT_PUBLIC_R2_PUBLIC_URL`
  3. `/api/r2-image/${path}`

Recommended shape:

```ts
export const R2_CONFIG = {
  BUCKET_NAME: process.env.R2_BUCKET || "",
  CDN_URL: process.env.NEXT_PUBLIC_R2_CDN_URL || "",
  PUBLIC_URL: process.env.NEXT_PUBLIC_R2_PUBLIC_URL || "",
};

export function getR2AssetUrl(path: string) {
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;

  if (R2_CONFIG.CDN_URL) return `${R2_CONFIG.CDN_URL}/${cleanPath}`;
  if (R2_CONFIG.PUBLIC_URL) return `${R2_CONFIG.PUBLIC_URL}/${cleanPath}`;
  return `/api/r2-image/${cleanPath}`;
}
```

### 3. Optional presigned URL helper

If the target project has authenticated/private upload or download flows, also create `lib/r2/presign.ts`.

Requirements:

- export `getR2UploadUrl()`
- export `getR2DownloadUrl()`
- use `@aws-sdk/s3-request-presigner`
- both functions must require `R2_BUCKET`

If the project only uses server-side scripts plus public/proxy serving, this file is optional.

### 4. Proxy route for image fetching

Create `app/api/r2-image/[...path]/route.ts`.

This route is critical because it allows the project to function even before a CDN/public bucket domain is configured.

Requirements:

- accept a catch-all path
- fetch the object from R2 with `GetObjectCommand`
- read `R2_BUCKET` at request time, not once at module load
- stream or buffer the response and return it with:
  - correct `Content-Type`
  - `Content-Disposition: inline`
  - `Cache-Control: public, max-age=31536000, immutable`
- catch AWS SDK exceptions properly (checking `error.name` and `error.Code`)
- return `404` for missing keys (`NoSuchKey`) or missing buckets (`NoSuchBucket`)
- return `500` for other failures with useful server logs

Supported file types should at least include:

- `image/webp`
- `image/png`
- `image/jpeg`
- `application/pdf`
- `video/mp4`

### 5. Next.js image configuration

Update `next.config.ts`.

Requirements:

- keep existing project-specific config intact
- extend `images.remotePatterns` so `next/image` can load from:
  - `*.r2.dev`
  - the custom CDN hostname if one exists
- keep `formats: ["image/avif", "image/webp"]`

Example:

```ts
images: {
  formats: ["image/avif", "image/webp"],
  remotePatterns: [
    { protocol: "https", hostname: "*.r2.dev" },
    { protocol: "https", hostname: "cdn.example.com" },
  ],
}
```

If the project uses only `/api/r2-image/...` URLs, `remotePatterns` is still helpful for future direct CDN usage.

## Upload Script Pattern

Create one or more scripts under `scripts/` that follow this exact architecture.

Recommended primary script:

- `scripts/upload-kiln-seal-images.ts`

Optional split if the project has many asset groups:

- `scripts/upload-product-images.ts`
- `scripts/upload-blog-images.ts`
- `scripts/upload-category-images.ts`

### Script requirements

Every upload script must:

- load `.env` and `.env.local` before anything else
- use `sharp`
- convert uploads to `webp`
- resize with `fit: "inside"` and `withoutEnlargement: true`
- upload using `PutObjectCommand`
- set `ContentType: "image/webp"`
- set `CacheControl: "public, max-age=31536000, immutable"`
- sanitize filenames
- generate stable R2 keys
- print a clear success/failure summary

### Compression settings to match

Use this as the default:

```ts
await sharp(inputPath)
  .webp({ quality: 80, effort: 6 })
  .resize(1920, 1080, { fit: "inside", withoutEnlargement: true })
  .toBuffer();
```

For smaller technical/product images, a slightly smaller bounding box is also acceptable:

```ts
.resize(1200, 900, { fit: "inside", withoutEnlargement: true })
```

### Env loading pattern

Use this at the top of each script:

```ts
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env") });
config({ path: resolve(process.cwd(), ".env.local"), override: true });
```

### Filename sanitization

Use stable, lowercase keys:

```ts
function sanitizeFilename(name: string) {
  return (
    name
      .toLowerCase()
      .replace(/\.(png|jpg|jpeg|webp)$/i, "")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "") + ".webp"
  );
}
```

### R2 key structure

Pick a predictable prefix structure and **always prefix with the website name**.

Recommended examples for `Oswal_Kiln_Seals` (using `oswal_kiln_seals/` as the root prefix):

```text
oswal_kiln_seals/products/kiln-seals/<file>.webp
oswal_kiln_seals/blog/<file>.webp
oswal_kiln_seals/clients/<file>.webp
oswal_kiln_seals/downloads/<file>.pdf
oswal_kiln_seals/HeroBG.mp4
```

Do not upload assets to the bucket root without a website-specific folder prefix.

## How The App Should Fetch Images

The target project must not hardcode bucket/public URLs all over the codebase.

Instead:

1. keep the raw key/path stable, for example `products/kiln-seals/flexseal.webp`
2. convert it to a usable URL through `getR2AssetUrl()`
3. use that returned URL in `next/image`, API responses, CMS mappings, and DB update scripts

### Required usage patterns

#### Static mapping usage

If a constants file or content file maps slugs to images, use:

```ts
image: getR2AssetUrl("products/kiln-seals/flexseal.webp");
```

#### DB-backed records

If the database stores image references:

- allow either a full URL or a raw key/path
- if a stored value already starts with `http` or `/api/r2-image/`, use it as-is
- otherwise pass it through `getR2AssetUrl()`

Use this normalization rule:

```ts
function normalizeR2Image(imagePath: string | null) {
  if (!imagePath) return null;
  if (imagePath.startsWith("http") || imagePath.startsWith("/api/r2-image/")) {
    return imagePath;
  }
  const cleanPath = imagePath.startsWith("/") ? imagePath.slice(1) : imagePath;
  return getR2AssetUrl(cleanPath);
}
```

This same pattern should be used in:

- API routes returning records with image fields
- server components rendering image fields
- list pages and detail pages

## If The Project Has Admin Uploads

If the new project supports browser/admin uploads, also implement:

- `app/api/upload/route.ts`
- an uploader component such as `components/admin/ImageUpload.tsx`

Requirements for `/api/upload`:

- accept multipart form data
- upload the file to R2 under a folder prefix
- return both `key` and `url`
- if no CDN/public URL exists, return `url` as `/api/r2-image/${key}` and not `/${key}`

That last fallback is important.

## Dependencies To Install

Install these if they are not already present:

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
npm install -D sharp tsx dotenv
```

If `sharp` must be a production dependency because uploads happen in runtime code instead of scripts, place it in regular dependencies instead of dev dependencies.

## What To Build For This Specific Project

Inside `Oswal_Kiln_Seals`, implement:

1. shared R2 utilities in `lib/r2/*`
2. proxy fetch route in `app/api/r2-image/[...path]/route.ts`
3. Next.js image config updates in `next.config.ts`
4. at least one reusable upload script for kiln seal images
5. image URL normalization anywhere DB/content values are rendered
6. optional DB update script if the project stores image URLs in a database
7. optional admin upload endpoint/component if that project already has admin media uploads

## Expected Deliverables

The AI should finish with:

- all required files created or updated
- env variables documented in `.env.example` or equivalent without secrets
- a concrete upload script ready for the project's real source image folder
- image rendering code wired to `getR2AssetUrl()`
- a short summary of which files were changed
- validation steps actually run if possible

## Validation Checklist

After implementation, verify all of the following:

1. an upload script successfully converts a local image to `webp`
2. the optimized object uploads into the new `Oswal_Kiln_Seals` bucket
3. `getR2AssetUrl("products/kiln-seals/test.webp")` returns:
   - CDN URL if CDN env is set
   - public R2 URL if public URL env is set
   - `/api/r2-image/products/kiln-seals/test.webp` otherwise
4. loading `/api/r2-image/<key>` returns the image successfully
5. `next/image` renders the uploaded asset without hostname errors
6. any DB or content-backed pages display the new images correctly
7. cache headers are present on uploaded/proxied images

## Guardrails

- do not commit secrets
- do not invent fake credentials
- do not replace unrelated existing image architecture unless necessary
- adapt to the target project's routing structure and data model
- preserve any existing styling/business logic
- if the target project already has partial R2 support, refactor toward one shared helper instead of duplicating logic

## Direct Instruction For The Target AI

Implement this now in the current project by inspecting the codebase first, then creating the missing R2 utilities, proxy route, upload script(s), config updates, and URL normalization. Reuse the existing Cloudflare R2 credentials from local secrets, targeting the shared `oswar-assets` bucket and prefixing all file keys with the website identifier (e.g., `oswal_kiln_seals/` or `new_website_name/`). Do not hardcode secrets. Use `R2_BUCKET` as the canonical bucket env var. Make the solution production-safe and ensure the app still works when no CDN/public bucket URL has been configured by falling back to `/api/r2-image/[...path]`.
