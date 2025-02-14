"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Barbershop, Booking, Service } from "@prisma/client";
import { ptBR } from "date-fns/locale";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { generateDayTimeList } from "../_helpers/hours";
import { format, setHours, setMinutes } from "date-fns";
import { saveBooking } from "../_actions/save-booking";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getDayBookings } from "../_actions/get-day-bookings";


interface ServiceItemProps {
  service: Service
  isAuthenticated?: boolean
  barbershop: Barbershop
}

const ServiceItem = ({ service, barbershop, isAuthenticated }: ServiceItemProps) => {
  const router = useRouter();

  const { data } = useSession()

  const [submitIsLoadind, setSubmitIsLoading] = useState<boolean>(false)
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [hour, setHour] = useState<string | undefined>(undefined)
  const [sheetIsOpen, setSheetIsOpen] = useState<boolean>(false)
  const [dayBookings, setDayBookings] = useState<Booking[]>([])

  useEffect(() => {
    const refreshAvailableHous = async () => {

      if(!date) {
        return
      }
      const _dayBooking = await getDayBookings(barbershop.id, date)
      setDayBookings(_dayBooking)
    }

    refreshAvailableHous()
  }, [date, barbershop.id])

  const handleBooking = () => {
    if (!isAuthenticated) {
      return signIn('google')
    } 
  }

  const timeList = useMemo(() => {
    if (!date) {
      return []
    }

    return generateDayTimeList(date).filter((time) => {
      const timeHour = Number(time.split(":")[0]);
      const timeMinutes = Number(time.split(":")[1]);

      const booking = dayBookings.find((booking) => {
        const bookingHour = booking.date.getHours();
        const bookingMinutes = booking.date.getMinutes();

        return bookingHour === timeHour && bookingMinutes === timeMinutes;
      });

      if (!booking) {
        return true;
      }

      return false;
    });
  }, [date, dayBookings]);

  const handleDate = (date: Date | undefined) => {
    setDate(date)
    setHour(undefined)
  }

  const handleHour = (hour: string) => {
    setHour(hour)
  }
  
  const handleBookingSubmit = async () => {
    try {
      setSubmitIsLoading(true)

      if(!hour || !date || !data?.user) {
        return
      }

      const dateHour = Number(hour.split(':')[0])
      const dateMinutes = Number(hour.split(':')[1])

      const newDate = setMinutes(setHours(date, dateHour), dateMinutes)

      await saveBooking({
        serviceId: service.id,
        barbershopId: barbershop.id,
        date: newDate,
        userId: (data.user as any).id
      })

      setSheetIsOpen(false)
      setDate(undefined)
      setHour(undefined)

      toast("Reserva realizada com sucesso!", {
        description: format(newDate, "'Para' dd 'de' MMMM 'às' HH':'mm'.'", {
          locale: ptBR,
        }),
        action: {
          label: "Visualizar",
          onClick: () => router.push("/bookings"),
        },
      });
    } catch (error) {
      console.error(error)
    } finally {
      setSubmitIsLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="p-3">
        <div className="flex items-center gap-4 w-full">
          <div className="relative min-h-[110px] min-w-[110px] max-h-[110px]  max-w-[110px]">
            <Image
              src={service.imageUrl}
              alt={service.name}
              fill
              className="object-contain rounded-lg"
            />
          </div>

          <div className="flex flex-col w-full">
            <h2 className="font-bold text-base">{service.name}</h2>
            <p className="text-sm text-gray-400">{service.description}</p>

            <div className="flex items-center justify-between mt-3">
              <p className="text-primary font-bold text-sm">
                { Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL"
                }).format(service.price) }
              </p>
              <Sheet open={sheetIsOpen} onOpenChange={setSheetIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="secondary" onClick={handleBooking}>Reservar</Button> 
                </SheetTrigger>

                <SheetContent className="p-0 w-screen">
                  <SheetHeader className="text-left px-5 py-6 border-b border-secondary">
                    <SheetTitle>Fazer Reserva</SheetTitle>
                  </SheetHeader>

                  <div className="py-6">
                     <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDate}
                    locale={ptBR}
                    fromDate={new Date()}
                    styles={{
                      head_cell: {
                        width: '100%',
                        textTransform: 'capitalize'
                      },
                      cell: {
                        width: '100%'
                      },
                      button: {
                        width: '100%'
                      },
                      nav_button_previous: {
                        width: '32px',
                        height: '32px'
                      },
                      nav_button_next: {
                        width: '32px',
                        height: '32px'
                      },
                      caption: {
                        textTransform: 'capitalize'
                      }
                    }}
                  />
                  </div>

                
                  { date && (
                    <div className="flex gap-3 py-6 px-5 border-y overflow-x-auto [&::-webkit-scrollbar]:hidden">
                      {timeList.map((time) => (
                        <Button 
                          key={time} 
                          variant={
                            hour === time ? 'default' : 'outline'
                          }
                          className="rounded-full"
                          onClick={() => handleHour(time)}
                        >
                          { time }
                        </Button>
                      ))}
                    </div>
                  )}

                  <div className="py-6">
                    <Card className="mx-5 mb-6">
                      <CardContent className="p-3 flex flex-col gap-3">
                        <div className="flex justify-between">
                          <h2 className="font-bold">
                            {service.name}
                          </h2>
                          <h3 className="font-bold text-sm">
                            { Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL"
                            }).format(service.price) }
                          </h3>
                        </div>
                        { date && (
                          <div className="flex justify-between">
                            <h3 className="text-gray-400 text-sm">
                               Data
                            </h3>
                            <h4 className="text-sm">
                              { format(date, "dd 'de' MMMM", {
                                locale: ptBR
                              }) }
                            </h4>  
                          </div>
                        )}

                        { hour && (
                          <div className="flex justify-between">
                            <h3 className="text-gray-400 text-sm">
                               Horário
                            </h3>
                            <h4 className="text-sm">
                              {hour}
                            </h4>  
                          </div>
                        )}

                        <div className="flex justify-between">
                          <h3 className="text-gray-400 text-sm">
                              Barbearia
                          </h3>
                          <h4 className="text-sm">
                            {barbershop.name}
                          </h4>  
                        </div>
                      </CardContent>
                    </Card>

                    <SheetFooter className="flex-row gap-3 px-5">
                      <SheetClose asChild>
                        <Button className="w-full" variant="secondary">
                          Voltar
                        </Button>
                      </SheetClose>
                      <Button 
                        disabled={!hour || !date || submitIsLoadind} 
                        onClick={handleBookingSubmit}
                        className="w-full"
                      >
                        {submitIsLoadind 
                          ? <Loader2 className="h-4 w-4 animate-spin" /> 
                          : 'Confirmar reserva'
                        }
                      </Button>
                    </SheetFooter>
                  </div>

                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
 
export default ServiceItem;