import React, { useEffect, useState, useContext } from "react";
import { UserContext } from '../../App'
import M from 'materialize-css';
import './Profile.scss'

const Profile = () => {
    const [mypics, setPics] = useState([])
    const { state, dispatch } = useContext(UserContext)
    const [image, setImage] = useState("")

    useEffect(() => {
        fetch('/myposts', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                setPics(result.mypost)
            })
    }, [])

    useEffect(() => {
        if (image) {
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

                    fetch('/updatepic', {
                        method: "put",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + localStorage.getItem("jwt")
                        },
                        body: JSON.stringify({
                            pic: data.url
                        })
                    }).then(res => res.json())
                        .then(result => {
                            console.log(result)
                            localStorage.setItem("user", JSON.stringify({ ...state, pic: result.pic }))
                            dispatch({ type: "UPDATEPIC", payload: result.pic })

                        })

                })
                .catch(err => {
                    console.log(err)
                })
        }
    }, [image])
    const updatePhoto = (file) => {
        setImage(file)
    }
    return (
        <div className="profile">
            <div className="profile_header">
                <div style={{
                    margin: "18px 0px",
                    borderBottom: "1px solid grey"
                }}>
                    <div className="profile_header_container">
                        <div className="profile_header_image">
                            <img
                                src={state ? state.pic : ""}
                            />
                        </div>
                        <div className="file-field input-field prfIcon" style={{ margin: "10px" }}>
                            <div className="btn-floating cyan darken-1" style={{
                                position: "relative",
                                left: "-58px",
                                top: "60px"
                            }}>
                                <i class="material-icons" style={{
                                    fontSize: "20px",
                                    width: "inherit",
                                    display: "inline-block",
                                    textAlign: "center",
                                    color: "white",
                                    fontSize: "1.7rem",
                                    lineHeight: "40px"
                                }}>add</i>
                                <input type="file" onChange={(e) => updatePhoto(e.target.files[0])} />
                            </div>
                        </div>
                        <div className="profile_header_details">
                            <div className="profile_header_details_name">
                                <h4>{state ? state.name : "Loading"}</h4>
                            </div>
                            <div className="profile_header_details_email">
                                <h5>{state ? state.email : "Loading"}</h5>
                            </div>
                            <div className="profile_header_details_total">
                                <div className="profile_header_details_posts">
                                    <h6>{mypics.length} posts</h6>
                                </div>
                                <div className="profile_header_details_followers">
                                    <h6>{state ? state.followers.length : "0"} followers</h6>
                                </div>
                                <div className="profile_header_details_following">
                                    <h6>{state ? state.following.length : "0"} following</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="gallery">
                    {
                        mypics.map(item => {
                            return (
                                <div class="column">
                                    <img key={item._id} className="profile-images" src={item.photo} alt={item.title} />
                                </div>

                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default Profile;