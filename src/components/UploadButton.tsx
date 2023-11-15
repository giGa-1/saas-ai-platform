"use client"
import { useState } from "react"
import { Dialog, DialogContent, DialogTrigger } from "./UI/dialog";
import { Button } from "./UI/button";

const UploadButton = ({ }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <Dialog open={isOpen} onOpenChange={(v)=>{
            if(!v) {
                setIsOpen(v)
            }
        }}>
            <DialogTrigger onClick={e=>setIsOpen(true)} asChild>
                <Button>
                    Upload PDF
                </Button>    
            </DialogTrigger>
            <DialogContent>

            </DialogContent>
        </Dialog>
    ) 
}

export default UploadButton