"use client"

import Test from "@/components/test";
import { useAtom } from "jotai";
import { examsAtom } from "./state/selectedExamsAtom";
import Exam from "@/components/exam";
import { useEffect } from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";

async function getPeriods() {
  const response = await fetch("/api/data/terms");
  if (!response.ok) {
    throw new Error("Failed to fetch terms");
  }
  let data = await response.json();
  let dataDict: Record<string, Array<any>> = {};

  data.forEach((term : any) => {
    if (Object.keys(dataDict).includes(term.examSubjectId)){
      dataDict[term.examSubjectId].push(term);
    }
    else{
      dataDict[term.examSubjectId] = [term];
    }
  })

  return dataDict
}

export default function Home() {
  const {data, isPending, isError} = useQuery({ queryKey: ["terms"], queryFn: getPeriods });
  const [exams, setExams] = useAtom(examsAtom)

  useEffect(() => {
    const exams = window.localStorage.getItem('EXAMS')
    if (exams) {
      setExams(JSON.parse(exams))
    } else {
      window.localStorage.setItem('EXAMS', JSON.stringify([]))
      setExams([])
    } 
  }, [])

  const examsDict: Record<any, any> = {}
  for (let i = 0; i < exams.length; i++){
    const exam = exams[i]

    const idElements = exam.examPeriodId.split("--")
    const type = idElements[0]
    const semester = idElements[1]
    const period = idElements[2]

    if (!(type in examsDict)) examsDict[type] = {}
    if (!(semester in examsDict[type])) examsDict[type][semester] = {}
    if (!(period in examsDict[type][semester])) examsDict[type][semester][period] = []

    examsDict[type][semester][period].push(exam)
  }

  console.log(examsDict)

  return (
    <div className="w-full h-full md:w-[500px] flex justify-start items-start p-5 flex-col gap-2">
      {Object.keys(examsDict).map((type) => <div key={`${type}-cont`}>
        {/* <h1 key={`${type}-h1`}>{type}</h1> */}
        <div key={`${type}-div`} >
          {Object.keys(examsDict[type]).map((semester) => <div className="" key={`${type}-${semester}-cont`}>
            {/* <h1 key={`${type}-${semester}-h1`}>{semester}</h1> */}
            <div key={`${type}-${semester}-div`}>
              {Object.keys(examsDict[type][semester]).map((period) => <div className="" key={`${type}-${semester}-${period}-cont`}>
                <Badge variant={"secondary"}>
                  <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem className="text-[14px]">{semester}</BreadcrumbItem>
                        <BreadcrumbSeparator/>
                        <BreadcrumbItem className="text-[14px]">{period}</BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
                </Badge>
                <div key={`${type}-${semester}-${period}-div`} className="flex flex-col">
                  {examsDict[type][semester][period].map((exam: any, i: number) => 
                    <Exam key={`${exam.idexamSubject}-${i}`} examData={exam} terms={ isPending ? {} : isError ? {} : data ? data : {}} />
                  )}
                </div>
              </div>)}
            </div>
          </div>)}
        </div>
      </div>)}
      {/* <div className="flex flex-col gap-4">
        {exams.map((exam: any, i: number) => (
          <Exam key={`${exam.idexamSubject}-${i}`} examData={exam} />
        ))}
      </div> */}
    </div>
  );
}