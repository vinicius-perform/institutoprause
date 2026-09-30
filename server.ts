import { serve } from "bun";
import { join } from "path";

const DESIRED_PORTS = [3000, 3001, 3002, 3333, 8080];

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

async function startServer() {
  const rootDir = import.meta.dir;
  const publicDir = join(rootDir, "public");

  for (const port of DESIRED_PORTS) {
    try {
      const server = serve({
        port,
        hostname: "0.0.0.0",
        async fetch(req) {
          const url = new URL(req.url);
          let pathname = decodeURIComponent(url.pathname);

          if (pathname === "/" || pathname === "") {
            pathname = "/index.html";
          }

          // 1. Try public directory first (for /css, /js, /images)
          let targetPath = join(publicDir, pathname);
          let file = Bun.file(targetPath);

          // 2. If not found in public, try root directory (for /index.html)
          if (!(await file.exists())) {
            targetPath = join(rootDir, pathname);
            file = Bun.file(targetPath);
          }

          if (await file.exists()) {
            const ext = pathname.substring(pathname.lastIndexOf(".")).toLowerCase();
            const contentType = MIME_TYPES[ext] || file.type || "application/octet-stream";

            return new Response(file, {
              headers: {
                "Content-Type": contentType,
                "Cache-Control": "no-cache, no-store, must-revalidate",
              },
            });
          }

          return new Response("404 Not Found - Instituto Prause Landing Page", {
            status: 404,
            headers: { "Content-Type": "text/plain; charset=utf-8" },
          });
        },
      });

      console.log(`\n======================================================`);
      console.log(`✨ INSTITUTO PRAUSE — LANDING PAGE MELA INICIADA! ✨`);
      console.log(`🌐 Local: http://localhost:${server.port}`);
      console.log(`======================================================\n`);
      return server;
    } catch (err: any) {
      if (err?.code === "EADDRINUSE") {
        continue;
      }
      console.error(`Erro ao iniciar na porta ${port}:`, err);
    }
  }

  throw new Error("Não foi possível alocar uma porta para o servidor.");
}

startServer();
