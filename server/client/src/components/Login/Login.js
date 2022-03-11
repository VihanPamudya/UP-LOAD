import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../../App";
import M from "materialize-css";
import "./Login.scss";

const Login = () => {
  const { dispatch } = useContext(UserContext);
  const history = useHistory();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const PostLogin = () => {
    if (
      !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      M.toast({
        html: "Please enter all the fields!",
        classes: "rounded ,#c62828 red darken-3",
      });
      return;
    }
    fetch("/login", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password,
        email,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.error) {
          M.toast({
            html: data.error,
            classes: "rounded ,#c62828 red darken-3",
          });
        } else {
          localStorage.setItem("jwt", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          dispatch({ type: "USER", payload: data.user });
          M.toast({
            html: "User signin succesfully!",
            classes: "rounded ,#43a047 green darken-1",
          });
          history.push("/");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="container" style={{backgroundColor:"lightblue"}}>
      <div className="login_mycard">
        <div className="card login_auth-card">
          <h4 className="topic">
            UP
            <span style={{ color: "#fbc02d", fontWeight: "bold" }}>-LOAD</span>
          </h4>
          <div className="login_input_feild_email">
            <i class="material-icons prefix">email </i>
            <input
              type="text"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: "80%", marginLeft: "45px" }}
            />
          </div>
          <div className="login_input_feild_password">
            <i class="material-icons prefix">lock</i>
            <input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: "80%", marginLeft: "45px" }}
            />
          </div>
          <button className="button" onClick={() => PostLogin()}>
            Login
          </button>
          <h6 style={{ marginTop: "20px" }}>
            <Link to="/reset" className="links_a">
              Forgot Your Password?
            </Link>
          </h6>
          <h6>
            Still don't have an account?{" "}
            <Link to="/signup" style={{ color: "#26a69a" }}>
              here
            </Link>
          </h6>
        </div>
      </div>
    </div>
  );
};

export default Login;
