import React, { useContext, useRef, useEffect, useState } from "react";
import { UserContext } from "../../App"
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import "./Navbar.scss"

const Navbar = () => {

    const searchModal = useRef(null)
    const { state, dispatch } = useContext(UserContext)
    const history = useHistory()
    useEffect(() => {
        M.Modal.init(searchModal.current)
    }, [])
    const renderList = () => {
        if (state) {
            return [

                <li key="1"><Link to="/search/users" className="navbar__link__search">
                    <FontAwesomeIcon className="navbar__search__icon"
                        icon={faSearch}
                    />
                </Link></li>,
                <li key="2"><Link to="/profile" className="links_a">Profile</Link></li>,
                <li key="3"><Link to="/createpost" className="links_a">Create Post</Link></li>,
                <li key="4"><Link to="/myfollowingpost" className="links_a">Following Post</Link></li>,
                <li key="5">
                    <button className="logout-button"
                        onClick={() => {
                            localStorage.clear()
                            dispatch({ type: "CLEAR" })
                            history.push('/login')
                        }
                        }
                    >
                        Logout
                    </button>
                </li>
            ]
        } else {
            return [
                <li key="6"><Link to="/login" className="links_a">Login</Link></li>,
                <li key="7"><Link to="/signup" className="links_a">Signup</Link></li>
            ]
        }
    }

    return (
        <div>
            <nav className="nav_extended">
                <div className="nav-wrapper white">
                    <img src="https://img.icons8.com/color/48/000000/logstash.png" className="nav_log" />
                    <Link to={state ? "/" : "/login"} className="brand-logo left" id="links_a" style={{ color: "#26a69a", fontWeight: "bold" }}>UP<span style={{ color: "#fbc02d", fontWeight: "bold" }}>-LOAD</span></Link>
                    <ul id="nav-mobile" className="right">
                        {renderList()}
                    </ul>
                </div>
            </nav>
        </div>
    );
}

export default Navbar;
