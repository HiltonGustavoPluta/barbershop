import { db } from "@/app/_lib/prisma";
import BarbershopInfo from "./_components/barbershop-info";
import ServiceItem from "./_components/service-item";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_lib/auth";
import { notFound } from "next/navigation";

interface BarberShopDetailsProps {
  params: Promise<{ id: string }>
}

const BarbershopDetailsPage = async  ({ params }: BarberShopDetailsProps) => {
  const resolvedParams = await params;
  const session = await getServerSession(authOptions)

  if (!resolvedParams?.id) {
    return notFound(); // Melhor prática do Next.js para redirecionar
  }

  if(!resolvedParams.id) {
    //TODO redirecionar para home page
    return null;
  }

  const barbershop = await db.barbershop.findUnique({
    where: {
      id: resolvedParams.id
    },
    include: {
      services: true
    }
  })

  if(!barbershop) {
     //TODO redirecionar para home page
    return notFound();
  }

  return ( 
    <div>
      <BarbershopInfo barbershop={barbershop} />

      <div className="px-5 flex flex-col gap-4 py-6">
      
        { barbershop.services.map(( service ) => (
          <ServiceItem 
            key={service.id} 
            service={service} 
            isAuthenticated={!!session?.user}
            barbershop={barbershop} 
          />
        ))}
      </div>
    </div>
  );
}
 
export default BarbershopDetailsPage;