"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Barbershop } from "@prisma/client";
import { StarIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface BarbershopItemProps {
  barbershop: Barbershop
}

const BarberShopItem = ({ barbershop }: BarbershopItemProps) => {
  
  const router = useRouter();

  const handleBookingClick = () => {
    router.push(`/barbershops/${barbershop.id}`);
  }

  return ( 
    <Card className="min-w-[165px] max-w-[165px] rounded-2xl">
      <CardContent className="py-0 px-1">
        <div className="relative h-[159px] w-full">
          <div className="absolute top-2 left-2 z-50">
            <Badge variant="secondary" className="flex items-center gap-1 opacity-90">
              <StarIcon size={12} className="fill-primary text-primary" />
              <span className="text-xs">5,0</span>
            </Badge>
          </div>

          <Image 
            src={barbershop.imageUrl}
            alt={barbershop.name}
            fill
            className="rounded-2xl object-cover"
          />
        </div>
       
        <div className="px-2 pb-3">
          <h2 className="font-bold text-lg mt-2  overflow-hidden text-ellipsis text-nowrap">{barbershop.name}</h2>
          <p className="text-sm text-gray-400 overflow-hidden text-ellipsis text-nowrap">{barbershop.address}</p>
          <Button className="w-full mt-3" variant="secondary" onClick={handleBookingClick}>Reservar</Button>
        </div>
      </CardContent>
    </Card>
   );
}
 
export default BarberShopItem;