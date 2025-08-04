import db from "@/lib/db/db";
// import { useRouter } from "next/router";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: Request, context: any) {
  const { idexamPeriod } = await context.params
  console.log(idexamPeriod, context['idexamPeriod'])

  const data = await db.examSubject.findMany({
    where: { examPeriodId: idexamPeriod },
  });

  console.log(data.length)

  return NextResponse.json(data, { status: 200 });
}