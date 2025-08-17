"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { UserWithMetadata } from "@/db/schema";
import { toast } from "sonner";
import { useSetAtom } from "jotai";
import { isAuthenticatedAtom, userDataAtom } from "@/store/authStore";

const LoginForm = () => {
  const setIsAuthenticated = useSetAtom(isAuthenticatedAtom);
  const setUserData = useSetAtom(userDataAtom);
  const formSchema = z.object({
    email: z.string().email({
      message: "Invalid email",
    }),
    password: z.string().min(8, {
      message: "Password should be a 8 characters long",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ ...values }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      const data: {
        user: UserWithMetadata;
      } = await response.json();
      if (data) {
        setIsAuthenticated(true);
        setUserData(data.user);
        toast.success("You are successfully logged in");
        return redirect("/dashboard/home");
      }
    } else {
      toast.error(await response.text());
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormDescription>Enter your FedEx work email</FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormDescription>
                Password should be greater than or equal to 8 characters
              </FormDescription>
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default LoginForm;
