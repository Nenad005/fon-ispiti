"use client"

import { useQuery } from "@tanstack/react-query"
import { DataTableDemo } from "./ui/checkbox-table";
import React, { useState } from "react";
import { getBaseUrl } from "@/lib/utils";


async function getSubjects({ queryKey }: { queryKey: [string, string] }) {
    const [, idexamPeriod] = queryKey;
    const response = await fetch(`${getBaseUrl()}/api/data/subjects/${idexamPeriod}`);

    if (!response.ok) {
        console.error("Failed to fetch data:", await response.text())  // logs raw HTML if it's an error
        throw new Error("Failed to fetch data")
    }

    return await response.json();
}
export default function SubjectTable({ idexamPeriod, setSelectedExams }: { idexamPeriod: string, setSelectedExams: React.Dispatch<React.SetStateAction<any>>}) {
    const { data, isPending, isError } = useQuery({
        queryKey: ["subjects", idexamPeriod],
        queryFn: getSubjects
    });

    return <div className="w-full overflow-x-hidden">
        {!isPending && !isError && data && <div>
            <DataTableDemo data={data} setRowSelectionData={setSelectedExams}></DataTableDemo>
        </div>}
    </div>
} 