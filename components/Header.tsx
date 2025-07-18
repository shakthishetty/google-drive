import { signOutUser } from "@/lib/actions/user.action"
import Image from "next/image"
import FileUploader from "./FileUploader"
import Search from "./Search"
import { Button } from "./ui/button"

const Header = ({userId,accountId}:{userId:string,accountId:string}) => {
    
  return (
    <header className="header">
        <Search/>
        <div className="header-wrapper">
            <FileUploader ownerId={userId} accountId={accountId}/>
             <form action={async()=>{
              "use server"
              await signOutUser()
             }}>
                <Button type="submit" className="sign-out-button">
                  <Image
                   src="/assets/icons/logout.svg"
                     alt="Logout"
                        width={24}      
                        height={24}
                        className="w-6"
                  />
                </Button>
             </form>
        </div>
    </header>
  )
}

export default Header