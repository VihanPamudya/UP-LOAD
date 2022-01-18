import React, { useEffect, useState, useContext } from "react";
import { UserContext } from '../../App'
import { useParams } from 'react-router-dom'
import './UserProfile.scss'

const Profile = () => {
    const [userProfile, setProfile] = useState(null)
    const { state, dispatch } = useContext(UserContext)
    const { userid } = useParams()
    const [showFollow, setShowFollow] = useState(state ? !state.following.includes(userid) : true)
    console.log(userid)
    useEffect(() => {
        fetch(`/user/${userid}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                setProfile(result)
            })
    }, [])

    const followUser = () => {
        fetch("/follow", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                followId: userid
            })
        }).then(res => res.json())
            .then(data => {
                console.log(data)
                dispatch({ type: "UPDATE", payload: { following: data.following, followers: data.followers } })
                localStorage.setItem("user", JSON.stringify(data))
                setProfile((prevState) => {
                    return {
                        ...prevState,
                        user: {
                            ...prevState.user,
                            followers: [...prevState.user.followers, data._id]
                        }
                    }
                })
                setShowFollow(false)
            })
    }
    const unfollowUser = () => {
        fetch("/unfollow", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                unfollowId: userid
            })
        }).then(res => res.json())
            .then(data => {
                dispatch({ type: "UPDATE", payload: { following: data.following, followers: data.followers } })
                localStorage.setItem("user", JSON.stringify(data))

                setProfile((prevState) => {
                    const newFollower = prevState.user.followers.filter(item => item !== data._id)
                    return {
                        ...prevState,
                        user: {
                            ...prevState.user,
                            followers: newFollower
                        }
                    }
                })
                setShowFollow(true)
            })
    }
    return (
        <div className="profile">
            <>
                {userProfile ?
                    <div className="profile_header">
                        <div style={{
                            margin: "18px 0px",
                            borderBottom: "1px solid grey"
                        }}>
                            <div className="profile_header_container">
                                <div className="profile_header_image">
                                    <img src={userProfile.user.pic} alt="img" />
                                </div>
                                <div className="file-field input-field prfIcon" style={{ margin: "5%" }}>

                                </div>

                                <div className="profile_header_details">
                                    <div className="profile_header_details_name">
                                        <h4>{userProfile.user.name}</h4>
                                    </div>

                                    <div className="profile_header_details_total">
                                        <div className="profile_header_details_posts">
                                            <h6>{userProfile.posts.length} posts</h6>
                                        </div>
                                        <div className="profile_header_details_followers">
                                            <h6>{userProfile.user.followers.length} followers</h6>
                                        </div>
                                        <div className="profile_header_details_following">
                                            <h6>{userProfile.user.following.length} following</h6>
                                        </div>

                                    </div>
                                    {showFollow ?
                                        <button className="btn waves-effect waves-light"
                                            onClick={() => followUser()}
                                        >
                                            Follow
                                        </button>
                                        :
                                        <button className="btn waves-effect waves-light"
                                            onClick={() => unfollowUser()}
                                        >
                                            UnFollow
                                        </button>
                                    }

                                </div>
                            </div>
                        </div>

                        <div className="gallery">
                            {
                                userProfile.posts.map(item => {
                                    return (
                                        <div class="column">
                                            <img key={item._id} className="user-profile-images" src={item.photo} alt={item.title} />
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    : <h2>Loading...!</h2>}
            </>
        </div>
    )
}

export default Profile;