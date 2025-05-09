// app/api/proxy/route.ts
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const fileUrl = searchParams.get("url");
  
    if (!fileUrl) return new Response("Missing URL", { status: 400 });
  
    const res = await fetch(fileUrl);
    const blob = await res.blob();
  
    return new Response(blob, {
      headers: {
        "Content-Type": res.headers.get("Content-Type") || "application/octet-stream"
      }
    });
  }
  