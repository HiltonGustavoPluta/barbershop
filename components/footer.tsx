import { format } from "date-fns";

const Footer = () => {
  return ( 
    <div className="w-full bg-secondary py-6 px-5 opacity-75">
      <p className="text-gray-400 text-xs font-bold">
        {format(new Date(), 'y')} Copyright Barbershop
      </p>
    </div>
   );
}
 
export default Footer;