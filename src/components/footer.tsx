import { Button } from "@nextui-org/react";
import { IconHome, IconTrashFilled, IconUsers } from "@tabler/icons-react";
import { useLocation, useNavigate } from "react-router-dom";

function Footer() {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center gap-7 py-5">
      <Button
        color={location.pathname === "/" ? "secondary" : "default"}
        onPress={() => navigate("/")}
        radius="full"
        variant="ghost"
      >
        <IconHome />
      </Button>

      <Button
        color={
          location.pathname === "/shared-with-me" ? "secondary" : "default"
        }
        onClick={() => navigate("/shared-with-me")}
        radius="full"
        variant="flat"
      >
        <IconUsers />
      </Button>

      <Button
        color={location.pathname === "/trash" ? "danger" : "default"}
        onClick={() => navigate("/trash")}
        radius="full"
        variant="solid"
      >
        <IconTrashFilled />
      </Button>
    </div>
  );
}
export default Footer;
