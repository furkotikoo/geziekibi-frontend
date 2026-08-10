import {
  CreateAccount,
  DontHaveAccount,
  EmailAddressLogIn,
  ForgotPassword,
  Href,
  Password,
  RememberPassword,
  SignIn,
  SignInToAccount,
  ThemePrimary,
} from "@/Constant/constant";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { Button, Form, FormGroup, Input, Label } from "reactstrap";
import imageOne from "../../../public/assets/images/logo/logo-1.png";
import imageTwo from "../../../public/assets/images/logo/logo.png";
import Image from "next/image";
import { signin } from "@/app/actions/auth/signin";
import { ErrorValidation } from "@/Types/ApiResponseType";
import SweetAlert from "sweetalert2";
import { popup } from "leaflet";
import DisplayError from "@/utils/DisplayError";
import { clearState, loginUser } from "@/Redux/Reducers/UserSlice";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";

export const UserForm = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("admin@admin.com");
  const [password, setPassword] = useState("test");

  // const [isLoading, setIsLoading] = useState(false);
  // const [errorsValidation, setErrorsValidation] = useState<
  //   ErrorValidation[] | null
  // >([]);
  // const [errorMessage, setErrorMessage] = useState<string>("");

  const dispatch = useAppDispatch();
  const { isFetching, isSuccess, isError, errorMessage } = useAppSelector((state) => state.user);
  // const formSubmitHandleEski = async (event: FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   setIsLoading(true);
  //   setErrorsValidation([]);
  //   const formData = new FormData(event.currentTarget);
  //   try {
  //     const response = await signin(formData);

  //     if ("errorMessage" in response) {
  //       setErrorsValidation(response.errorsValidation);
  //       setErrorMessage(response.errorMessage);
  //     } else {
  //       Cookies.set("token", response.data.accessToken);

  //       SweetAlert.fire({
  //         icon: "success",
  //         title: "Good job!",
  //         text: "You logged in successfully!",
  //         showConfirmButton: false,
  //         didOpen: (popup) => {
  //           // window.location.reload();
  //           window.location.href = "/tour/add-tour"
  //         },
  //       });
  //       console.log(response.data.user)
  //       dispatch(setUser(response.data.user));

  //     }
  //   } catch (error) {
  //     console.log({ error });
  //   }

  //   setIsLoading(false);
  // };

  const formSubmitHandle = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    dispatch(loginUser(formData));
  };

  useEffect(() => {
    if (isSuccess) {
      SweetAlert.fire({
        icon: "success",
        title: "Good job!",
        text: "You logged in successfully!",
        showConfirmButton: false,
        didOpen: (popup) => {
          // window.location.reload();
          window.location.href = "/tours"
        },
      });
      dispatch(clearState());

    }
  }, [isError, isSuccess]);

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
            <DisplayError
              errorMessage={errorMessage}
              // errorsValidation={errorsValidation} 
              keyProp="email" />
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
              <DisplayError
                errorMessage={errorMessage}
                // errorsValidation={errorsValidation}
                keyProp="password"
              />

              <div className="show-hide" onClick={() => setShow(!show)}>
                <span className="show"> </span>
              </div>
            </div>
          </FormGroup>
          <FormGroup className="form-group mb-0">
            {/* <div className="checkbox p-0">
              <Input id="checkbox1" type="checkbox" />
              <Label className="text-muted" htmlFor="checkbox1">
                {RememberPassword}
              </Label>
            </div> */}
            <div className="text-end mt-3">
              <Button type="submit" color="primary" block disabled={isFetching}>
                {SignIn}
              </Button>
            </div>
            {/* <Link className="link" href={Href}>
              {ForgotPassword}?
            </Link> */}
          </FormGroup>
          {/* <h6 className="text-muted mt-4">{OrSignInWith}</h6> */}
          {/* <UserSocialApp /> */}
          {/* <p className="mt-4 mb-0 text-center">
            {DontHaveAccount}
            <Link className="ms-2" href={"signup"}>
              {CreateAccount}
            </Link>
          </p> */}
        </Form>
      </div>
    </div>
  );
};
