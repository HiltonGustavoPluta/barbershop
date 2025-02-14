import { getServerSession } from "next-auth";
import Header from "@/components/header";
import { redirect } from "next/navigation";
import { db } from "../_lib/prisma";
import BookingItem from "@/components/booking-item";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { authOptions } from "../_lib/auth";

const BookingsPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return redirect("/");
  }

  const [confirmedBookings, finishedBookings] = await Promise.all([
    db.booking.findMany({
      where: {
        userId: (session.user as any).id,
        date: {
          gte: new Date(),
        },
      },
      include: {
        service: true,
        barbershop: true,
      },
    }),
    db.booking.findMany({
      where: {
        userId: (session.user as any).id,
        date: {
          lt: new Date(),
        },
      },
      include: {
        service: true,
        barbershop: true,
      },
    }),
  ]);

  return (
    <div className="min-h-screen">
      <Header />

      { confirmedBookings.length === 0 && finishedBookings.length === 0 ? (
        <div className="px-5 py-6 flex flex-col gap-3 items-center">
          <h1 className="text-center font-bold">
            Você não possui nenhum agendamento.
          </h1>
          <Button asChild variant="secondary">
            <Link href="/">
              Voltar ao início
            </Link>
          </Button>
          
        </div>
      ) : (
        <div className="px-5 py-6">
          <h1 className="text-xl font-bold mb-6">Agendamentos</h1>

          {confirmedBookings.length > 0 && (
            <>
              <h2 className="text-gray-400 uppercase font-bold text-sm mb-3">Confirmados</h2>

              <div className="flex flex-col gap-3">
                {confirmedBookings.map((booking) => (
                  <BookingItem key={booking.id} booking={booking} />
                ))}
              </div>
            </>
          )}

          {finishedBookings.length > 0 && (
            <>
              <h2 className="text-gray-400 uppercase font-bold text-sm mt-6 mb-3">Finalizados</h2>

              <div className="flex flex-col gap-3">
                {finishedBookings.map((booking) => (
                  <BookingItem key={booking.id} booking={booking} />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default BookingsPage;