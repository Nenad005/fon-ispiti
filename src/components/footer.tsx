export default function Footer() {
    return <>
        <footer className="w-full flex justify-center border-t sticky bottom-0 left-0 z-10">
            <div className="flex justify-start w-full md:w-[760px] items-center px-5 py-5 gap-3">
                <div className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
                    Napravio <a className="font-medium underline underline-offset-4 cursor-pointer" target="_blank">nenad005.</a> Izvorni kod je dostupan na <a className="font-medium underline underline-offset-4 cursor-pointer" target="_blank">GitHub-u</a>
                </div>  
            </div>
        </footer>
    </>
}