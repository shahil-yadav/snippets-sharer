import { Avatar, Button, Card, CardHeader } from "@nextui-org/react";
import { IconInfoCircle } from "@tabler/icons-react";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthContext } from "../context/useAuthContext";
import { db } from "../lib/firebase/database";

function Header() {
  const { user } = useAuthContext();
  const [account, setAccount] = useState<{
    displayName: string;
    photoUrl: string;
  }>();
  useEffect(() => {
    async function fetchAccount() {
      if (!user) return;
      const accountDoc = await getDoc(doc(db, "accounts", user.uid));
      if (!accountDoc.exists()) return;
      const account = accountDoc.data();
      setAccount({
        displayName: account.name,
        photoUrl: account.avatar,
      });
    }
    fetchAccount();
  }, []);

  return (
    <Card className="flex-shrink-0 rounded-none">
      <CardHeader className="justify-between px-8 py-5">
        {account && (
          <div className="flex gap-5">
            <Avatar
              isBordered
              radius="md"
              size="md"
              src={account.photoUrl}
              alt={account.displayName}
            />

            <div className="flex flex-col items-start justify-center gap-1">
              <h4 className="text-small font-semibold leading-none text-default-600">
                {account.displayName}
              </h4>
            </div>
          </div>
        )}
        <Button isIconOnly color="default" aria-label="Like">
          <IconInfoCircle />
        </Button>
      </CardHeader>
    </Card>
  );
}
export { Header };
