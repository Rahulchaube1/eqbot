const FILE = "Cat-0.70.2-x64.exe";
const RELEASE = `https://github.com/Rahulchaube1/eqbot/releases/download/cat-windows-v0.70.2/${FILE}`;

/** Follow the release host's signed redirect on the server and stream bytes to the original browser request. */
export async function installerResponse(request: Request, platform: string, fetcher = fetch): Promise<Response> {
  if (platform !== "windows") {
    return new Response("A native Cat installer is not available for this platform.", { status: 404 });
  }
  const headers = new Headers();
  for (const name of ["range", "if-range"]) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }
  const asset = await fetcher(RELEASE, { method: request.method, headers, redirect: "follow" });
  if (asset.status === 416) return new Response(null, { status: 416, headers: asset.headers });
  if (!asset.ok) return new Response("The installer is temporarily unavailable.", { status: 503 });
  const reply = new Headers({
    "content-type": "application/octet-stream",
    "content-disposition": `attachment; filename="${FILE}"`,
    "cache-control": "private, no-store",
  });
  for (const name of ["content-length", "content-range", "accept-ranges", "etag", "last-modified"]) {
    const value = asset.headers.get(name);
    if (value) reply.set(name, value);
  }
  return new Response(asset.body, { status: asset.status, headers: reply });
}
