import { LoginForm } from "./login-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Building, Lock, User } from "lucide-react";

import React from "react";

const Login = () => {
  return (
    <div className="flex sm:flex-row flex-col-reverse gap-4 w-full h-full lg:p-10 p-5 justify-center items-center">
      <Card className="p-5 mx-auto h-full w-full sm:w-4/5 md:w-3/5 xl:w-2/5 space-y-4">
        <CardHeader>
          <h2 className="text-xl font-bold tracking-tight">
            Logowanie do panelu
          </h2>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
      <Card className="p-5 mx-auto h-full w-full sm:w-4/5 md:w-3/5 xl:w-2/5 space-y-4">
        <CardHeader>
          <h2 className="text-xl font-bold tracking-tight">
            Dane logowania do demo:
          </h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-col space-y-2">
              <div className="flex-1 space-y-1">
                <span className="font-bold">Login:</span>{" "}
                <span>
                  <span className="font-light">admin</span>
                </span>
              </div>
              <div className="flex-1 space-y-1">
                <span className="font-bold">Hasło:</span>{" "}
                <span>
                  <span className="font-light">.9c8uaevlo7v</span>
                </span>
              </div>
            </div>
            <Lock size={36} />
          </div>
          <Separator />
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-col space-y-2">
              <div className="flex-1 space-y-1">
                <span className="font-bold">Login:</span>{" "}
                <span>
                  <span className="font-light">podmiot.admin</span>
                </span>
              </div>
              <div className="flex-1 space-y-1">
                <span className="font-bold">Hasło:</span>{" "}
                <span>
                  <span className="font-light">0.8041qaaz7sc</span>
                </span>
              </div>
            </div>
            <Building size={36} />
          </div>
          <Separator />
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-col space-y-2">
              <div className="flex-1 space-y-1">
                <span className="font-bold">Login:</span>{" "}
                <span>
                  <span className="font-light">czlonek</span>
                </span>
              </div>
              <div className="flex-1 space-y-1">
                <span className="font-bold">Hasło:</span>{" "}
                <span>
                  <span className="font-light">0.xinqy0w1nv</span>
                </span>
              </div>
            </div>
            <User size={36} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
