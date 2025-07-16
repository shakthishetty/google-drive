"use client";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";

import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot
} from "@/components/ui/input-otp";
import { sendEmailOTP, verifySecret } from "@/lib/actions/user.action";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Button } from "./ui/button";


const OtpModel = ({accountId,email}:{accountId:string; email:string}) => {
    const [isOpen, setIsOpen] = useState(true);
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter()
    const handleSubmit = async(e:React.MouseEvent<HTMLButtonElement>)=>{
        e.preventDefault();
        setLoading(true);
         
         try{
             const sessionId = await verifySecret({accountId,password});
             if(sessionId){
                router.push("/");
                
             }
         }catch(error){
            console.error("Error submitting OTP:", error);
         }
        setLoading(false);
    }

  const handleResendOtp = async()=>{
     await sendEmailOTP({email})
    }
  return (
  
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
     
  <AlertDialogContent className="shad-alert-dialog">
    <AlertDialogHeader className="relative flex justify-center">
      <AlertDialogTitle className="h2 text-center">Enter your OTP
        <Image
         src="/assets/icons/close-dark.svg"
         alt="close"
         width={20}
         height={20}
         onClick={() => setIsOpen(false)}
         className="otp-close-button"
        />
      </AlertDialogTitle>
      <AlertDialogDescription className="subtitle-2 text-center text-light-100">
        We've send an OTP to your email <span className="text-brand pl-1">{email}</span>.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <InputOTP maxLength={6} value={password} onChange={setPassword}>
  <InputOTPGroup className="shad-otp">
    <InputOTPSlot index={0} className="shad-otp-slot"/>
    <InputOTPSlot index={1} className="shad-otp-slot"/>
    <InputOTPSlot index={2} className="shad-otp-slot"/>
       <InputOTPSlot index={3} className="shad-otp-slot"/>
    <InputOTPSlot index={4} className="shad-otp-slot"/>
    <InputOTPSlot index={5} className="shad-otp-slot"/>
  </InputOTPGroup>
  
 

</InputOTP>
    <AlertDialogFooter>
        <div className="flex w-full flex-col gap-4">
           <AlertDialogAction onClick={handleSubmit} className="shad-submit-btn h-12" type="button">Submit
            <Image
                src="/assets/icons/loader.svg"
                alt="Loading"
                width={24}
                height={24}
                className={`ml-2 animate-spin ${loading ? "block" : "hidden"}`}
                priority
            />
           </AlertDialogAction>
           <div className="subtitle-2 mt-2 text-center text-light-100">
            Didn't get the code?
            <Button type="button" variant="link" className="pl-1 text-brand" onClick={handleResendOtp}>
                Click to resend
            </Button>
           </div>
        </div>
     
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
  
  )
}

export default OtpModel