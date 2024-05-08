import { Avatar, AvatarGroup } from "@nextui-org/react";
import { doc, DocumentData, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../lib/firebase/database";

function MembersGroup({ members }: { members: string[] }) {
  const [accounts, setAccounts] = useState<DocumentData[]>([]);
  useEffect(() => {
    // Case of Deletion:
    if (members.length < accounts.length) {
      const accountUid = accounts.map((account) => account.uid);
      accountUid.forEach((uid) => {
        if (!members.includes(uid))
          setAccounts((prev) => [...prev.filter((item) => item.uid !== uid)]);
      });
      return;
    }
    members.forEach(async (uid) => {
      const accountDoc = await getDoc(doc(db, "accounts", uid));
      if (!accountDoc.exists()) return;
      const account = accountDoc.data();
      setAccounts((prev) => {
        const prevUid = prev.map((el) => el.uid);
        if (prevUid.includes(account.uid)) return [...prev];
        else return [...prev, account];
      });
    });
  }, [members, accounts.length]);
  return (
    <AvatarGroup>
      {accounts.map((account) => (
        <Avatar key={account.uid} alt={account.name} src={account.avatar} />
      ))}
    </AvatarGroup>
  );
}

export default MembersGroup;
