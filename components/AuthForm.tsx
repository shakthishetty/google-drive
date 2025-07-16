
"use client"

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createAccount, signInUser } from "@/lib/actions/user.action";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import OtpModel from "./OtpModel";




type FormType = 'sign-in' | 'sign-up';

const authFormShema = (formType: FormType) => {
    return z.object({
        email: z.string().email("Invalid email address")    ,
        fullName: formType === 'sign-up' ? z.string().min(2).max(50) : z.string().optional(),
    })
}

const AuthForm = ({type}:{type:FormType}) => {
   const [Loding, setLoading] = useState(false);
   const [error, setError] = useState("");
   const [accountId, setAccountId] = useState(null)
   const formSchema = authFormShema(type);

    const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
    },
  })
 
  // 2. Define a submit handler.
   const onSubmit = async (values: z.infer<typeof formSchema>) =>{
     setLoading(true);
     setError("");
     try{
  const user = 
    type === 'sign-up' ? await createAccount({
        fullName: values.fullName || "",
        email: values.email, 
      })
      : await signInUser({email:values.email})
   
    setAccountId(user.accountId);
     }catch(error){
         setError("Failed to create account. Please try again.");
     }finally{
            setLoading(false);
     }

    }
  return (

    <>
     <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="auth-form">
         <h1>{type === 'sign-in' ? 'Sign In' : "Sign Up"}</h1>
           {type === 'sign-up' && <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
               <div className="shad-form-item">
                <FormLabel className="shad-form-label">Full Name</FormLabel>
                   <FormControl>
                <Input placeholder="Enter your full name"{...field} className="shad-input"/>
              </FormControl>
               </div>
              <FormMessage className="shad-form-message"/>
            </FormItem>
          )}
        />}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
               <div className="shad-form-item">
                <FormLabel className="shad-form-label">Email</FormLabel>
                   <FormControl>
                <Input placeholder="Enter your email"{...field} className="shad-input"/>
              </FormControl>
               </div>
              <FormMessage className="shad-form-message"/>
            </FormItem>
          )}
        />
        <Button type="submit" className="form-submit-button" disabled={Loding}>
            {type === 'sign-in' ? 'Sign In' : "Sign Up"}
            {Loding && ( 
                <Image 
                src='/assets/icons/loader.svg'  
                alt="Loading"
                width={24}
                height={24}
                className="ml-2 animate-spin"
                priority
                />
            )}
        </Button>
        {error && (
            <p className="error-message">*{error}</p>
        )}
        <div className="body-2 flex justify-center">
            <p className="text-light-100">
            {type === 'sign-in' ? "Don't have an account?" : "Already have an account?"}
            </p>
           <Link 
            href={type === 'sign-in' ? '/sign-up' : '/sign-in'}
            className="ml-1 font-medium text-brand"

           >{type === 'sign-in' ? "Sign Up" : "Sign In"}</Link> 
        </div>
      </form>
    </Form>
    {/* OTP VERIFICATION */}
    {accountId && (
        <OtpModel email={form.getValues('email')} accountId ={accountId}/>
    )}
    </>
  )
}

export default AuthForm