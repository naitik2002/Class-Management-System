import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Dashboard from "./components/local/dashboard";
import Members from "./components/local/members";
import Books from "./components/local/books";
import Genres from "./components/local/genres";
import Authors from "./components/local/authors";
import { Button } from "./components/ui/button";
import { Toaster } from "./components/ui/toaster";
import axios from "axios";
import { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "./components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "./components/ui/form";
import { Input } from "./components/ui/input";
import { env } from "./config";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoginPage, setLoginPage] = useState(true);
  const setAuthenticated = useCallback(() => {
    setIsAuthenticated(true);
  }, []);

  const toggleLoginPage = useCallback(() => {
    setLoginPage(!isLoginPage);
  }, [isLoginPage]);

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user") ?? "{}");
      if (user && user.email) {
        setAuthenticated();
      }
    } catch (error) {
      console.log(error);
    }
  }, [setAuthenticated]);

  const router = createBrowserRouter([
    {
      path: "/",
      Component: Dashboard,
    },
    {
      path: "/members",
      Component: Members,
    },
    {
      path: "/books",
      Component: Books,
    },
    {
      path: "/genres",
      Component: Genres,
    },
    {
      path: "/authors",
      Component: Authors,
    },
  ]);

  return (
    <>
      {!isAuthenticated ? (
        isLoginPage ? (
          <LoginComponent
            setAuthenticated={setAuthenticated}
            toggleLoginPage={toggleLoginPage}
          ></LoginComponent>
        ) : (
          <SignupComponent toggleLoginPage={toggleLoginPage}></SignupComponent>
        )
      ) : (
        <>
          <div className="container">
            <RouterProvider router={router}></RouterProvider>
          </div>
          <Toaster></Toaster>
        </>
      )}
    </>
  );
}

interface AddLoginComponentProps {
  setAuthenticated: () => void;
  toggleLoginPage: () => void;
}

function LoginComponent(props: AddLoginComponentProps) {
  const form = useForm();

  const onLogin = useCallback(async () => {
    const email = form.getValues().email;
    const password = form.getValues().password;
    const res = await axios.post(`${env.SERVER_URL}/api/Users/Login`, {
      email,
      password,
    });

    console.log(JSON.stringify(res.data));

    localStorage.setItem("user", JSON.stringify(res.data));
    props.setAuthenticated();
  }, [form, props]);

  return (
    <>
      <Card className="w-[350px] mx-auto mt-52">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Email" {...field} />
                  </FormControl>
                  <FormMessage />
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
                    <Input placeholder="Enter Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="submit" onClick={onLogin}>
            Submit
          </Button>
          <Button type="button" variant="link" onClick={props.toggleLoginPage}>
            signup
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}

interface AddSignupComponentProps {
  toggleLoginPage: () => void;
}

function SignupComponent(props: AddSignupComponentProps) {
  const form = useForm();

  const onLogin = useCallback(async () => {
    const email = form.getValues().email;
    const password = form.getValues().password;
    await axios.post(`${env.SERVER_URL}/api/Users/signup`, {
      email,
      password,
    });
    props.toggleLoginPage();
  }, [form, props]);

  return (
    <>
      <Card className="w-[350px] mx-auto mt-52">
        <CardHeader>
          <CardTitle>Signup</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Email" {...field} />
                  </FormControl>
                  <FormMessage />
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
                    <Input placeholder="Enter Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="submit" onClick={onLogin}>
            Submit
          </Button>
          <Button type="button" variant="link" onClick={props.toggleLoginPage}>
            login
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}

export default App;
