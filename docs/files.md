# Images and files

Read when implementing image display, previews, uploads, or downloads.

These are accepted project rules, except items explicitly marked pending. Start with [AGENTS.md](../AGENTS.md) for the shared constraints and task routing.

## Images and files

- Static public assets belong in public/images or public/files as appropriate. Feature-owned images may be colocated and statically imported when useful. Never put private files, secrets, or user uploads in public.
- Prefer next/image for suitable content images. Supply meaningful alt text (empty for decorative images), reserve aspect ratio with dimensions or a sized fill container, and set sizes for responsive images. Lazy-load noncritical images; preload only deliberately selected critical images.
- Configure narrowly scoped remotePatterns for remote images processed by the Next.js optimizer. API JSON returns file metadata and URLs, not base64 or binary content inside value.
- Use normal binary GET responses for image display and downloads. Prefer direct URLs or authorized short-lived URLs when supported. Do not require multipart for reads or wrap binary responses in the JSON envelope.
- Do not place JWTs in file URLs. Protected files requiring an Authorization header need an explicit integration strategy: a signed URL, an appropriately secured endpoint, or an authorized fetch. The default Next.js image optimizer does not forward source authentication headers, and unoptimized does not add JWT headers either.
- Static exports must not depend on the default runtime image optimizer. Select a compatible image loader/CDN or unoptimized/preoptimized assets for that profile.
- Validate external image URL protocols and allowed destinations before rendering, including unoptimized images. The optimizer's remotePatterns configuration is not a browser destination validator when the optimizer is bypassed. The Pokémon schema allows only its HTTPS sprite/artwork paths, without credentials, query strings or fragments.
- Upload files exclusively using multipart/form-data with FormData and File/Blob values. Do not encode uploads or previews as base64/data URLs, use readAsDataURL, or serialize file bytes into JSON.
- For browser FormData requests, let the browser set Content-Type and its boundary. The shared HTTP client must not force application/json for FormData bodies.
- Send File/Blob directly without unnecessary full-file arrayBuffer/string conversions or duplicate copies. Bound file count, byte size, concurrency, and preview dimensions; define actual limits per integration. Multipart alone does not guarantee streaming or bounded memory in the browser, proxy, or backend.
- Prefer direct browser-to-backend uploads rather than buffering files through Next.js without a concrete requirement. Large-file/chunk/resumable protocols require an explicit integration decision; do not silently replace the approved multipart contract.
- Use object URLs for local previews when needed and revoke them on replacement, removal, and component disposal after consumers finish using them. Create URLs outside render; select a lifecycle mechanism compatible with the installed React version and apply the [useEffect exception policy](architecture.md#naming-and-organization) when necessary. Never use render side effects to evade the rule.
- Validate file size/type/count for UX; the backend remains responsible for authoritative file validation and access control. Handle upload cancellation/failure and image loading failure explicitly.
- Prefer direct download links for large files where authorization permits. Authorized fetch-to-Blob downloads may retain the complete response in memory and require bounded use and object-URL cleanup.

Reference documentation:

- https://nextjs.org/docs/app/api-reference/components/image
- https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest_API/Using_FormData_Objects
- https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL_static
