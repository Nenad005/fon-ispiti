"use client"

import Test from "@/components/test";
import { useAtom } from "jotai";
import { examsAtom } from "./state/selectedExamsAtom";
import Exam from "@/components/exam";

export default function Home() {
  const [exams, setExams] = useAtom(examsAtom)

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
    <div className="w-full h-full flex justify-center items-center flex-col gap-2">
      {Object.keys(examsDict).map((type) => <div key={`${type}-cont`}>
        <h1 key={`${type}-h1`}>{type}</h1>
        <div key={`${type}-div`}>
          {Object.keys(examsDict[type]).map((semester) => <div className="ml-2" key={`${type}-${semester}-cont`}>
            <h1 key={`${type}-${semester}-h1`}>{semester}</h1>
            <div key={`${type}-${semester}-div`}>
              {Object.keys(examsDict[type][semester]).map((period) => <div className="ml-4" key={`${type}-${semester}-${period}-cont`}>
                <h1 key={`${type}-${semester}-${period}-h1`}>{period}</h1>
                <div key={`${type}-${semester}-${period}-div`} className="ml-6">
                  {examsDict[type][semester][period].map((exam: any) => <Exam key={exam.idexamSubject} examData={exam}></Exam>)}
                </div>
              </div>)}
            </div>
          </div>)}
        </div>
      </div>)}
      {/* {exams.map((exam, i) => <Exam key={exam.idexamSubject} examData={exam}></Exam>)} */}
    </div>
  );
}