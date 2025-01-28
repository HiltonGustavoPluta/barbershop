"use client"

import { CalendarIcon, HomeIcon, LogInIcon, LogOutIcon, MenuIcon, UserIcon } from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "./ui/sheet"
import { signIn, signOut, useSession } from "next-auth/react"
import { Avatar, AvatarImage } from "./ui/avatar"
import Link from "next/link"

const Header = () => {

  const { data } = useSession();

  const handleLogout = () => signOut()
  const handleLogin = () => signIn()

  return (
    <Card>
      <CardContent className="p-5 flex justify-between flex-row items-center">
        <a>Logo</a>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <MenuIcon size={18} />
            </Button>
          </SheetTrigger>
          <SheetContent className="p-0">
            <SheetHeader className="text-left border-b border-secondary p-5">
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>

            { data?.user ? (
              <div className="flex justify-between items-center px-5 py-6">
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage src={data.user?.image ?? ""} />
                  </Avatar>
                  <h2 className="font-bold">{data.user.name}</h2>
                </div>
                <Button variant="secondary" size="icon" onClick={handleLogout} >
                  <LogOutIcon />
                </Button>
              </div>
  
            ) : (
              <div className="flex flex-col px-5 py-6 gap-3">
                <div className="flex items-center gap-2">
                  <UserIcon size={32} />
                  <h2>Olá. Faça seu login!</h2>
                </div>
                <Button variant="secondary" className="w-full justify-start" onClick={handleLogin}>
                  <LogInIcon className="mr-2" size={18} />
                  Fazer login
                </Button>
              </div>
            )
          }

          <div className="flex flex-col gap-3 px-5">
            <Button variant="outline" className=" justify-start" asChild>
              <Link href="/">
                <HomeIcon size={18} className="mr-2" />
                Início
              </Link>
            </Button>
            { data?.user && (
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/bookings">
                  <CalendarIcon size={18} className="mr-2" />
                  Agendamentos
                </Link>
              </Button>
            )}
          </div>

          </SheetContent>
        </Sheet>
      </CardContent>
    </Card>
  )
}

export default Header
