import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import M from 'materialize-css';
import './CreatePost.scss'

const CreatePost = () => {

    const history = useHistory()
    const [title, setTitle] = useState("")
    const [image, setImage] = useState("")
    const [url, setUrl] = useState("")

    useEffect(() => {
        if (url) {
            fetch("/createpost", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    title,
                    pic: url
                })
            }).then(res => res.json())
                .then(data => {
                    if (data.error) {
                        M.toast({ html: "Please enter all the fields!", classes: 'rounded ,#c62828 red darken-3' });
                    }
                    else {
                        M.toast({ html: "Created post succesfully!", classes: 'rounded ,#43a047 green darken-1' });
                        history.push('/')
                    }

                }).catch(err => {
                    console.log(err)
                })
        }
    }, [url])

    const postDetails = () => {
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

    return (
        <div className="createpost">
            <div className="card input-filed">
                <h4 style={{ color: "#26a69a", fontWeight: "bold" }}>CREATE POST</h4>
                <div className="input_feild_createpost">
                    <input
                        type="text"
                        placeholder="Write a caption"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{ width: "91%", marginLeft: "5px", marginTop: "15px" }}
                    />
                </div>

                <div className="file-field input-field">
                    <div className="btn">
                        <span>Upload Image</span>
                        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text"
                            style={{ width: "93%", height: "48px", marginRight: "30px" }}
                        />
                    </div>
                </div>
                <button className="cancel_button" style={{ marginTop: "50px", marginRight: "20px" }}
                    onClick={() => {
                        history.push("/");
                    }}
                >
                    Cancel
                </button>
                <button className="button" style={{ marginTop: "50px" }}
                    onClick={() => postDetails()}
                >
                    Create
                </button>
            </div>
        </div>

    );
}


export default CreatePost;