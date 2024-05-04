import { Button, Link } from "@nextui-org/react";
import { IconHome, IconTrashFilled, IconUsers } from "@tabler/icons-react";
import { useLocation } from "react-router-dom";

function Footer() {
  const location = useLocation();
  return (
    <div className="flex items-center justify-center gap-7 py-5">
      <Button
        color={location.pathname === "/" ? "secondary" : "default"}
        radius="full"
        variant="ghost"
      >
        <Link href="/" color="foreground">
          <IconHome />
        </Link>
      </Button>

      <Button
        color={
          location.pathname === "/shared-with-me" ? "secondary" : "default"
        }
        radius="full"
        variant="flat"
      >
        <Link href="/shared-with-me" color="foreground">
          <IconUsers />
        </Link>
      </Button>

      <Button
        color={location.pathname === "/trash" ? "danger" : "default"}
        radius="full"
        variant="solid"
      >
        <Link color="foreground" href="/trash">
          <IconTrashFilled />
        </Link>
      </Button>
    </div>
  );
}
export default Footer;
