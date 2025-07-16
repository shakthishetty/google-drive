"use client"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { actionsDropdownItems } from "@/constants"
import { constructDownloadUrl } from "@/lib/utils"
import { ActionType } from "@/types"
import Image from "next/image"
import Link from "next/link"

import { deleteFile, renameFile, updateFileUser } from "@/lib/actions/file.actions"
import { usePathname } from "next/navigation"
import { Models } from "node-appwrite"
import { useState } from "react"
import FileDetails, { ShareInput } from "./ActionModelContent"

import { Button } from "./ui/button"
import { Input } from "./ui/input"

const ActionDropdown = ({file}:{file:Models.Document}) => {
    const [isOpen,setIsOpen] = useState(false)
    const  [isDropDown,setIsDropDown] = useState(false)
    const [action,setAction] = useState<ActionType | null>(null)
    const [name,setName] = useState(file.name)
    const [loading,setLoading] = useState(false)
    const path = usePathname();
    const [email,setEmail] = useState<string[]>([])

    const closeAllModels = ()=>{
        setIsOpen(false)
        setIsDropDown(false)
        setAction(null)
        setName(file.name)

        setEmail([])
    }

    const handleAction = async()=>{
       if(!action) return
       setLoading(true)
       let success = false
       const actions = {
        rename: ()=>
          renameFile({
            fileId: file.$id,
            name,
            extension: file.extension,
              path
          }),
          share:()=>
          updateFileUser({
            fileId: file.$id,
            emails:email,
            path
          }),
          delete:()=>
          deleteFile({
            fileId: file.$id,
            bucketFileId: file.bucketFileId,
            path
          }),
       }
       success = await actions[action.value as keyof typeof actions]()
       if(success){
        closeAllModels()
        
       }
        setLoading(false)
    }

    const handleRemoveUser = async(userEmail: string) => {
       const updatedEmails = email.filter((e) => e !== userEmail)
        const success = await updateFileUser({
            fileId: file.$id,
            emails: updatedEmails,
            path
        });
        if(success){
            setEmail(updatedEmails)
            closeAllModels();
        }
    }

    const renderDialogContent = ()=>{
        if(!action) return null
        const {value,label} = action
        return (
            
  <DialogContent className="shad-dialog button">
    <DialogHeader className="flex flex-col gap-3">
      <DialogTitle className="text-center text-light-100">
             {label}
      </DialogTitle>
     {value === 'rename' && (
        <Input type="text" value={name}
         onChange={(e)=>{setName(e.target.value)}}
        />
     )}
     {value === 'details' && <FileDetails file={file} />}
     {value === 'share' && <ShareInput file={file} onInputChange = {setEmail} onRemove = {handleRemoveUser}/>}
     {value === 'delete' && (
        <p className="delete-confirmation">
          Are you sure you want to delete{` `}
          <span className="delete-file-name">{file.name}</span>?
        </p>
     )}
    </DialogHeader>
    {['rename','delete','share'].includes(value) && (
        <DialogFooter className="flex flex-col gap-3 md:flex-row">
          <Button onClick={closeAllModels} className="modal-cancel-button">
            Cancel
          </Button>
           <Button onClick={handleAction} className="modal-submit-button">
            <p className="capitalize">{value}</p>
            {loading && (
                <Image
                  src="/assets/icons/loader.svg"
                  alt="loader"
                  width={24}
                  height={24}
                  className="animate-spin"
                />
            )}
          </Button>

        </DialogFooter>
    )}
  </DialogContent>
    
        )
    }


  return (
   <Dialog open={isOpen} onOpenChange={setIsOpen}>
    
  <DropdownMenu open={isDropDown} onOpenChange={setIsDropDown}>
  <DropdownMenuTrigger className="shad-open-focus">
    <Image
     src="/assets/icons/dots.svg"
     alt="dots"
     width={34}
     height={34}
     priority
    />
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel className="max-w-[200px] truncate">
        {file.name}
    </DropdownMenuLabel>
    <DropdownMenuSeparator />
     {actionsDropdownItems.map((actionItem)=>(
        <DropdownMenuItem key={actionItem.value} className="shad-dropdown-item" onClick={()=>{setAction(actionItem);
           if(
            [
                "rename",
                "share",
                "delete",
                "details"
            ].includes(actionItem.value)
           ){
            setIsOpen(true)
           }
        }}
        
        >
           {actionItem.value === "download" ? (
                <Link
                  href={constructDownloadUrl(file.bucketFileId)}
                  download={file.name}
                  className="flex items-center gap-2"
                >
                  <Image
                    src={actionItem.icon}
                    alt={actionItem.label}
                    width={30}
                    height={30}
                  />
                  {actionItem.label}
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  <Image
                    src={actionItem.icon}
                    alt={actionItem.label}
                    width={30}
                    height={30}
                  />
                  {actionItem.label}
                </div>
              )}
            </DropdownMenuItem>
          ))}
  </DropdownMenuContent>
</DropdownMenu>
{renderDialogContent()}
</Dialog>
  )
}

export default ActionDropdown