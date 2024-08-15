/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-escape */
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiMail } from "react-icons/hi";
import { RiLockPasswordLine } from "react-icons/ri";
import { useSelector, useDispatch } from "react-redux";
import {
  signInFailure,
  signInStart,
  signInsuccess,
} from "../redux/user/userSlice";
function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });


  const dispatch = useDispatch();
  const {loading,error:errorMessage}=useSelector(state=>state.user)

  const [enteredPasswordIsTouched, setEnteredpasswordIsTouched] =
    useState(false);
  const navigate = useNavigate();

  const passwordInputBlurHandler = (event) => {
    setEnteredpasswordIsTouched(true);
  };

  const strongRegex = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
  );

  const enteredpasswordIsValid =
    formData.password.trim().length !== 0 &&
    strongRegex.test(formData.password);

  const passwordInputIsInvalid =
    !enteredpasswordIsValid && enteredPasswordIsTouched;

  const enteredEmailIsValid =
    formData.email.trim().length !== 0 && /\S+@\S+\.\S+/.test(formData.email);

  const handleSubmit = async (e) => {
    e.preventDefault();
 
    try {
      dispatch(signInStart());
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
      }

      if (response.ok)  {
        dispatch(signInsuccess(data))
        navigate("/");
      }
    } catch (error) {
      dispatch(signInFailure(error.message));

    }
    setEnteredpasswordIsTouched(false);
    setFormData({
      email: "",
      password: "",
    });
  };

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col   gap-5">
        <div className="flex mx-auto ">
          <Link to="/" className=" text-4xl   font-bold dark:text-white">
            <span className=" items-center px-2 py-1 bg-gradient-to-r from-purple-500 via-red-500 to-orange-500 rounded-lg text-white">
              BLOGGY
            </span>
          </Link>
        </div>

        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="">
              <Label value=" email" />

              <TextInput
                status={!enteredEmailIsValid ? "failure" : "success"}
                color={!enteredEmailIsValid ? "failure" : "success"}
                value={formData.email}
                type="email"
                placeholder="Email"
                icon={() => (
                  <HiMail color={!enteredEmailIsValid ? "red" : "black"} />
                )}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value,
                  })
                }
                required
              />
            </div>
            <div>
              <Label value=" password" />
              <TextInput
                icon={() => (
                  <RiLockPasswordLine
                    color={!enteredpasswordIsValid ? "red" : "black"}
                  />
                )}
                type="password"
                placeholder="Password"
                onBlur={passwordInputBlurHandler}
                status={!enteredpasswordIsValid ? "failure" : ""}
                color={!enteredpasswordIsValid ? "failure" : ""}
                value={formData.password}
                id="password"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    password: e.target.value,
                  })
                }
                required
              />
            </div>

            <Button
              gradientDuoTone="pinkToOrange"
              type="submit"
              disabled={loading && !errorMessage}
            >
              {loading && !errorMessage ? (
                <div>
                  <Spinner size="sm" />
                  <span className="pl-3">Loading...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span> Already have an account?</span>
            <Link to="/sign-Up" className="text-blue-500">
              Sign Up
            </Link>
          </div>

          {errorMessage && (
            <Alert className="mt-5" color="failure">
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}

export default SignIn;
