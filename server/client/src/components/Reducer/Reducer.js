import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import M from 'materialize-css';
import "./Reducer.scss";

const Reset = () => {
    const history = useHistory()
    const [email, setEmail] = useState("")

    const PostLogin = () => {
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            M.toast({ html: "invalid email", classes: 'rounded ,#c62828 red darken-3' });
            return
        }
        fetch("/reset-password", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email
            })
        }).then(res => res.json())
            .then(data => {
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

        <div className="resetPassword">
            <div className="card input-filed-reducer">
                <Link to="/login" style={{ outline: "none" }}>
                    <h1 className="topic">UP<span style={{ color: "#fbc02d", fontWeight: "bold" }}>-LOAD</span></h1>
                </Link>
                <div className="input_feild_resetPassword">
                    <input
                        type="email"
                        placeholder="Enter Your Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ width: "350px" }}
                    />
                </div>

                <button className="resetButton"
                    onClick={() => PostLogin()}
                >
                    Reset Password
                </button>
            </div>
        </div>
    )
}

export default Reset;