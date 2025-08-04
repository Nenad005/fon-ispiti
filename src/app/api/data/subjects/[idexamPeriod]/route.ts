import db from "@/lib/db/db";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: { idexamPeriod: string } }
) {
  const { idexamPeriod } = await params;

  const data = await db.examSubject.findMany({
    where: { examPeriodId: idexamPeriod },
  });

  return NextResponse.json(data, { status: 200 });
}