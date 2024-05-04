import { Card, CardBody, CardHeader, Tab, Tabs } from "@nextui-org/react";
import { useState } from "react";
import Login from "../components/login";
import Signup from "../components/signup";
import { AuthStates } from "../types";

export default function Auth() {
  const [selected, setSelected] = useState<AuthStates>(AuthStates.login);
  return (
    <main className="flex h-screen items-center justify-center">
      <div className="flex flex-col">
        <Card className="h-[450px] w-[340px] max-w-full shadow-none">
          <CardHeader>
            <h1 className="w-full text-right text-3xl font-semibold">
              {selected}
            </h1>
          </CardHeader>
          <CardBody className="overflow-hidden">
            <Tabs
              fullWidth
              size="md"
              aria-label="Tabs form"
              selectedKey={selected}
              onSelectionChange={(key) => setSelected(key as AuthStates)}
            >
              <Tab key={AuthStates.login} title="Login">
                <Login setSelected={setSelected} />
              </Tab>
              <Tab key={AuthStates.signup} title="Sign up">
                <Signup setSelected={setSelected} />
              </Tab>
            </Tabs>
          </CardBody>
        </Card>
      </div>
    </main>
  );
}
