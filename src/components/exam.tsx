"use client"
import { Badge } from "./ui/badge"
import { CalendarIcon, Clock, MapPin, Pen, Plus, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Label } from "./ui/label"
import { useState } from "react"
import { format } from "date-fns"
import { Button } from "./ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Calendar } from "./ui/calendar"
import { Input } from "./ui/input"

export default function Exam({ examData, terms }: { examData: any, terms: Record<string, Array<any>> }) {
    const [isOpen, setIsOpen] = useState(false);
    const [date, setDate] = useState<Date>()

    console.log(examData.idexamSubject, terms)

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
                            <Label>Ponudjeni: </Label>
                            <div className="flex flex-wrap gap-3">
                                {Object.keys(terms).length != 0 && terms[examData.idexamSubject].map((term) => {
                                    return (
                                        <Badge variant={"secondary"} className="flex gap-2 bg-muted items-center mb-2 cursor-pointer">
                                            <span>{new Date(term.datum).toLocaleDateString()}</span>
                                            <span>{term.od} - {term.do}</span>
                                        </Badge>
                                    )
                                })}
                            </div>
                            <Label>Termin: </Label>
                            <div className="w-full flex flex-row gap-2">
                                <div className="flex flex-col gap-3">
                                    <Label className="">Date</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                            variant="outline"
                                            data-empty={!date}
                                            className="data-[empty=true]:text-muted-foreground justify-start text-left font-normal"
                                            >
                                            <CalendarIcon />
                                            {date ? format(date, "PPP") : <span>Podesi datum</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar mode="single" selected={date} onSelect={setDate} />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <Label htmlFor="time-picker" className="px-1">
                                        Time
                                    </Label>
                                    <Input
                                        type="time"
                                        id="time-picker"
                                        step="1"
                                        defaultValue="10:30:00"
                                        className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"/>
                                </div>
                            </div>  
                            <div className="w-full flex flex-col justify-end items-end">
                                <Button>Sačuvaj</Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>}
            </div>
        </div>
    </div>
}