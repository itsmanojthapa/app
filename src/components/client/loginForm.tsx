"use client";

import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import loginAction from "@/actions/login";
import { toast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BeatLoader } from "react-spinners";
import { loginType, loginValid } from "@/z/login";

const LoginForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<loginType>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof loginType, string[]>>
  >({
    email: [],
    password: [],
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name } = e.target;
    let { value } = e.target;
    if (name == "email") {
      value = value.toLocaleLowerCase();
    }

    //validate during state change to prevent re-render data problem
    setFormData((prevFormData) => {
      const newFormData = { ...prevFormData, [name]: value };
      const result = loginValid.safeParse(newFormData);

      if (!result.success) {
        const errorMessages = result.error.flatten().fieldErrors;
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: errorMessages[name as keyof loginType],
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: undefined,
        }));
      }

      return newFormData;
    });
  }

  return (
    <form
      action={async (e) => {
        setLoading(true);
        const email = e.get("email") as string;
        const password = e.get("password") as string;

        const test = loginValid.safeParse({ email, password });

        if (!test.success) {
          setLoading(false);
          toast({ title: "Enter Valid Fields" });
          return;
        }

        const error = await loginAction(email, password);

        if (!error) {
          toast({
            title: "Login Sucessfull.",
          });
          router.refresh();
        } else {
          toast({
            title: String(error),
          });
        }
        setLoading(false);
      }}>
      <div className="grid w-full items-center gap-4">
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            value={formData.email}
          />
          {errors?.email && (
            <div className="text-red-500 text-xs">{errors.email[0]}</div>
          )}
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            value={formData.password}
          />
          {errors?.password && (
            <div className="text-red-500 text-xs">{errors.password[0]}</div>
          )}
        </div>
        {loading ? (
          <Button type="submit">
            <BeatLoader color={"white"} size={10} />
          </Button>
        ) : (
          <Button type="submit" onClick={() => setLoading(true)}>
            Login
          </Button>
        )}
      </div>
    </form>
  );
};

export default LoginForm;
