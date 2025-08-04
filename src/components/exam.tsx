"use client"

export default function Exam({examData} : {examData: Array<any>}) {
    return <div>
        <p>{JSON.stringify(examData)}</p>
    </div>
}