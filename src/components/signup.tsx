import { Button, Input, Link } from "@nextui-org/react";
import { useState } from "react";
import { signup } from "../lib/firebase/auth";
import { AuthStates } from "../types";

function Signup({
  setSelected,
}: {
  setSelected: React.Dispatch<React.SetStateAction<AuthStates>>;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSignup: React.FormEventHandler<HTMLFormElement> = async (
    event,
  ) => {
    event.preventDefault();
    if (!email || !password) return;
    try {
      await signup({
        email,
        password,
        name,
      });
    } catch (error) {
      console.error("📑 ~ file: signup.tsx:28 ~ error:", error);
    }
  };
  return (
    <form className="flex h-[300px] flex-col gap-4" onSubmit={handleSignup}>
      <Input
        isRequired
        label="Name"
        placeholder="Enter your name"
        type="text"
        value={name}
        onChange={(event) => setName(event.currentTarget.value)}
      />
      <Input
        isRequired
        label="Email"
        placeholder="Enter your email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.currentTarget.value)}
      />
      <Input
        isRequired
        label="Password"
        placeholder="Enter your password"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.currentTarget.value)}
      />
      <p className="text-center text-small">
        Already have an account?{" "}
        <Link
          className="cursor-pointer"
          size="sm"
          onPress={() => setSelected(AuthStates.login)}
        >
          Login
        </Link>
      </p>
      <div className="flex justify-end gap-2">
        <Button type="submit" color="primary" fullWidth>
          Sign up
        </Button>
      </div>
    </form>
  );
}

export default Signup;
