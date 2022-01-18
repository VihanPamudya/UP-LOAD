import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import M from 'materialize-css';
import './Signup.scss'

const Signup = () => {

    const history = useHistory()
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [image, setImage] = useState("")
    const [url, setUrl] = useState(undefined)

    useEffect(() => {
        if (url) {
            uploadFeilds()
        }
    }, [url])

    const uploadPic = () => {
        const data = new FormData()
        data.append("file", image)
        data.append("upload_preset", "insta-clone")
        data.append("upload_name", "instacloud99")
        fetch("https://api.cloudinary.com/v1_1/instacloud99/image/upload", {
            method: "post",
            body: data
        })
            .then(res => res.json())
            .then(data => {
                setUrl(data.url)
            })
            .catch(err => {
                console.log(err)
            })
    }

    const uploadFeilds = () => {
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            M.toast({ html: "invalid email", classes: 'rounded ,#c62828 red darken-3' });
            return
        }
        fetch("/signup", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                password,
                email,
                pic: url
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
    const PostData = () => {
        if (image) {
            uploadPic()
        } else {
            uploadFeilds()
        }
    }

    return (
        <div className="background_signup" style={{ minHeight: "90vh" }}>
            <div className="signup_mycard">
                <div className="card signup_auth-card">
                    <h4 className="topic">UP<span style={{ color: "#fbc02d", fontWeight: "bold" }}>-LOAD</span></h4>
                    <div className="signup_input-feild">
                        <i class="material-icons prefix">account_circle</i>
                        <input
                            type="text"
                            placeholder="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={{ width: "80%", marginLeft: "45px" }}
                        />
                    </div>
                    <div className="signup_input-feild">
                        <i class="material-icons prefix">email </i>
                        <input
                            type="text"
                            placeholder="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ width: "80%", marginLeft: "45px" }}
                        />
                    </div>
                    <div className="signup_input-feild">
                        <i class="material-icons prefix">lock</i>
                        <input
                            type="password"
                            placeholder="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: "80%", marginLeft: "45px" }}
                        />
                    </div>
                    <div className="file-field input-field">
                        <div className="btn">
                            <span>Choose Image</span>
                            <input type="file" onChange={(e) => setImage(e.target.files[0])} />
                        </div>
                        <div className="file-path-wrapper">
                            <input className="file-path validate" type="text"
                                style={{ width: "93%", height: "48px", marginRight: "30px" }}
                            />
                        </div>
                    </div>

                    <button className="button" style={{ marginTop: "15px" }} onClick={() => PostData()}>
                        Signup
                    </button>
                    <h6>
                        Already have an account? Login <Link to="/login" style={{ color: "#26a69a" }} >here</Link>
                    </h6>
                </div>
            </div >
        </div>
    )
}

export default Signup;