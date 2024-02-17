/** @format */

import React, { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import "./Register.css";
import axios from "axios";
import InputComp from "../../../Components/InputComp/InputComp";
import AuthButton from "../../../Components/ButtonComp/AuthButton";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [disable, setDisable] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!name.trim() || !username.trim() || !email.trim() || !password.trim()) {
      setDisable(true);
    } else {
      setDisable(false);
    }
  }, [name, username, email, password]);

  const handleRegister = () => {
    setDisable(true);
    setLoading(true);
    let data = JSON.stringify({
      name: name,
      email: email,
      username: username,
      password: password,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_BASE_URL}api/user/register`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("token", response.data.token);
        setName("");
        setUsername("");
        setEmail("");
        setPassword("");
        setLoading(false);
        navigate("/");
      })
      .catch((error) => {
        setErrorMsg(error.response.data.error.message);
        setName("");
        setUsername("");
        setEmail("");
        setPassword("");
        setLoading(false);
      });
  };
  return (
    <Box className='register_container'>
      <Box className='register_box'>
        <Box className='register_header'>
          <p className='app_name'>Vootel</p>
          <Box className='register_header_title'>Let's get started</Box>
          <Box className='register_sub_header'>
            By Sign Up you can join our messaging app to start chatting with you
            close ones
          </Box>
        </Box>

        <Box className='form_section'>
          <Box className='error_messaage'>{errorMsg}</Box>
          {/* Name */}
          <InputComp
            type='text'
            placeholder='Enter your name'
            className='auth_form_input'
            value={name}
            handleChange={(e) => setName(e.target.value)}
          />

          {/* Username */}
          <InputComp
            type='text'
            placeholder='Enter your username'
            className='auth_form_input'
            value={username}
            handleChange={(e) => setUsername(e.target.value)}
          />

          {/* Email */}
          <InputComp
            type='email'
            placeholder='Enter your email'
            className='auth_form_input'
            value={email}
            handleChange={(e) => setEmail(e.target.value)}
          />

          {/* Password */}
          <InputComp
            type='password'
            placeholder='Enter your password'
            className='auth_form_input'
            value={password}
            handleChange={(e) => setPassword(e.target.value)}
          />
        </Box>

        <Box className='auth_button_section'>
          <AuthButton
            loading={loading}
            disable={disable}
            text={"Register"}
            className={"auth_btn_button"}
            disableClassName={"disable_auth_btn_button"}
            clickHandler={handleRegister}
          />
          <Box className='login_link'>
            Already have an account?{" "}
            <Link to='/login' className='link_tag'>
              Login
            </Link>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Register;
