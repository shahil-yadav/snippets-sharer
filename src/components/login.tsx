import { Button, Input, Link } from "@nextui-org/react";
import { useState } from "react";
import { AuthStates } from "../types";
import { login } from "../lib/firebase/auth";

function Login({
  setSelected,
}: {
  setSelected: React.Dispatch<React.SetStateAction<AuthStates>>;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    if (!email || !password) return;
    login({ email, password });
  };
  return (
    <form className="flex flex-col gap-4" onSubmit={handleLogin}>
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
        Need to create an account?{" "}
        <Link size="sm" onPress={() => setSelected(AuthStates.signup)}>
          Sign up
        </Link>
      </p>
      <div className="flex justify-end gap-2">
        <Button type="submit" fullWidth color="primary">
          Login
        </Button>
      </div>
    </form>
  );
}

export default Login;
