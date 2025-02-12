import { Editor, OnChange } from "@monaco-editor/react";
import {
  Autocomplete,
  AutocompleteItem,
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import { IconDeviceDesktop, IconPencilCode } from "@tabler/icons-react";
import axios from "axios";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  DocumentData,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MembersGroup from "../components/members-group";
import { availLanguages, defaultIndex } from "../constants";
import { useAuthContext } from "../context/useAuthContext";
import { db } from "../lib/firebase/database";

interface TResponse {
  stdout: string;
  time: string;
  stderr: string | null;
  message: string | null;
  status: {
    id: string;
    description: string;
  };
}

function Snippet() {
  const { id } = useParams();
  const { user } = useAuthContext();
  const [code, setCode] = useState<string>(
    availLanguages[defaultIndex].defaultCode,
  );
  const [consoleOutput, setConsoleOutput] = useState<TResponse>();
  const [errorMsg, setErrMsg] = useState("");
  const [editorLanguage, setEditorLanguage] = useState(
    availLanguages[defaultIndex].editorLanguage,
  );
  const [isLoading, setIsLoading] = useState(false);

  async function handleClick() {
    if (!code || !editorLanguage) {
      alert("No value in text editor, no language chosen");
      return;
    }

    const options = {
      method: "POST",
      url: "https://judge0-ce.p.rapidapi.com/submissions",
      params: {
        base64_encoded: "true",
        wait: "true",
        fields: "stdout,time,stderr,message",
      },
      headers: {
        "content-type": "application/json",
        "Content-Type": "application/json",
        "X-RapidAPI-Key": "f8b12319b2msh80cf61dec01fdf0p1809a4jsn1183818c7dfe",
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
      },
      data: {
        language_id: availLanguages.find(
          (language) => language.editorLanguage === editorLanguage,
        )!.languageId, // Java
        source_code: btoa(code),
        // stdin: "SnVkZ2Uw",
      },
    };
    try {
      setIsLoading(true);
      const data = (await axios.request<TResponse>(options)).data;
      console.log("🚀 ~ file: snippet.tsx:133 ~ handleClick ~ data:", data);
      setConsoleOutput(data);
    } catch (error) {
      console.log("🚀 ~ file: snippet.tsx:40 ~ handleClick ~ error:", error);
    } finally {
      setIsLoading(false);
    }
  }
  const handleChange: OnChange = async (value) => {
    if (!id) return;
    try {
      await updateDoc(doc(db, "snippets", id), {
        code: value,
      });
    } catch (error) {
      console.log(
        "🚀 ~ file: snippet.tsx:131 ~ consthandleChange:OnChange= ~ error:",
        error,
      );
    }
  };

  useEffect(() => {
    if (!id) return;
    async function checkAuthorisationOfSnippet() {
      const document = await getDoc(doc(db, "snippets", id!));
      if (!document.exists()) {
        setErrMsg(() => "Snippet not found");
      } else {
        const members = document.data().members;
        if (!user) {
          setErrMsg("You aren't logged in");
        } else if (members.includes(user.uid)) {
          setErrMsg("");
        } else {
          setErrMsg("You are not a member of this snippet");
        }
      }
    }
    checkAuthorisationOfSnippet();
    const unsubSnippetListener = onSnapshot(
      doc(db, "snippets", id),
      (document) => {
        if (!document.exists()) {
          console.log(
            "🚀 ~ file: snippet.tsx:143 ~ unsub ~ exists:",
            "No document exists",
          );
          return;
        }
        const snippet = document.data();
        setCode(() => snippet.code);
      },
    );
    return () => {
      unsubSnippetListener();
    };
  }, [id, user]);

  return errorMsg.length === 0 ? (
    <>
      <div className="hidden h-full overflow-hidden lg:flex">
        <div className="h-full w-[65%]">
          <EditorHeader
            setCode={setCode}
            setEditorLanguage={setEditorLanguage}
          />
          <Editor
            theme="vs-dark"
            language={
              availLanguages.find(
                (language) => language.editorLanguage === editorLanguage,
              )?.editorLanguage
            }
            onChange={handleChange}
            value={code}
            options={{
              fontFamily: "Consolas",
              fontLigatures: true,
              fontSize: 18,
              minimap: {
                enabled: false,
              },
              cursorSmoothCaretAnimation: "on",
              smoothScrolling: true,
            }}
          />
        </div>
        <div className="w-full flex-1 overflow-y-auto px-5">
          <div className="m-5 text-right">
            <Button
              onClick={handleClick}
              color="success"
              variant="flat"
              isLoading={isLoading}
            >
              Run
            </Button>
          </div>
          <Console consoleOutput={consoleOutput} />
        </div>
      </div>
      <div className="flex h-full items-center justify-center lg:hidden">
        <Card radius="sm" className="px-2 py-1">
          <CardHeader>
            <h2 className="text-lg">
              Mobile/Tablet Screen{" "}
              <span className="text-yellow-400 underline">detected</span>
            </h2>
          </CardHeader>
          <Divider />
          <CardBody>
            <p>Open the snippet as in the desktop to allow editing</p>
            <div className="flex justify-center">
              <IconDeviceDesktop />
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  ) : (
    <div className="flex h-full items-center justify-center">
      <p className="text-3xl">{errorMsg}</p>
    </div>
  );
}

function EditorHeader({
  setEditorLanguage,
  setCode,
}: {
  setCode: React.Dispatch<React.SetStateAction<string>>;
  setEditorLanguage: React.Dispatch<React.SetStateAction<string>>;
}) {
  const { id } = useParams();
  const [accounts, setAccounts] = useState<DocumentData[]>([]);
  const [members, setMembers] = useState<string[]>([]);
  async function handleAddUserToSnippet(account: DocumentData) {
    if (!id) return;
    const snippetDoc = await getDoc(doc(db, "snippets", id));
    if (!snippetDoc.exists()) return;
    const snippet = snippetDoc.data();
    const members: string[] = snippet.members;
    if (members.includes(account.uid) === true) return;
    await updateDoc(doc(db, "snippets", id), {
      members: arrayUnion(account.uid),
    });
    await addDoc(collection(db, "users"), {
      action: "shared",
      snippetRef: id,
      uid: account.uid,
    });
  }
  useEffect(() => {
    if (!id) return;
    const unsubCollectionOfAccounts = onSnapshot(
      collection(db, "accounts"),
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            setAccounts((prev) => {
              const presentUid = prev.map((item) => item.uid);
              const accountFrmDatabase = change.doc.data();
              if (presentUid.includes(accountFrmDatabase)) return [...prev];
              else return [...prev, accountFrmDatabase];
            });
          }
        });
      },
    );
    const unsubSnippetMembers = onSnapshot(
      doc(db, "snippets", id),
      (snapshot) => {
        if (!snapshot.exists()) return;
        setMembers(() => [...snapshot.data().members]);
      },
    );
    return () => {
      unsubCollectionOfAccounts();
      unsubSnippetMembers();
    };
  }, [id]);

  return (
    <div className="m-2 flex items-center gap-2">
      <Autocomplete
        defaultItems={availLanguages}
        defaultSelectedKey={availLanguages[defaultIndex].editorLanguage}
        label="Availaible Languages"
        size="sm"
        className="max-w-xs"
      >
        {(item) => (
          <AutocompleteItem
            onClick={() => {
              setEditorLanguage(item.editorLanguage);
              setCode(item.defaultCode);
            }}
            key={item.editorLanguage}
          >
            {item.label}
          </AutocompleteItem>
        )}
      </Autocomplete>

      <Popover placement="bottom">
        <PopoverTrigger>
          <Button isIconOnly>
            <IconPencilCode />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="rounded-sm">
          <Card radius="none" shadow="none">
            <CardHeader>
              <h3 className="text-lg">
                {" "}
                Invite Devs to collaborate in your snippet
              </h3>
            </CardHeader>
            <CardBody>
              <Autocomplete
                defaultItems={accounts}
                variant="bordered"
                label="Assigned to"
                placeholder="Select a user"
                labelPlacement="inside"
                className="max-w-xs"
              >
                {(account) => (
                  <AutocompleteItem
                    key={account.email}
                    onPress={() => handleAddUserToSnippet(account)}
                    textValue={account.name}
                  >
                    <div className="flex items-center gap-2">
                      <Avatar
                        alt={account.name}
                        className="flex-shrink-0"
                        size="sm"
                        src={account.avatar}
                      />
                      <div className="flex flex-col">
                        <span className="text-small">{account.name}</span>
                        <span className="text-tiny text-default-400">
                          {account.email}
                        </span>
                      </div>
                    </div>
                  </AutocompleteItem>
                )}
              </Autocomplete>
            </CardBody>
          </Card>
        </PopoverContent>
      </Popover>

      <MembersGroup members={members} />
    </div>
  );
}

function Console({ consoleOutput }: { consoleOutput?: TResponse }) {
  if (!consoleOutput) return null;
  return consoleOutput.status.description === "Accepted" ? (
    <>
      <p className="text-md font-medium">{atob(consoleOutput.stdout)}</p>
      <p className="text-green-500">{consoleOutput.time}</p>
    </>
  ) : (
    <>
      <p className="text-red-400">{atob(consoleOutput.stderr || "")}</p>
      <p className="text-rose-500 underline">
        {atob(consoleOutput.message || "")}
      </p>
      <p className="font-semibold underline">
        {consoleOutput.status.description}
      </p>
    </>
  );
}

export default Snippet;
