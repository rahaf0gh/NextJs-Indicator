// app/api/proxy/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fileUrl = searchParams.get("url");

  if (!fileUrl) return new Response("Missing URL", { status: 400 });

  try {
    const res = await fetch(fileUrl);
    if (!res.ok) return new Response("Failed to fetch file", { status: 500 });

    const arrayBuffer = await res.arrayBuffer();

    return new Response(arrayBuffer, {
      headers: {
        "Content-Type": res.headers.get("Content-Type") || "application/octet-stream",
      },
    });
  } catch (error) {
    return new Response("Fetch error", { status: 500 });
  }
}
