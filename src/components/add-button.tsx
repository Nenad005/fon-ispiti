"use client"

import { LucidePlus } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { useState } from "react";
import { SelectValue } from "@radix-ui/react-select";
import { Label } from "./ui/label";
import { SelectItem, Select, SelectContent, SelectTrigger } from "./ui/select";
// import dataJSON from "@/../data/response.json"
// import { ExamData, ExamTerm } from "@/lib/types";
// import { DataTableDemo, Exam } from "./ui/checkbox-table";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import SubjectTable from "./subject-table";

// const examData: ExamData = dataJSON;

async function getPeriods() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/data/periods`)
    return await response.json()
}

export default function AddButton() {
    const {data, isPending, isError} = useSuspenseQuery({ queryKey: ["periods"], queryFn: getPeriods })
    const [isOpen, setIsOpen] = useState(false)
    const [examType, setExamType] = useState<undefined | string>(undefined)
    const [examSemester, setExamSemester] = useState<undefined | string>(undefined)
    const [examPeriod, setExamPeriod] = useState<undefined | string>(undefined)
    const [selectedExams, setSelectedExams] = useState<Array<any>>([])

    return <>
        <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open) }}>
            <DialogTrigger asChild>
                <Button variant={"outline"} className="bg-green-300 hover:bg-green-500 transition-all cursor-pointer"
                    size={"icon"} onClick={() => setIsOpen(true)}>
                    <LucidePlus />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Dodaj ispite</DialogTitle>
                </DialogHeader>
                {isPending ? <>
                    <h1>UCITAVANJE</h1> 
                </> : isError ? <>
                    <h1>GRESKA</h1>
                </> : data && <>
                    <div className="flex flex-col gap-2">
                        <Label>Izaberi tip ispita</Label>
                        <Select key={`type`} value={examType} onValueChange={(type) => {
                            setExamSemester(undefined)
                            setExamPeriod(undefined)
                            setExamType(type)
                        }}>
                            <SelectTrigger id="selection-type">
                                <SelectValue placeholder="Izaberi tip"></SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {Object.keys(data.dict).map((key: any) => {
                                    return <SelectItem value={key} key={key}>{data.dict[key].name}</SelectItem>
                                })}
                            </SelectContent>
                        </Select>

                        {/* <Button onClick={() => {console.log(data.find((type: any) => type.idexamType == examType))}}></Button> */}
                        <Label>Izaberi {examType && data.dict[examType].name == "KOLOKVIJUMI" ? "semestar" : "akreditaciju"}</Label>
                        <Select key={`semester-${examType}`} disabled={!examType} value={examSemester} onValueChange={(semester) => {
                            setExamPeriod(undefined)
                            setExamSemester(semester)
                        }}>
                            <SelectTrigger id="selection-type">
                                {examType == "KOLOKVIJUMI" ?
                                    <SelectValue placeholder="Izaberi semestar"></SelectValue> :
                                    <SelectValue placeholder="Izaberi akreditaciju"></SelectValue>
                                }
                            </SelectTrigger>
                            <SelectContent>
                                {examType && Object.keys(data.dict[examType].examSemesters).map((key: string) => {
                                    return <SelectItem value={key} key={key}>{data.dict[examType].examSemesters[key].semesterName}</SelectItem>
                                })}
                            </SelectContent>
                        </Select>

                        <Label>Izaberi rok</Label>
                        <Select key={`period-${examSemester}-${examType}`} disabled={!examSemester} value={examPeriod} onValueChange={setExamPeriod}>
                            <SelectTrigger>
                                <SelectValue placeholder="Izaberi rok"></SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {examType && examSemester && Object.keys(data.dict[examType].examSemesters[examSemester].examPeriods).map((key: string) => {
                                    return <SelectItem value={key} key={key}>{data.dict[examType].examSemesters[examSemester].examPeriods[key].periodName}</SelectItem>
                                })}
                            </SelectContent>
                        </Select>
                        
                        {examPeriod && <>
                            <Label>Izaberi predmet</Label>
                            <SubjectTable key={examPeriod} idexamPeriod={examPeriod} setSelectedExams={setSelectedExams}></SubjectTable>
                        </>}
                        <Button disabled={!examPeriod || selectedExams.length == 0} onClick={() => {
                            setIsOpen(false)
                            console.log(selectedExams)
                        }}>Dodaj</Button>
                    </div>
                </>}
            </DialogContent>
        </Dialog>
    </>
}
{/*<DataTableDemo key={`table-${examSemester}-${examPeriod}`} rowSelection={rowSelection} setRowSelection={setRowSelection} data={(examSemester && examPeriod) ? getTableData(examData[examType][examSemester][examPeriod].termini) : []}/> */}