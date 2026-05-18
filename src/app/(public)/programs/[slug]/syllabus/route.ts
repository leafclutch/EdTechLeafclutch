import { createPublicSupabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const supabase = createPublicSupabase();

  const { data: program } = await supabase
    .from("courses")
    .select("syllabus_url, title")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!program?.syllabus_url) {
    return new NextResponse("Syllabus not found", { status: 404 });
  }

  const res = await fetch(program.syllabus_url);
  if (!res.ok) {
    return new NextResponse("Failed to fetch syllabus", { status: 502 });
  }

  const filename = `${slug}-syllabus.pdf`;

  return new NextResponse(res.body, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
