"use client"

import { LucidePlus } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { useDebugValue, useEffect, useState } from "react";
import { SelectValue } from "@radix-ui/react-select";
import { Label } from "./ui/label";
import { SelectItem, Select, SelectContent, SelectTrigger } from "./ui/select";
// import dataJSON from "@/../data/response.json"
// import { ExamData, ExamTerm } from "@/lib/types";
// import { DataTableDemo, Exam } from "./ui/checkbox-table";
import { useQuery } from "@tanstack/react-query";
import SubjectTable from "./subject-table";
import { useAtom } from "jotai";
import { examsAtom } from "@/app/state/selectedExamsAtom";
import { getBaseUrl } from "@/lib/utils";

// const examData: ExamData = dataJSON;

async function getPeriods() {
    const response = await fetch(`${getBaseUrl()}/api/data/periods`)

    if (!response.ok) {
        console.error("Failed to fetch data:", await response.text())  // logs raw HTML if it's an error
        throw new Error("Failed to fetch data")
    }

    return await response.json()
}

export default function AddButton() {
    const {data, isPending, isError} = useQuery({ queryKey: ["periods"], queryFn: getPeriods })
    const [isOpen, setIsOpen] = useState(false)
    const [examType, setExamType] = useState<undefined | string>(undefined)
    const [examSemester, setExamSemester] = useState<undefined | string>(undefined)
    const [examPeriod, setExamPeriod] = useState<undefined | string>(undefined)
    const [selectedExams, setSelectedExams] = useState<Array<any>>([])
    const [exams, setExams] = useAtom(examsAtom)

    function handleSaveSettings(){
        const settingsDict = {
            examType,
            examSemester,
            examPeriod,
        }
        window.localStorage.setItem('SETTINGS', JSON.stringify(settingsDict))
        setIsOpen(false)
    }

    function handleAddExams() {
        const newExams = selectedExams.map((exam) => {
            const existingCount = exams.filter(e => e.idexamSubject.startsWith(exam.idexamSubject)).length;
            
            return {
                ...exam,
                term: null,
                id: `${exam.idexamSubject}--${existingCount + 1}`,
            };
        });

        const updatedExams = exams.concat(newExams);
        window.localStorage.setItem('EXAMS', JSON.stringify(updatedExams));
        setExams(updatedExams);
        handleSaveSettings();
        setIsOpen(false);
    }

    function handleOpenChange(open: any){
        if (open){
            const settings = window.localStorage.getItem('SETTINGS');
            if (settings){
                let settingsDict = JSON.parse(settings)
                if (!isPending && !isError && data){
                    console.log("ima podatke")
                    if (Object.keys(data.dict).includes(settingsDict.examType)){
                        console.log("ima tip")
                        if (Object.keys(data.dict[settingsDict.examType].examSemesters).includes(settingsDict.examSemester)){
                            console.log("ima semestar")
                            if (Object.keys(data.dict[settingsDict.examType].examSemesters[settingsDict.examSemester].examPeriods).includes(settingsDict.examPeriod)){
                                console.log("ima period")
                            }
                            else{
                                settingsDict.examPeriod = undefined;
                                window.localStorage.setItem('SETTINGS', JSON.stringify(settingsDict));
                            }
                        }
                        else{
                            settingsDict.examSemester = undefined;
                            settingsDict.examPeriod = undefined;
                            window.localStorage.setItem('SETTINGS', JSON.stringify(settingsDict));
                        }
                    }
                    else{
                        settingsDict.examType = undefined;
                        settingsDict.examSemester = undefined;
                        settingsDict.examPeriod = undefined;
                        window.localStorage.setItem('SETTINGS', JSON.stringify(settingsDict));
                    }
                }
                setExamType(settingsDict.examType)
                setExamSemester(settingsDict.examSemester)
                setExamPeriod(settingsDict.examPeriod)
            }
            else window.localStorage.setItem('SETTINGS', JSON.stringify({
                examType,
                examSemester,
                examPeriod,
            }))
        }
        else{
            handleSaveSettings();
        }
        setIsOpen(open)
    }

    return <>
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant={"outline"} className="bg-green-300 hover:bg-green-500 transition-all cursor-pointer"
                    size={"icon"} onClick={() => setIsOpen(true)}>
                    <LucidePlus />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] w-[90%]">
                <DialogHeader>
                    <DialogTitle>Dodaj ispite</DialogTitle>
                </DialogHeader>
                {isPending ? <>
                    {/* TODO UCITAVANJE */}
                    <h1>UCITAVANJE</h1> 
                </> : isError ? <>
                    <h1>GRESKA</h1>
                </> : data && <>
                    <div className="flex flex-col gap-2 w-full max-w-full overflow-x-hidden">
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
                        
                        {examPeriod && <div className="w-full max-w-full flex flex-col overflow-x-hidden">
                            <Label>Izaberi predmet</Label>
                            <SubjectTable key={examPeriod} idexamPeriod={examPeriod} setSelectedExams={setSelectedExams}></SubjectTable>
                        </div>}
                        <Button disabled={!examPeriod || selectedExams.length == 0} onClick={handleAddExams}>Dodaj</Button>
                        
                    </div>
                </>}
            </DialogContent>
        </Dialog>
    </>
}
{/*<DataTableDemo key={`table-${examSemester}-${examPeriod}`} rowSelection={rowSelection} setRowSelection={setRowSelection} data={(examSemester && examPeriod) ? getTableData(examData[examType][examSemester][examPeriod].termini) : []}/> */}