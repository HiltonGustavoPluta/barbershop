import { redirect } from "next/navigation";
import BarbershopItem from "../(home)/_components/barbershop-item";
import Header from "@/components/header";
import { db } from "../_lib/prisma";
import Search from "../(home)/_components/search";

interface BarbershopsPageProps {
  searchParams: Promise<{ search?: string }>;
}

const BarbershopsPage = async ({ searchParams }: BarbershopsPageProps) => {

  const resolvedSearchParams = await searchParams; // Esperamos o searchParams antes de acessar
  const searchQuery = resolvedSearchParams?.search || "";


  if (!resolvedSearchParams.search) {
    return redirect("/");
  }

  const barbershops = await db.barbershop.findMany({
    where: {
      name: {
        contains: searchQuery,
        mode: "insensitive",
      },
    },
  });

  return (
    <div className="min-h-screen">
      <Header />

      <div className="px-5 py-6 flex flex-col gap-6">
        <Search
          defaultValues={{
            search: resolvedSearchParams.search,
          }}
        />

        <h1 className="text-gray-400 font-bold text-xs uppercase">Resultados para &quot;{resolvedSearchParams.search}&quot;</h1>

        <div className="grid grid-cols-2 gap-4">
          {barbershops.map((barbershop) => (
            <div key={barbershop.id} className="w-full">
              <BarbershopItem barbershop={barbershop} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BarbershopsPage;