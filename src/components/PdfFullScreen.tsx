import { MutableRefObject, useEffect, useRef, useState } from "react"
import { Dialog, DialogContent, DialogTrigger } from "./UI/dialog"
import { Button } from "./UI/button"
import { Expand } from "lucide-react"
import SimpleBar from "simplebar-react"
import {Document, Page, pdfjs} from  "react-pdf";
import { useToast } from "./UI/use-toast";
import { LoadingPDF } from "./PdfRenderer"

const PdfFullScreen = ({url}: {url:string}) => {
    const [isOpen, setIsOpen] = useState(false)
    const {toast} = useToast();
    const [isLoaded, setIsLoaded] = useState<boolean>(false);

    const [numPages, setNumPages] = useState<number>();

    const ref = useRef() as MutableRefObject<HTMLDivElement>;
    useEffect(()=>{
        if(isLoaded) {
            console.log(ref.current)
        }
    },[isLoaded])

  return (
    <Dialog open={isOpen} onOpenChange={(v)=>{
        if(!v) setIsOpen(v)
    }}>
        <DialogTrigger  onClick={()=>setIsOpen(true)}>
            <Button variant={'ghost'} className="gap-1.5" aria-label='fullscreen'>
                <Expand className="h-4 w-4"/>
            </Button>
        </DialogTrigger>
        <DialogContent className="max-w-7xl w-full">
            <SimpleBar autoHide={false} className="max-h-[calc(100vh-10rem)] mt-6">
                <div ref={ref} className="w-full">
                    <Document  loading={LoadingPDF} onLoadSuccess={({numPages})=>{setIsLoaded(true);setNumPages(numPages)}} onLoadError={()=>toast({title: 'Error Loading PDF', description:'Please try again later', variant:'destructive'})} file={url} className={'max-h-full w-full'}>
                        {new Array(numPages).fill(0).map((_,i)=>{
                            return (
                                <Page key={i} pageNumber={i+1} loading={LoadingPDF}  width={ref.current ? ref.current.offsetWidth : 300} />
                            )
                        })}
                       
                    </ Document>
                </div>
            </SimpleBar>
        </DialogContent>
    </Dialog>
  )
}

export default PdfFullScreen