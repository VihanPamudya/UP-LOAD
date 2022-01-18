import React, { useState, useContext } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import M from 'materialize-css';
import "./Newpassword.scss";

const Login = () => {
    const history = useHistory()
    const [password, setPassword] = useState("")
    const { token } = useParams()
    console.log(token)
    const PostLogin = () => {
        fetch("/new-password", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                password,
                token
            })
        }).then(res => res.json())
            .then(data => {
                console.log(data)
                if (data.error) {
                    M.toast({ html: data.error, classes: 'rounded ,#c62828 red darken-3' });
                }
                else {
                    M.toast({ html: data.message, classes: 'rounded ,#43a047 green darken-1' });
                    history.push('/login')
                }

            }).catch(err => {
                console.log(err)
            })
    }
    return (
        <div className="newPassword">
            <div className="card input-filed-newpassword">
                <Link to="/login" style={{ outline: "none" }}>
                    <h1 className="topic">UP<span style={{ color: "#fbc02d", fontWeight: "bold" }}>-LOAD</span></h1>
                </Link>
                <div className="input_feild_newPassword">
                    <input
                        type="password"
                        placeholder="Enter new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button className="savePasswordButton"
                    onClick={() => PostLogin()}
                >
                    Save Password
                </button>
            </div>
        </div>
    )
}

export default Login;