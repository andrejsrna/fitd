import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  const { slug, secret } = await req.json();
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }
  try {
    await revalidatePath(`/clanky/${slug}`);
    return NextResponse.json({ revalidated: true });
  } catch {
    return NextResponse.json({ message: "Error revalidating" }, { status: 500 });
  }
} 