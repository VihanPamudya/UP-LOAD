import React, { useState, useEffect, useContext } from "react";
import "./Search.scss";
import { UserContext } from "../../App"
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

function SearchUser() {
    const [searchUserData, setSearchUserData] = useState();
    const [search, setSearch] = useState([]);
    const { state, dispatch } = useContext(UserContext);

    const GetAllUsers = () => {
        fetch("/allusers", {
            method: "get",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
        })
            .then((res) => res.json())
            .then((result) => {
                console.log(result);
                setSearchUserData(result);
            })
            .catch((error) => console.log(error));
    };

    useEffect(() => {
        GetAllUsers();
    }, []);
    return (
        <div className="search">
            <div className="searchUser">
                <div className="searchUser_searchbar">
                    <input
                        type="text"
                        placeholder="Search Users..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                        }}
                    />
                    <i class="material-icons prefix">search</i>
                </div>
                {searchUserData ? (
                    <div className="searchUser_list">
                        {searchUserData
                            .filter((item) => {
                                if (search == "") {
                                    return null;
                                } else if (
                                    item.name
                                        .toLocaleLowerCase()
                                        .includes(search.toLocaleLowerCase())
                                ) {
                                    return item;
                                }
                            })
                            .map((user) => {
                                return (
                                    <Link
                                        style={{ textDecoration: "none" }}
                                        to={
                                            state._id == user._id ? "/profile" : `/profile/${user._id}`
                                        }
                                    >
                                        <div className="searchUser_item">
                                            <div className="searchUser_item_image">
                                                <img src={user.pic} alt="" />
                                            </div>
                                            <div className="searchUser_item_name">
                                                <p>{`${user.name}`}</p>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                    </div>
                ) : (
                    <h1>Loading....</h1>
                )}
            </div>
        </div>
    );
}

export default SearchUser;