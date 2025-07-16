"use server";


import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ID, Query } from "node-appwrite";
import { parseStringify } from "../utils";

const getUserByEmail = async (email: string) => {
  const { databases } = await createAdminClient();

  const result = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.usersCollectionId,
    [Query.equal("email", [email])],
  );

  return result.total > 0 ? result.documents[0] : null;
};

const handleError = (error: unknown, message: string) => {
  console.log(error, message);
  throw error;
};

export const sendEmailOTP = async ({ email }: { email: string }) => {
  const { account } = await createAdminClient();

  try {
    const session = await account.createEmailToken(ID.unique(), email);

    return session.userId;
  } catch (error) {
    handleError(error, "Failed to send email OTP");
  }
};

export const createAccount = async ({
  fullName,
  email,
}: {
  fullName: string;
  email: string;
}) => {
  const existingUser = await getUserByEmail(email);

  const accountId = await sendEmailOTP({ email });
  if (!accountId) throw new Error("Failed to send an OTP");

  if (!existingUser) {
    const { databases } = await createAdminClient();

    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      ID.unique(),
      {
        fullName,
        email,
        avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzpinHx4_z7qyFvRhujn1Slo2lNyl7WtIPOafbyZW4o4CN5cyFUha9p10&s",
        accountid: accountId,
      },
    );
  }

  return parseStringify({ accountId });
};


export const verifySecret = async({accountId,password}:{accountId:string;password:string})=>{
    try{
 const {account} = await createAdminClient();
 const session = await account.createSession(accountId,password);
  (await cookies()).set("appwrite_session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite:'strict',
      secure: true
  })
  return parseStringify({sessionId: session.$id});
    }catch(error){
        handleError(error, "Failed to verify otp");
    }
   

}

export const getCurrentUser = async () => {
  try{
 const {database, account } = await createSessionClient();

    const result = await account.get();
    const  user = await database.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        [Query.equal("accountid",result.$id)],
        );
        if(user.total <= 0) return null;
    return parseStringify(user.documents[0]);
  }catch(err){
    handleError(err, "Failed to get current user");
  }
};

export const signOutUser = async()=>{
    const {account} = await createSessionClient();

    try{
     await account.deleteSession('current');
     (await cookies()).delete("appwrite_session") // <-- fix cookie name here
    }catch(error){
      handleError(error,"Failed to sign out user")
    }finally{
        redirect('/sign-in')
    }
}

export const signInUser = async({email}:{email:string})=>{
    try{
      const existingUser = await getUserByEmail(email)
      if(existingUser){
        await sendEmailOTP({email})
        return parseStringify({accountId:existingUser.accountid});
      }
      return parseStringify({accountId:null,error:"User not found"})
    }catch(err){
        handleError(err,"Failed to sign in user")
    }
}