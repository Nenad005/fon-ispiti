    "use client"
    import { Badge } from "./ui/badge"
    import { CalendarIcon, Clock, MapPin, Pen, PenIcon, Plus, Trash, Users } from "lucide-react"
    import { cn } from "@/lib/utils"
    import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "./ui/dialog"
    import { Label } from "./ui/label"
    import { useEffect, useState } from "react"
    import { format } from "date-fns"
    import { Button } from "./ui/button"
    import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
    import { Calendar } from "./ui/calendar"
    import { Input } from "./ui/input"
    import { examsAtom } from "@/app/state/selectedExamsAtom"
    import { useAtom } from "jotai"

    export default function Exam({ examData, terms}: { examData: any, terms: Record<string, Array<any>>}) {
        const [isOpen, setIsOpen] = useState(false);
        const [date, setDate] = useState<Date>()
        const [fromTime, setFromTime] = useState("08:00");
        const [toTime, setToTime] = useState("08:30");
        const [location, setLocation] = useState('');
        const [exams, setExams] = useAtom(examsAtom)

        function handleFromTimeChange(e: any){
            setFromTime(e.target.value);
        }
        function handleToTimeChange(e: any){
            setToTime(e.target.value);
        }
        function handleLocationChange(e: any){
            setLocation(e.target.value);
        }

        function handleSelectTerm(term: any){
            setFromTime(term.od)
            setToTime(term.do)
            setDate(new Date(term.datum))
        }

        function handleSaveChanges(){
            let newExam = {...examData, term: {
                datum: date,
                od: fromTime,
                do: toTime,
                lokacija: location
            }}
            const newExams = exams.map(exam =>
                exam.id === examData.id ? newExam : exam
            );
            window.localStorage.setItem('EXAMS', JSON.stringify(newExams))  
            setExams(newExams);
            setIsOpen(false);
        }

        function handleDeleteExam(){
            // console.log("brisem")
            let newExams = JSON.parse(JSON.stringify(exams));
            const index = exams.findIndex((exam) => exam.id === examData.id);
            if (index !== -1) {
                newExams.splice(index, 1);
            }
            window.localStorage.setItem('EXAMS', JSON.stringify(newExams))  
            setExams(newExams);
        }

        useEffect(() => {
            if (examData.term){
                setDate(examData.term.datum)
                setFromTime(examData.term.od)
                setToTime(examData.term.do)
                setLocation(examData.term.lokacija)
            }
        }, [])

        return <div onClick={() => {console.log(examData)}}>
            <div className="px-5 py-4 w-full md:max-w-[500px] flex justify-between">
                <div className="flex flex-col gap-2 w-full">
                    <div className="flex items-center gap-3 w-full">
                        <div className={`text-right w-5 h-5 font-semibold text-secondary rounded-[50%] flex items-center justify-center
                            ${examData.type == "P" ? "bg-green-400" 
                            : examData.type == "U" ? "bg-blue-400"
                            : "bg-yellow-400"}`}
                        >
                            {examData.type}
                        </div>
                        <h1 className="text-xl mr-auto">{examData.subjectName}</h1>
                        {examData.term && 
                        <Button variant={"secondary"} 
                            className="size-6! p-0! cursor-pointer"
                            onClick={() => {setIsOpen(true)}}>
                            <Pen className="size-3!"/>
                        </Button>}
                        <Button variant={"destructive"} 
                            className="size-6! p-0! cursor-pointer"
                            onClick={handleDeleteExam}>
                            <Trash className="size-3!"/>
                        </Button>
                    </div>
                    {examData.term &&
                        <div className="flex flex-wrap gap-3">
                            <Badge variant="secondary" className="flex gap-1 items-center">
                                <Clock size={15}/>
                                <span className="">{new Date(examData.term.datum).toLocaleDateString()}</span>
                                <span className="">{examData.term.od} - {examData.term.do}</span>
                            </Badge>
                            <Badge variant="secondary" className={`flex gap-1 items-center text-nowrap ${examData.term.lokacija == '' ? "hidden" : ""}`}>
                                <MapPin size={15}/>
                                <span>{examData.term.lokacija}</span>
                            </Badge>
                        </div>
                    }
                    <div className={`${examData.term ? "hidden" : ""}`}>
                        <Dialog onOpenChange={(open) => setIsOpen(open)} open={isOpen}>
                            <DialogTrigger>
                                <Badge variant={"secondary"} className="flex gap-2 animate-bounce cursor-pointer"><Pen/>Izaberi termin</Badge>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogTitle>{examData.subjectName}</DialogTitle>
                                <DialogDescription>
                                    Izaberi termn ispita, ili ga unesi ručno.
                                </DialogDescription>
                                <Label>Ponudjeni termini: </Label>
                                <div className="flex flex-wrap gap-3">
                                    {Object.keys(terms).length != 0 && terms[examData.idexamSubject].map((term, index) => {
                                        return (
                                            <Badge key={`termin-${index}`} className="flex gap-2 bg-pink-400 items-center mb-2 cursor-pointer" onClick={() => handleSelectTerm(term)}>
                                                <span className="text-secondary">{new Date(term.datum).toLocaleDateString()}</span>
                                                <span className="text-secondary">{term.od} - {term.do}</span>
                                            </Badge>
                                        )
                                    })}
                                </div>
                                <Label>Izabran termin: </Label>
                                <div className="w-full flex flex-row flex-wrap gap-2">
                                    <div className="flex flex-col gap-3">
                                        <Label className="">Datum</Label>
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
                                    <div className="flex flex-row gap-3">
                                        <div className="flex flex-col gap-3">
                                            <Label htmlFor="time-picker" className="px-1">
                                                Od
                                            </Label>
                                            <Input
                                                type="time"
                                                min={"00:00"}
                                                max={"23:59"}
                                                value={fromTime}
                                                onChange={handleFromTimeChange}
                                                className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                                                />
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <Label htmlFor="time-picker" className="px-1">
                                                Do
                                            </Label>
                                            <Input
                                                type="time"
                                                min={"00:00"}
                                                max={"23:59"}
                                                value={toTime}
                                                onChange={handleToTimeChange}
                                                className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                                                />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <Label htmlFor="time-picker" className="px-1">
                                            Lokacija
                                        </Label>
                                        <Input
                                            type="text"
                                            value={location}
                                            placeholder="Unesi lokaciju"
                                            onChange={handleLocationChange}
                                            className="bg-background"
                                            />
                                    </div>
                                </div>  
                                <div className="w-full flex flex-col justify-end items-end">
                                    <Button onClick={handleSaveChanges} className="cursor-pointer">Sačuvaj</Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>
        </div>
    }