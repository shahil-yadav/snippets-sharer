export const availLanguages: {
  defaultCode: string;
  editorLanguage: string;
  languageId: number;
  label: string;
}[] = [
  {
    defaultCode: `//Sample JS code\nfunction greet(name) {\nconsole.log("Hello" + " " + name);\n}\ngreet("User");`,
    editorLanguage: "javascript",
    languageId: 93,
    label: "JavaScript (Node.js 18.15.0)",
  },
  {
    defaultCode: `//Sample TS code\nfunction greet(name:string) {\nconsole.log("Hello" + " " + name);\n}\ngreet("User");`,
    editorLanguage: "typescript",
    languageId: 94,
    label: "TypeScript (5.0.3)",
  },
  {
    defaultCode:
      '#include <iostream>\nint main() {\n  std::cout << "Hello, World!" << std::endl;\n  return 0;\n}',
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

export const defaultIndex = 0;
