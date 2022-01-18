import React, { useState, useEffect, useContext } from "react";
import { UserContext } from '../../App'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faHeartEmpty } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faHeartFill } from "@fortawesome/free-solid-svg-icons";
import './SubUserPost.scss'


const Home = () => {
    const [data, setData] = useState([])
    const { state } = useContext(UserContext)
    useEffect(() => {
        fetch('/subposts', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                setData(result.posts)
            })
    }, [])

    const likePost = (id) => {
        fetch("/like", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then(result => {
                const newData = data.map(item => {
                    if (item._id === result._id) {
                        return result
                    } else {
                        return item
                    }
                })
                setData(newData)
            }).catch(err => {
                console.log(err);
            })
    }
    const unlikePost = (id) => {
        fetch("/unlike", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then(result => {
                const newData = data.map(item => {
                    if (item._id === result._id) {
                        return result
                    } else {
                        return item
                    }
                })
                setData(newData)
            }).catch(err => {
                console.log(err);
            })
    }

    const makeComment = (text, postId) => {
        fetch("/comment", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId,
                text
            })
        }).then(res => res.json())
            .then(result => {
                console.log(result)
                const newData = data.map(item => {
                    if (item._id === result._id) {
                        return result
                    } else {
                        return item
                    }
                })
                setData(newData)
            }).catch(err => {
                console.log(err);
            })
    }

    const deletePost = (postid) => {
        fetch(`/deletepost/${postid}`, {
            method: "delete",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                console.log(result)
                const newData = data.filter(item => {
                    return item._id !== result._id
                })
                setData(newData)
            })
    }

    return (
        <div className="home">
            {
                data.map(item => {
                    return (
                        <div className="cards" key={item._id}>
                            <div className="card_header">
                                <div className="card_user_image">
                                    <Link
                                        to={
                                            state._id === item.postedBy._id
                                                ? "/profile"
                                                : `/profile/${item.postedBy._id}`
                                        }
                                    >
                                        <img src={item.postedBy.pic} alt="" />
                                    </Link>
                                </div>
                                <div className="card_user_details">
                                    <div className="card_user_name">
                                        <h6 className="card__user__name1"><Link to={item.postedBy._id !== state._id ? "/profile/" + item.postedBy._id : "/profile"} style={{ color: "black", fontWeight: "600" }}>{item.postedBy.name}</Link>
                                            {item.postedBy._id === state._id
                                                && <i className="material-icons" style={{
                                                    float: "right",
                                                    position: "relative",
                                                    bottom: "5px"

                                                }}
                                                    onClick={() => deletePost(item._id)}
                                                >delete</i>
                                            }
                                        </h6>
                                    </div>
                                </div>
                            </div>

                            <div className="card-image">
                                <img src={item.photo} alt="img"/>
                            </div>

                            <div className="card-content">
                                <div className="card__heart">
                                    <div className="card__heart__icon">
                                        {item.likes.includes(state._id)
                                            ? (
                                                <FontAwesomeIcon
                                                    icon={faHeartFill}
                                                    className="icon__heartFill"
                                                    onClick={() => { unlikePost(item._id) }}
                                                    style={{ fontSize: "20px", color: "red" }}
                                                />
                                            ) : (
                                                <FontAwesomeIcon
                                                    icon={faHeartEmpty}
                                                    className="icon__heartEmpty"
                                                    onClick={() => { likePost(item._id) }}
                                                    style={{ fontSize: "20px", color: "black" }}
                                                />
                                            )}
                                    </div>
                                    <div className="card__heart__text">
                                        <h6 style={{
                                            fontSize: "1rem",
                                            fontWeight: "600",
                                            lineHeight: "0.1"

                                        }}>{item.likes.length} likes</h6>
                                    </div>
                                </div>
                                <h6>{item.title}</h6>
                                {
                                    item.comments.map(record => {
                                        return (
                                            <h6 key={record._id}><span style={{ fontWeight: "600" }}>{record.postedBy.name}</span> {record.text}</h6>
                                        )
                                    })
                                }
                                <form onSubmit={(e) => {
                                    e.preventDefault()
                                    makeComment(e.target[0].value, item._id)
                                }}>
                                    <div className="input-feild-home">
                                        <input type="text" placeholder="add comment" />
                                    </div>
                                </form>

                            </div>
                        </div>
                    )
                })
            }


        </div>
    )
}

export default Home;