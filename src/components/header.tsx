import { Avatar, Button, Card, CardHeader } from "@nextui-org/react";
import { IconInfoCircle } from "@tabler/icons-react";
import { getAuth } from "firebase/auth";

function Header() {
  const auth = getAuth();
  return (
    <Card className="flex-shrink-0 rounded-none">
      <CardHeader className="justify-between px-8 py-5">
        <div className="flex gap-5">
          <Avatar
            isBordered
            radius="md"
            size="md"
            name={auth.currentUser?.displayName || ""}
          />
          <div className="flex flex-col items-start justify-center gap-1">
            <h4 className="text-small font-semibold leading-none text-default-600">
              {auth.currentUser?.displayName}
            </h4>
          </div>
        </div>
        <Button isIconOnly color="default" aria-label="Like">
          <IconInfoCircle />
        </Button>
      </CardHeader>
    </Card>
  );
}
export { Header };
