import db from "@/lib/db/db";
import { NextResponse } from "next/server";

export async function GET() {
    const data = await db.examTerm.findMany()

    return NextResponse.json(data, {status: 200})
}