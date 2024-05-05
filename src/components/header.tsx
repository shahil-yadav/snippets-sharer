import { Avatar, Button, Card, CardHeader } from "@nextui-org/react";
import { IconInfoCircle } from "@tabler/icons-react";
import { useAuthContext } from "../context/auth-provider";

function Header() {
  const { user } = useAuthContext();
  return (
    user &&
    user.photoURL && (
      <Card className="flex-shrink-0 rounded-none">
        <CardHeader className="justify-between px-8 py-5">
          <div className="flex gap-5">
            <Avatar
              isBordered
              radius="md"
              size="md"
              src={user.photoURL}
              alt={user.displayName || "user"}
            />
            <div className="flex flex-col items-start justify-center gap-1">
              <h4 className="text-small font-semibold leading-none text-default-600">
                {user.displayName}
              </h4>
            </div>
          </div>
          <Button isIconOnly color="default" aria-label="Like">
            <IconInfoCircle />
          </Button>
        </CardHeader>
      </Card>
    )
  );
}
export { Header };
