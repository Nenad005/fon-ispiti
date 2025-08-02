import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  const filePath = path.join(process.cwd(), 'data', 'response.json');

  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return new Response(content, { status: 200 });
  } catch (err) {
    return new Response('Greška: fajl nije pronađen.', { status: 404 });
  }
}