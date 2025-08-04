"use client"

import { useQuery } from "@tanstack/react-query"
import { DataTableDemo } from "./ui/checkbox-table";
import React, { useState } from "react";


async function getSubjects({ queryKey }: { queryKey: [string, string] }) {
    const [, idexamPeriod] = queryKey;
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/data/subjects/${idexamPeriod}`);
    return await response.json();
}
export default function SubjectTable({ idexamPeriod, setSelectedExams }: { idexamPeriod: string, setSelectedExams: React.Dispatch<React.SetStateAction<any>>}) {
    const { data, isPending, isError } = useQuery({
        queryKey: ["subjects", idexamPeriod],
        queryFn: getSubjects
    });

    return <div>
        {!isPending && !isError && data && <div>
            <DataTableDemo data={data} setRowSelectionData={setSelectedExams}></DataTableDemo>
        </div>}
    </div>
} 