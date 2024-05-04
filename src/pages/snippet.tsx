import { Editor } from "@monaco-editor/react";
import { Autocomplete, AutocompleteItem, Button } from "@nextui-org/react";
import axios from "axios";
import { useState } from "react";

const availLanguages: {
  defaultCode: string;
  editorLanguage: string;
  languageId: number;
  label: string;
}[] = [
  {
    defaultCode: `//hello.ts
    function greet(name){
      console.log("Hello" + " " + name);
    }
    greet("User");`,
    editorLanguage: "javascript",
    languageId: 93,
    label: "JavaScript (Node.js 18.15.0)",
  },
  {
    defaultCode: `// hello.ts

    function greet(name: string): void {
        console.log(\`Hello, \${name}\`);
    }
    
    greet("World");
    `,
    editorLanguage: "typescript",
    languageId: 94,
    label: "TypeScript (5.0.3)",
  },
  {
    defaultCode: `#include <iostream>

    int main() {
        std::cout << "Hello, World!" << std::endl;
        return 0;
    }
    `,
    editorLanguage: "cpp",
    label: "C++ (Clang 7.0.1)",
    languageId: 76,
  },
  {
    defaultCode: `class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def introduce(self):
        print(f"Hello, my name is {self.name} and I am {self.age} years old.")

alice = Person("Alice", 30)
alice.introduce()
`,
    editorLanguage: "python",
    label: "Python (3.11.2)",
    languageId: 92,
  },
];
const defaultIndex = 0;

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
  const [editorLanguage, setEditorLanguage] = useState(
    availLanguages[defaultIndex].editorLanguage,
  );
  const [code, setCode] = useState<string>();
  const [consoleOutput, setConsoleOutput] = useState<TResponse>();
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
  return (
    <div className="flex h-full overflow-hidden">
      <div className="h-full w-[65%]">
        <div className="m-2">
          <Autocomplete
            defaultItems={availLanguages}
            label="Availaible Languages"
            defaultSelectedKey={availLanguages[defaultIndex].editorLanguage}
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
        </div>
        <Editor
          theme="vs-dark"
          language={
            availLanguages.find(
              (language) => language.editorLanguage === editorLanguage,
            )?.editorLanguage
          }
          onChange={(value) => setCode(value)}
          value={code}
          options={{
            fontFamily: "Consolas",
            fontLigatures: true,
            fontSize: 18,
            minimap: {
              enabled: false,
            },
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
