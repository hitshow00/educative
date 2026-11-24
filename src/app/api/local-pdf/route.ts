import fs from 'node:fs';
import path from 'node:path';
import { NextResponse, type NextRequest } from 'next/server';

const BASE_DIR = process.env.LOCAL_COURSES_DIR || 'C:\\Users\\hit\\Desktop\\cour';

const MIME_TYPES: Record<string, string> = {
  '.pdf': 'application/pdf',
  '.zip': 'application/zip',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

/**
 * Route API sécurisée GET /api/local-pdf?file=...
 * Sert les fichiers PDF/DOC officiels depuis `C:\Users\hit\Desktop\cour` en local.
 * En production Vercel, configurez `NEXT_PUBLIC_PDF_CDN_URL` (ex: Cloudflare R2).
 */
export async function GET(request: NextRequest) {
  const fileParam = request.nextUrl.searchParams.get('file');
  const forceDownload = request.nextUrl.searchParams.get('download') === '1';

  if (!fileParam) {
    return NextResponse.json({ error: 'Paramètre file manquant.' }, { status: 400 });
  }

  // Protection stricte contre path traversal (../)
  const resolvedBase = path.resolve(BASE_DIR);
  const normalizedRel = fileParam.replace(/\\/g, '/').replace(/^\/+/, '');
  const targetPath = path.resolve(resolvedBase, normalizedRel);

  if (!targetPath.startsWith(resolvedBase + path.sep)) {
    return NextResponse.json({ error: 'Accès non autorisé.' }, { status: 403 });
  }

  if (!fs.existsSync(targetPath)) {
    return NextResponse.json(
      {
        error:
          'Fichier non disponible sur ce serveur. En production Vercel, configurez NEXT_PUBLIC_PDF_CDN_URL (ex. Cloudflare R2) avec le contenu du dossier cour.',
      },
      { status: 404 }
    );
  }

  const stat = fs.statSync(targetPath);
  if (!stat.isFile()) {
    return NextResponse.json({ error: 'Ressource invalide.' }, { status: 400 });
  }

  const ext = path.extname(targetPath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  const filename = path.basename(targetPath);
  const encodedFilename = encodeURIComponent(filename);

  const fileBuffer = fs.readFileSync(targetPath);

  return new NextResponse(fileBuffer, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Content-Length': String(fileBuffer.length),
      'Content-Disposition': `${
        forceDownload || ext !== '.pdf' ? 'attachment' : 'inline'
      }; filename*=UTF-8''${encodedFilename}`,
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
