import { Button } from "@nextui-org/react";
import { IconCode, IconPlus } from "@tabler/icons-react";
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthContext } from "../context/auth-provider";
import { db } from "../lib/firebase/database";
import { TItems } from "../types";
import { BentoGrid, BentoGridItem } from "./ui/bento-grid";
import Skeleton from "./ui/skeleton";
import { cn } from "../utils/cn";

function SnippetsList() {
  const { user } = useAuthContext();
  const [items, setItems] = useState<TItems>([]);
  async function handleAddButtonPress() {
    if (!user) {
      alert("You aren't logged in!");
      return;
    }
    const date = new Date();
    const language = "javascript";
    const title = `Snippet: ${date.toTimeString().split(" ")[0]}`;
    const snippetObj = {
      members: [user.uid],
      language,
      title,
      code: ``,
    };
    try {
      const snippetRef = await addDoc(collection(db, "snippets"), snippetObj);
      await addDoc(collection(db, "users"), {
        action: "created",
        ...snippetObj,
        snippetRef: snippetRef.id,
        uid: user.uid,
      });
    } catch (error) {
      console.log(
        "🚀 ~ file: snippets-list.tsx:83 ~ handleAddButtonPress ~ error:",
        error,
      );
    }
  }
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const data = change.doc.data();
        if (change.type == "added") {
          if (data.action === "created")
            setItems((prev) => [
              ...prev,
              {
                description: data.language,
                header: <Skeleton code={data.code} />,
                icon: <IconCode className="h-5 w-5 text-neutral-500" />,
                snippetRef: data.snippetRef,
                title: data.title,
              },
            ]);
        }
        if (change.type === "modified") {
          setItems((prev) =>
            prev.filter((item) => item.snippetRef !== data.snippetRef),
          );
        }
      });
    });
    return () => {
      unsubscribe();
    };
  }, []);
  return (
    <>
      <BentoGrid className="mx-auto max-w-5xl px-6 py-3">
        {items.map((item, i) => (
          <BentoGridItem
            key={i}
            className={cn(
              i === 3 || i === 6 ? "md:col-span-2" : "",
              "cursor-pointer",
            )}
            description={item.description}
            header={item.header}
            icon={item.icon}
            modalHeader="Deleting the snippet to Trash"
            snippetRef={item.snippetRef}
            title={item.title}
          />
        ))}
      </BentoGrid>
      <Button
        className="fixed bottom-[10%] right-5"
        color="success"
        isIconOnly
        onPress={handleAddButtonPress}
        radius="full"
        size="lg"
      >
        <IconPlus className="text-white" />
      </Button>
    </>
  );
}

export default SnippetsList;
