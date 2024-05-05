import { Avatar, AvatarGroup } from "@nextui-org/react";
import { doc, DocumentData, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../lib/firebase/database";

function MembersGroup({ members }: { members: string[] }) {
  const [accounts, setAccounts] = useState<DocumentData[]>([]);
  console.log(
    "🚀 ~ file: members-group.tsx:8 ~ MembersGroup ~ accounts:",
    accounts,
  );
  useEffect(() => {
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
  }, [members]);
  return (
    <AvatarGroup>
      {accounts.map((account) => (
        <Avatar key={account.uid} alt={account.name} src={account.avatar} />
      ))}
    </AvatarGroup>
  );
}

export default MembersGroup;
