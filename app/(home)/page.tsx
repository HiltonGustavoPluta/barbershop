import { format } from "date-fns"
import Header from "@/components/header"
import { ptBR } from "date-fns/locale";
import Search from "./_components/search";
import BookingItem from "@/components/booking-item";
import { db } from "../_lib/prisma";
import BarberShopItem from "./_components/barbershop-item";

export default async function Home() {

  const barbershops = await db.barbershop.findMany({})

  return (
    <div>
      <Header />

      <div className="p-5"> 
        <h2 className="text-xl font-bold">Olá, usuario</h2>
        <p className="capitalize text-sm">
          { format(new Date(), "EEEE',' dd 'de' MMMM", {
            locale: ptBR
          })}
        </p>
      </div>

      <div className="px-5 mt-6">
        <Search />
      </div>

      <div className="px-5 mt-6">
        <h2 className="text-xs uppercase text-gray-400 font-bold mb-3">Agendamentos</h2>
        <BookingItem />
      </div>

      <div className="mt-6">
        <h2 className="px-5 text-xs uppercase text-gray-400 font-bold mb-3">Recomendados</h2>
        <div className="flex px-5 gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden ">
          {barbershops.map((barbershop) => (
            <BarberShopItem key={barbershop.id} barbershop={barbershop} />
          ))}
        </div>
      </div>
    </div>
  );
}
