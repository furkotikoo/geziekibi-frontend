import {
  CreateAccount,
  DontHaveAccount,
  EmailAddressLogIn,
  ForgotPassword,
  Href,
  OrSignInWith,
  Password,
  RememberPassword,
  SignIn,
  SignInToAccount,
} from "@/Constant/constant";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "react-toastify";
import { Button, Form, FormGroup, Input, Label } from "reactstrap";
import imageOne from "../../../public/assets/images/logo/logo-1.png";
import imageTwo from "../../../public/assets/images/logo/logo.png";
import Image from "next/image";
import { UserSocialApp } from "./UserSocialApp";
import { signin } from "@/app/actions/auth/signin";
import {
  ApiErrorResponse,
  ErrorValidation,
  LoginSuccessResponse,
} from "@/Types/ApiResponseType";
import { SigninSchema } from "@/app/lib/definitions";
import { useFormStatus } from "react-dom";

export const UserForm = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("test1@test.com");
  const [password, setPassword] = useState("test1");

  const [formState, setFormState] = useState<SigninSchema>({
    email: "Test123@gmail.com",
    password: "Test@123",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorsValidation, setErrorsValidation] = useState<
    ErrorValidation[] | null
  >([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const router = useRouter();

  const { pending } = useFormStatus();

  const submitData = async () => {
    let response = await fetch("http://localhost:4000/v1/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: email,
        password: password,
      }),
      headers: {
        "Content-type": "application/json",
      },
    });

    response = await response.json();

    alert(JSON.stringify(response));
  };

  const formSubmitHandle = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorsValidation([]);
    const formData = new FormData(event.currentTarget);
    try {
      const response = await signin(formData);

      if ("errorMessage" in response) {
        console.log({ response });
        console.error("Error:", response.errorMessage);
        setErrorsValidation(response.errorsValidation);
        setErrorMessage(response.errorMessage);
      } else {
        console.log("Login successful:", response.message);
        console.log("Token:", response.data);

        console.log({ response });
        Cookies.set("dunzo_token", JSON.stringify(response.data));
        alert(JSON.stringify(response));
        setErrorsValidation(null);
        setErrorMessage("");
      }
    } catch (error) {
      console.log({ error });
    }

    // const isApiErrorResponse = response as ApiErrorResponse;
    // const loginResponnse = response as LoginSuccessResponse;
    // const errors: string[] = response as string[];
    // if (errors) {
    //   console.log({ errors });
    //   setError(errors[0]);
    // } else if (isApiErrorResponse) {
    //   console.log({ isApiErrorResponse });
    //   setError(isApiErrorResponse.errorMessage);
    // } else if (loginResponnse) {
    //   console.log({ loginResponnse });
    //   Cookies.set("dunzo_token", JSON.stringify(loginResponnse.data));
    //   setError(loginResponnse.data);
    // }

    setIsLoading(false);
    // if (email == "Test123@gmail.com" && password == "Test@123") {
    //   Cookies.set("dunzo_token", JSON.stringify(true));
    //   router.push("/");
    //   window.location.reload();
    // } else {
    //   toast.error("Please Enter Valid Email Or Password");
    // }
  };

  return (
    <div>
      <div>
        <Link className="logo" href="/dashboard/default">
          <Image
            priority
            width={120}
            height={38}
            className="img-fluid for-light"
            src={imageOne}
            alt="login page"
          />
          <Image
            priority
            width={120}
            height={38}
            className="img-fluid for-dark"
            src={imageTwo}
            alt="login page"
          />
        </Link>
      </div>
      <div className="login-main">
        <Form
          className="theme-form"
          onSubmit={(event) => formSubmitHandle(event)}
        >
          <h4>{SignInToAccount}</h4>
          {errorMessage && <p style={{ color: "red" }}> {errorMessage} </p>}
          <FormGroup>
            <Label className="col-form-label">{EmailAddressLogIn}</Label>
            <Input
              name="email"
              type="email"
              defaultValue={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Test123@gmail.com"
            />
            {errorsValidation &&
              errorsValidation.length > 0 &&
              errorsValidation?.map((errorObj) =>
                errorObj.email ? (
                  <p key="email-error" style={{ color: "red" }}>
                    {errorObj.email}
                  </p>
                ) : null
              )}
          </FormGroup>
          <FormGroup>
            <Label className="col-form-label">{Password}</Label>
            <div className="position-relative">
              <Input
                name="password"
                type={show ? "text" : "password"}
                defaultValue={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Test@123"
              />
              {errorsValidation &&
                errorsValidation.length > 0 &&
                errorsValidation?.map((errorObj) =>
                  errorObj.password ? (
                    <p key="password-error" style={{ color: "red" }}>
                      {errorObj.password}
                    </p>
                  ) : null
                )}
              <div className="show-hide" onClick={() => setShow(!show)}>
                <span className="show"> </span>
              </div>
            </div>
          </FormGroup>
          <FormGroup className="form-group mb-0">
            <div className="checkbox p-0">
              <Input id="checkbox1" type="checkbox" />
              <Label className="text-muted" htmlFor="checkbox1">
                {RememberPassword}
              </Label>
            </div>
            <div className="text-end mt-3">
              <Button type="submit" color="primary" block disabled={isLoading}>
                {SignIn}
              </Button>
            </div>
            <Link className="link" href={Href}>
              {ForgotPassword}?
            </Link>
          </FormGroup>
          {/* <h6 className="text-muted mt-4">{OrSignInWith}</h6> */}
          {/* <UserSocialApp /> */}
          <p className="mt-4 mb-0 text-center">
            {DontHaveAccount}
            <Link className="ms-2" href={"signup"}>
              {CreateAccount}
            </Link>
          </p>
        </Form>
      </div>
    </div>
  );
};
