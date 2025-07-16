import Header from "@/components/Header"
import MobileNavigation from "@/components/MobileNavigation"
import Sidebar from "@/components/Sidebar"
import { Toaster } from "@/components/ui/toaster"
import { getCurrentUser } from "@/lib/actions/user.action"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

const layout = async({children}:Readonly<{children:React.ReactNode}>) => {


  const currentUser = await getCurrentUser();
  if(!currentUser) {    
    return redirect("/sign-in")
  }

  return (
    <main className="flex h-screen">
        <Sidebar {...currentUser}/>
      <section className="flex h-full flex-1 flex-col">
              <MobileNavigation {...currentUser}/>
               <Header userId={currentUser.$id} accountId = {currentUser.accountid}/>
          <div className="main-content">
   {children}
          </div>
      </section>
     <Toaster/>
    </main>
  )
}

export default layout

