import { format } from "date-fns"
import Header from "@/components/header"
import { ptBR } from "date-fns/locale";
import Search from "./_components/search";
import BookingItem from "@/components/booking-item";

export default function Home() {
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
    </div>
  );
}
