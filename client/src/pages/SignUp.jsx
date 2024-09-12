/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-escape */
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiMail } from "react-icons/hi";
import { RiLockPasswordLine } from "react-icons/ri";
import { FaUserAstronaut } from "react-icons/fa";
import OAuth from "../components/OAuth";
import { useSelector, useDispatch } from "react-redux";
import {
  signUpSuccess,
  signUpFailure,
  signUpStart,
} from "../redux/user/userSlice";
import toast from "react-hot-toast";
function SignUp() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();
  const {loading,error}=useSelector(state=>state.user)


  const [enteredPasswordIsTouched, setEnteredpasswordIsTouched] =
    useState(false);

  const [enteredConfirmPasswordIsTouched, setEnteredConfirmpasswordlIsTouched] =
    useState(false);

  const strongRegex = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
  );

  const enteredpasswordIsValid =
    formData.password.trim().length !== 0 &&
    strongRegex.test(formData.password);


  const enteredConfirmpasswordIsValid =
    formData.password.trim() === formData.confirmPassword.trim() &&
    formData.confirmPassword.trim().length !== 0;

  const passwordInputBlurHandler = (event) => {
    setEnteredpasswordIsTouched(true);
  };

  const confirmPasswordInputBlurHandler = (event) => {
    setEnteredConfirmpasswordlIsTouched(true);
  };

  const passwordInputIsInvalid =
    !enteredpasswordIsValid && enteredPasswordIsTouched;

  const confirmPasswordInputIsInvalid =
    !enteredConfirmpasswordIsValid && enteredConfirmPasswordIsTouched;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.email ||
      !formData.username ||
      !formData.password ||
      !formData.confirmPassword
    ) {
     return dispatch(signUpFailure("Please fill out all fields"));
    }
    try {
      dispatch(signUpStart());
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success === false) {
        toast.error(data.message)
        return dispatch(signUpFailure(data.message))
        ;
      }
     ;
      if (response.ok) {
        dispatch(signUpSuccess(data));
        toast.success('account successfully created')

      
      }
    } catch (error) {
      toast.error(error.message)
      return dispatch(signUpFailure(error.message));
    }
    setEnteredConfirmpasswordlIsTouched(false);
    setEnteredpasswordIsTouched(false);
    setFormData({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
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

        <div className="flex-1  w-[400px] mx-auto">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="">
              <Label value=" username" />
              <TextInput
                className=" w-200"
                type="text"
                placeholder="Username"
                id="username"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    username: e.target.value,
                  })
                }
                icon={() => (
                  <FaUserAstronaut
                    color={formData.username.length > 0 ? "limegreen" : ""}
                  />
                )}
                value={formData.username}
                required
              />
            </div>
            <div className="">
              <Label value=" email" />
              <TextInput
                value={formData.email}
                type="email"
                placeholder="Email"
                icon={() => (
                  <HiMail
                    color={
                      formData.email.includes("@") && formData.email.length > 4
                        ? "orange"
                        : ""
                    }
                  />
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
            <div className="">
              <Label value=" password" />
              <TextInput
                icon={() => (
                  <RiLockPasswordLine
                    color={passwordInputIsInvalid ? "red" : ""}
                  />
                )}
                value={formData.password}
                type="password"
                placeholder="Password"
                helperText={
                  passwordInputIsInvalid && (
                    <div className="font-medium text-red-500">
                      the password should contain at least 1 symbol, lowercase
                      and uppercase letter , a number and be bigger than 6
                      characters
                    </div>
                  )
                }
                status={
                  passwordInputIsInvalid && formData.password.length > 0
                    ? "failure"
                    : "success"
                }
               
                onBlur={passwordInputBlurHandler}
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
            <div className="">
              <Label value="confirm password" />
              <TextInput
                icon={() => (
                  <RiLockPasswordLine
                    color={confirmPasswordInputIsInvalid ?  "red" : ""}
                  />
                )}
           
                helperText={
                  confirmPasswordInputIsInvalid &&
                  formData.confirmPassword.length > 0 && (
                    <>
                    
                      <span className="font-medium">Oops!</span> passwords are
                      not matching
                    </>
                  )
                }
                onBlur={confirmPasswordInputBlurHandler}
                type="password"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    confirmPassword: e.target.value,
                  })
                }
                required
              />
            </div>
            <Button
              gradientDuoTone="pinkToOrange"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <div>
                  <Spinner size="sm" />
                  <span className="pl-3">Loading...</span>
                </div>
              ) : (
                "Sign Up"
              )}
            </Button>
           
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span> Have an account?</span>
            <Link to="/sign-in" className="text-blue-500">
              Sign In
            </Link>
          </div>

          
        </div>
      </div>
    </div>
  );
}

export default SignUp;
