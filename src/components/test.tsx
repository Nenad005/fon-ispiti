"use client"

import { useQuery } from "@tanstack/react-query"

async function getPeriods() {
    const response = await fetch("/api/data/periods")
    return await response.json()
}

export default function Test() {
    // const {data, isPending} = useQuery({queryKey: ["periods"], queryFn: getPeriods})

    return <>
        <div>OVO JE ZA TESTIRANJE</div>
        {/* <div>{JSON.stringify(data)}</div> */}
    </>
}