"use client"

import { LucidePlus } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { useState } from "react";
import { SelectValue } from "@radix-ui/react-select";
import { Label } from "./ui/label";
import { SelectItem, Select, SelectContent, SelectTrigger } from "./ui/select";
import data from "@/../data/response.json"
import { ExamData, ExamTerm } from "@/lib/types";
import { DataTableDemo, Exam } from "./ui/checkbox-table";

const examData: ExamData = data;

function getSubjects(terms: ExamTerm[]) : string[] {
    const predmeti = new Set(terms.map((term) => {
        return term.predmet + " " + term.tip
    }));

    return Array.from(predmeti);
}

function getTableData(terms: ExamTerm[]): Exam[] {
    const examMap = new Map<string, Exam>()

  terms.forEach((term) => {
    const exam: Exam = {
      id: term.predmet + term.tip,
      subject: term.predmet,
      type: term.tip,
    }

    if (!examMap.has(exam.id)) {
      examMap.set(exam.id, exam)
    }
  })

  return Array.from(examMap.values())
}

export default function AddButton(){
    const [isOpen, setIsOpen] = useState(false)
    const [examType, setExamType] = useState("ISPITI")
    const [examSemester, setExamSemester] = useState<undefined | string>(undefined)
    const [examPeriod, setExamPeriod] = useState<undefined | string>(undefined)
    const [rowSelection, setRowSelection] = useState({})

    return <>
        <Dialog open={isOpen} onOpenChange={(open) => {setIsOpen(open)}}>
            <DialogTrigger asChild>
                <Button variant={"outline"} className="bg-green-300 hover:bg-green-500 transition-all " 
                size={"icon"} onClick={() => setIsOpen(true)}>
                    <LucidePlus/>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Dodaj ispite</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-2">
                    <Label>Izaberi tip ispita</Label>
                    <Select value={examType} onValueChange={(type) => {
                        setExamSemester(undefined)
                        setExamPeriod(undefined)
                        setExamType(type)
                    }}>
                        <SelectTrigger id="selection-type">
                            <SelectValue placeholder="Izaberi tip"></SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            {Object.keys(data).map((key: string) => {
                                return <SelectItem value={key}>{key}</SelectItem>
                            })}
                        </SelectContent>
                    </Select>

                    <Label>Izaberi {examType == "KOLOKVIJUMI" ? "semestar" : "akreditaciju"}</Label>
                    <Select key={`semester-${examType}`} value={examSemester} onValueChange={(semester) => {
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
                            {Object.keys(examData[examType]).map((key: string) => {
                                return <SelectItem value={key}>{key}</SelectItem>
                            })}
                        </SelectContent>
                    </Select>

                    <Label>Izaberi rok</Label>
                    <Select key={`period-${examSemester}-${examType}`} disabled={!examSemester} value={examPeriod} onValueChange={setExamPeriod}>
                        <SelectTrigger>
                            <SelectValue placeholder="Izaberi rok"></SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            {examSemester && Object.keys(examData[examType][examSemester]).map((key : string) => {
                                return <SelectItem value={key}>{key}</SelectItem>
                            })}
                        </SelectContent>
                    </Select>

                    <Label>Izaberi predmet</Label>
                    <DataTableDemo rowSelection={rowSelection} setRowSelection={setRowSelection} data={(examSemester && examPeriod) ? getTableData(examData[examType][examSemester][examPeriod].termini) : []}/>
                    <Button variant={"outline"} onClick={() => {console.log(rowSelection)}}>Test</Button>
                </div>
            </DialogContent>
        </Dialog>
    </>
}