"use client"
import { Badge } from "./ui/badge"
import { Clock, MapPin, Pen, Plus, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Label } from "./ui/label"
import { useState } from "react"

export default function Exam({ examData, terms }: { examData: any, terms: Record<string, Array<any>> }) {
    const [isOpen, setIsOpen] = useState(false);

    return <div onClick={() => { console.log(examData, terms[examData.idexamSubject]) }}>
        <div className="px-5 py-4 w-full md:w-[500px] flex justify-between">
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <div className={cn("felx block w-3 h-3 aspect-square rounded-full gap-1 items-center", examData.type == 'P' ? "bg-green-400" : examData.type == 'U' ? "bg-blue-400" : "bg-yellow-400")}>
                        {/* {predavanje.tip == 'P' ? <Book size={15}/> : <Laptop size={15}/>} */}
                    </div>
                    <h1 className="text-xl">{examData.subjectName}</h1>
                </div>
                {examData.term ? 
                <div className="flex flex-wrap gap-3">
                    <Badge variant="secondary" className="flex gap-1 items-center">
                        <Clock size={15}/>
                        {/* {`${predavanje.od}-${predavanje.do}`} */}
                    </Badge>
                    <Badge variant="secondary" className="flex gap-1 items-center text-nowrap">
                        <MapPin size={15}/>
                        {/* {predavanje.sala} */}
                    </Badge>
                </div> : 
                <div>
                    <Dialog onOpenChange={(open) => setIsOpen(open)}>
                        <DialogTrigger>
                            <Badge variant={"secondary"} className="flex gap-2 animate-bounce cursor-pointer"><Pen/>Izaberi termin</Badge>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle>{examData.subjectName}</DialogTitle>
                            <DialogDescription>
                                Izaberi termn ispita, ili ga unesi ručno.
                            </DialogDescription>
                            <Label>Ponudjeni termini: </Label>
                            Nema ponudjenjih termina
                        </DialogContent>
                    </Dialog>
                </div>
                }
            </div>
        </div>
    </div>
}