"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Account, Avatars, Client, Databases, Storage } from "node-appwrite";
import { appwriteConfig } from "./config";

export const createSessionClient = async()=>{
    const client = new Client()
        .setEndpoint(appwriteConfig.endpointUrl)
        .setProject(appwriteConfig.projectId)

    const session = (await cookies()).get("appwrite_session")
    if(!session || !session?.value){
        redirect("/sign-in"); // Redirect to sign-in page if session not found
    }
    client.setSession(session.value)

    return {
        get account(){
            return new Account(client);
        },
        get database(){
            return new Databases(client)
        }
    }
}
export const createAdminClient = async()=>{
   const client = new Client()
        .setEndpoint(appwriteConfig.endpointUrl)
        .setProject(appwriteConfig.projectId)
        .setKey(appwriteConfig.secretKey)

        

         return {
            get account(){
                return new Account(client);
            },
            get databases(){
                return new Databases(client)
            },
            get storage(){
                return new Storage
                (client)
            },
            get avatars(){
                return new Avatars(client)
            }
         }
}

