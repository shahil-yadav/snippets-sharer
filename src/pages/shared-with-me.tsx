import { IconCodeCircle } from "@tabler/icons-react";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthContext } from "../context/useAuthContext";
import { db } from "../lib/firebase/database";
import { TItems } from "../types";
import { cn } from "../utils/cn";
import { BentoGrid, BentoGridItem } from "../components/ui/bento-grid";
import Skeleton from "../components/ui/skeleton";

function SharedWithMe() {
  const { user } = useAuthContext();
  const [items, setItems] = useState<TItems>([]);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "users"),
      where("uid", "==", user.uid),
      where("action", "==", "shared"),
    );
    const unsub = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        const users = change.doc.data();
        if (change.type === "added") {
          const snippetDoc = await getDoc(
            doc(db, "snippets", users.snippetRef),
          );
          if (snippetDoc.exists()) {
            const snippet = snippetDoc.data();
            setItems((prev) => [
              ...prev,
              {
                documentId: change.doc.id,
                description: snippet.language,
                header: <Skeleton code={snippet.code} />,
                icon: <IconCodeCircle className="h-5 w-5 text-neutral-500" />,
                snippetRef: users.snippetRef,
                title: users.title,
              },
            ]);
          }
        } else if (change.type === "removed") {
          setItems((prev) => [
            ...prev.filter((item) => item.snippetRef !== users.snippetRef),
          ]);
        }
      });
    });
    return () => {
      unsub();
    };
  }, []);

  return (
    <BentoGrid className="mx-auto max-w-5xl px-6 py-3">
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          className={cn(
            i === 3 || i === 6 ? "md:col-span-2" : "",
            "cursor-pointer",
          )}
          documentId={item.documentId}
          description={item.description}
          header={item.header}
          icon={item.icon}
          modalHeader="Opt out of the snippet"
          snippetRef={item.snippetRef}
          title={item.title}
          uid={user?.uid}
        />
      ))}
    </BentoGrid>
  );
}

export default SharedWithMe;
