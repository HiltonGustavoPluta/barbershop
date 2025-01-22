import { MenuIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

const Header = () => {
  return (
    <Card>
      <CardContent className="p-5 flex justify-between flex-row items-center">
        <a>Logo</a>
        <Button variant="outline" size="icon" className="h-8 w-8">
          <MenuIcon size={18}  />
        </Button>
      </CardContent>
    </Card>  
  );
}
 
export default Header;