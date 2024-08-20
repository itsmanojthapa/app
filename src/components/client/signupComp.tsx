"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import signupAction from "@/actions/signup";
import { redirect } from "next/navigation";
import { toast } from "../ui/use-toast";
import { BeatLoader } from "react-spinners";
import { signupValid, signupType } from "@/z/signup";

const SignupComp = () => {
  const [loading, setLoading] = React.useState(false);

  const [formData, setFormData] = useState<signupType>({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof signupType, string[]>>
  >({
    name: [],
    email: [],
    password: [],
    confirm: [],
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
      const result = signupValid.safeParse(newFormData);

      if (!result.success) {
        const errorMessages = result.error.flatten().fieldErrors;
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: errorMessages[name as keyof signupType],
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
      action={async (e: FormData) => {
        const name = e.get("name") as string;
        const email = e.get("email") as string;
        const password = e.get("password") as string;
        const confirm = e.get("confirm") as string;

        const test = signupValid.safeParse({ name, email, password, confirm });

        if (!test.success) {
          setLoading(false);
          toast({ title: "Enter Valid Fields" });
          return;
        }

        const result = await signupAction(name, email, password);

        if (result.success && result.redirectTo) {
          toast({ title: "Account is Created now Login" });
          redirect(result.redirectTo);
        } else if (!result.success) {
          toast({
            title: result.message,
          });
        }
        setLoading(false);
      }}>
      <div className="grid w-full items-center gap-4">
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="string"
            name="name"
            placeholder="name"
            onChange={handleChange}
            value={formData.name}
          />

          {errors?.name && (
            <div className="text-red-500 text-xs">{errors.name[0]}</div>
          )}
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="string"
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
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="password">Confirm Password</Label>
          <Input
            id="confirm"
            type="password"
            name="confirm"
            placeholder="Confirm Password"
            onChange={handleChange}
            value={formData.confirm}
          />
          {errors?.confirm && (
            <div className="text-red-500 text-xs">{errors.confirm[0]}</div>
          )}
        </div>
        {loading ? (
          <Button type="submit">
            <BeatLoader color={"white"} size={10} />
          </Button>
        ) : (
          <Button
            type="submit"
            onClick={() => {
              setLoading(true);
            }}>
            Login
          </Button>
        )}
      </div>
    </form>
  );
};

export default SignupComp;
