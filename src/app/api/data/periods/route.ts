import db from "@/lib/db/db";
import { NextResponse } from "next/server";

export async function GET() {
    const data = await db.examType.findMany({include: {examSemesters: {include: {examPeriods: true}}}})

    let dataDict = Object.fromEntries(
        data.map((examType) => [examType.idexamType, {
            name: examType.name, 
            examSemesters: Object.fromEntries( examType.examSemesters.map((examSemester) => [examSemester.idexamSemester, {
                semesterName: examSemester.semesterName, examPeriods: Object.fromEntries(
                examSemester.examPeriods.map((examPeriod) => [examPeriod.idexamPeriod, {
                    periodName: examPeriod.periodName
                }])
            )}])
        )}])
    )

    return NextResponse.json({array: data, dict: dataDict}, {status: 200})
}