"use client"

import Test from "@/components/test";
import { useAtom } from "jotai";
import { examsAtom } from "./state/selectedExamsAtom";
import Exam from "@/components/exam";
import { useEffect } from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { getBaseUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";

async function getPeriods() {
  const response = await fetch(`${getBaseUrl()}/api/data/terms`);
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

  let sortedExams = [...exams]
  sortedExams.sort((a, b) => {
    if (a.term && b.term) {
      const dateA = new Date(a.term.datum);
      const dateB = new Date(b.term.datum);
      if (dateA < dateB) return -1;
      if (dateA > dateB) return 1;
    } else if (a.term) {
      return -1;
    } else if (b.term) {
      return 1;
    }

    const subjectCompare = a.subjectName.localeCompare(b.subjectName);
    if (subjectCompare !== 0) return subjectCompare;

    return a.type.localeCompare(b.type);
  });


  const examsDict: Record<any, any> = {}
  for (let i = 0; i < sortedExams.length; i++){
    const exam = sortedExams[i]

    const idElements = exam.examPeriodId.split("--")
    const type = idElements[0]
    const semester = idElements[1]
    const period = idElements[2]

    if (!(type in examsDict)) examsDict[type] = {}
    if (!(semester in examsDict[type])) examsDict[type][semester] = {}
    if (!(period in examsDict[type][semester])) examsDict[type][semester][period] = []

    examsDict[type][semester][period].push(exam)
  }

  return (
    <div className="w-full h-full flex justify-start items-center p-5 flex-col gap-2">
      {/* <Button onClick={()=> {console.log(exams, data)}}>ISPISI</Button> */}
      {Object.keys(examsDict).map((type) => <div key={`${type}-cont`} className="md:w-auto w-full">
        {/* <h1 key={`${type}-h1`}>{type}</h1> */}
        <div key={`${type}-div`}>
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
                    <Exam key={`${exam.idexamSubject}-${i}-${exams.length}`} examData={exam} terms={ isPending ? {} : isError ? {} : data ? data : {}} />
                  )}
                </div>
              </div>)}
            </div>
          </div>)}
        </div>
      </div>)}
    </div>
  );
}