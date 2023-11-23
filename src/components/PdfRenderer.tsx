"use client"
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Loader2, RotateCcw, RotateCw, Search } from "lucide-react";
import {Document, Page, pdfjs} from  "react-pdf";
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { useToast } from "./UI/use-toast";
import {useResizeDetector} from 'react-resize-detector'
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { Button } from "./UI/button";
import { Input } from "./UI/input";
import {useForm} from 'react-hook-form'
import { z } from "zod";
import {zodResolver} from '@hookform/resolvers/zod';
import { cn } from "@/lib/utils";
import SimpleBar from 'simplebar-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./UI/dropdown-menu";
import PdfFullScreen from "./PdfFullScreen";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface PdfRendererProps {
    url: string
}

export const LoadingPDF = () => (
    <div className="flex justify-center">
        <Loader2 className="my-24 w-6 h-6 animate-spin"/>
    </div>
)

const PdfRenderer = ({url}: PdfRendererProps) => {

    const {toast} = useToast();
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [renderedScale, setRenderedScale] = useState<null | number>(null);
    const [numPages, setNumPages] = useState<number>();
    const [currPage, setCurrPage] = useState<number>(1);
    const [scale, setScale] = useState<number>(1);
    const [rotation, setRotation] = useState<number>(0)

    const isLoading = renderedScale !== scale; 


    const CustomPageValidater = z.object({
        page: z.string().refine((num) => +(num) > 0 && +(num) <= numPages!)
    }) as any

    type TCustomPageValidator = z.infer<typeof CustomPageValidater>

    const handlePageSubmit = ({page}: TCustomPageValidator) => {
        setCurrPage(+(page));
        setValue("page", page+'')
    }

    const {
        register,
        handleSubmit,
        formState: {errors},
        setValue
    } = useForm<TCustomPageValidator>({
        defaultValues: {
            page: "1"
        },
        resolver: zodResolver(CustomPageValidater)
    })

    const ref = useRef() as MutableRefObject<HTMLDivElement>;
    useEffect(()=>{
        if(isLoaded) {
            console.log(ref.current)
        }
    },[isLoaded])

    return <div className={"w-full bg-white rounded-md shadow flex flex-col items-center"}>
        <div className="h-14 w-full border-b border-zinc-200 flex items-center justify-between px-2">
            <div className="flex items-center gap-1.5">
                <Button disabled={currPage <= 1} variant={'ghost'} onClick={()=>{
                    setCurrPage(prev=>{ 
                            let prevPage = prev - 1 ? prev - 1: 1;
                            setValue('page', prevPage+'');
                            return prevPage
                        }); 
                    }} aria-label="previous page">
                    <ChevronLeft className="h-4 w-4"/>
                </Button>
                <div className="flex items-center gap-1.5">
                    <Input {...register('page')} className={cn('w-12 h-8', errors.page && 'focus-visible:ring-red-500')} onKeyDown={(e)=>{
                        if(e.key === 'Enter') {
                            handleSubmit(handlePageSubmit)()
                        }
                    }}/>
                    <p className="text-zinc-700 text-sm space-x-1">
                        <span>/</span>
                        <span>{numPages ?? 'x'}</span>
                    </p>
                </div>
                <Button disabled={numPages === undefined || currPage === numPages} variant={'ghost'} onClick={()=>{
                    setCurrPage(prev=>{
                            let nextPage = prev + 1 ? prev + 1: 1;
                            setValue('page',nextPage+'');
                            return nextPage;
                        });
                    }}  aria-label="previous page">
                    <ChevronRight className="h-4 w-4"/>
                </Button>
            </div>

            <div className="space-x-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button className="gap-1.5" aria-label='zoom' variant={'ghost'}>
                            <Search className="h-4 w-4"/>
                            {scale * 100}%<ChevronDown className="h-3 w-3 opacity-50"/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onSelect={() => setScale(1)}>
                            100%
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setScale(1.25)}>
                            125%
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setScale(1.5)}>
                            150%
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <Button variant={'ghost'} onClick={()=>{setRotation((prev)=>prev+90)}} aria-label={'rotate 90 deg'}>
                    <RotateCw className="h-4 w-4"/>
                </Button>


                <PdfFullScreen url={url}/>
            </div>
        </div>
        <div className="flex-1 w-full max-h-screen">
            <SimpleBar autoHide={false} className="max-h-[calc(100vh-10rem)]"> 
                <div ref={ref} className="w-full">
                    <Document  loading={LoadingPDF} onLoadSuccess={({numPages})=>{setIsLoaded(true);setNumPages(numPages)}} onLoadError={()=>toast({title: 'Error Loading PDF', description:'Please try again later', variant:'destructive'})} file={url} className={'max-h-full w-full'}>
                        {isLoading && renderedScale ? (
                            <Page key={"@"+renderedScale} rotate={rotation} scale={scale} loading={LoadingPDF} pageNumber={currPage} width={ref.current ? ref.current.offsetWidth : 300}  />
                        ): null}
                        <Page key={"@" + scale} onRenderSuccess={() => setRenderedScale(scale)} className={cn(isLoading ? 'hidden' : '')}  rotate={rotation} scale={scale} loading={LoadingPDF} pageNumber={currPage} width={ref.current ? ref.current.offsetWidth : 300}  />
                    </ Document>
                </div>
            </SimpleBar>
        </div>
    </div>
}


export default PdfRenderer