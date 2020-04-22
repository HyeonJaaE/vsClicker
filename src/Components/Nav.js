import React, { useState, useEffect } from "react";
import firebase from "../firebase";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const arrowIcon = (
    <svg
        className="bi bi-arrow-bar-right"
        width="1.5em"
        height="1.5em"
        viewBox="0 0 16 16"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            fillRule="evenodd"
            d="M10.146 4.646a.5.5 0 01.708 0l3 3a.5.5 0 010 .708l-3 3a.5.5 0 01-.708-.708L12.793 8l-2.647-2.646a.5.5 0 010-.708z"
            clipRule="evenodd"
        />
        <path
            fillRule="evenodd"
            d="M6 8a.5.5 0 01.5-.5H13a.5.5 0 010 1H6.5A.5.5 0 016 8zm-2.5 6a.5.5 0 01-.5-.5v-11a.5.5 0 011 0v11a.5.5 0 01-.5.5z"
            clipRule="evenodd"
        />
    </svg>
);

const listIcon = (
    <svg
        className="bi bi-list"
        width="1.5em"
        height="1.5em"
        viewBox="0 0 16 16"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            fillRule="evenodd"
            d="M2.5 11.5A.5.5 0 013 11h10a.5.5 0 010 1H3a.5.5 0 01-.5-.5zm0-4A.5.5 0 013 7h10a.5.5 0 010 1H3a.5.5 0 01-.5-.5zm0-4A.5.5 0 013 3h10a.5.5 0 010 1H3a.5.5 0 01-.5-.5z"
            clipRule="evenodd"
        />
    </svg>
);

const logo = "</>";

const Nav = () => {
    const [side, setSide] = useState(false);
    const auth = useSelector((state) => state.auth);

    const [css, setCss] = useState({});
    /*
    useEffect(() => {
        if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
            setCss({
                height: "100px",
            });
        } else {
            setCss({
                height: "300px",
            });
        }
    });
    */

    const logout = (e) => {
        e.preventDefault();
        firebase
            .auth()
            .signOut()
            .then(window.location.reload())
            .catch(function (error) {
                // An error happened.
            });
    };

    return (
        <div className="navigation" style={css}>
            <div className={`side-nav ${side ? "side-nav-active" : ""}`}>
                <div className="side-nav-header">
                    <button onClick={() => setSide(side ? false : true)}>{arrowIcon}</button>
                </div>
                <ul>
                    <li>
                        <Link className="nav-anchor" to="/board">
                            모든 글
                        </Link>
                    </li>
                    <li>
                        <Link className="nav-anchor" to="/profile">
                            내 정보
                        </Link>
                    </li>

                    <li>
                        <Link className="nav-anchor" to="/setting">
                            글 작성
                        </Link>
                    </li>
                    {auth.isAuthenticated ? (
                        <li>
                            <a className="nav-anchor" onClick={logout} href="/">
                                로그아웃
                            </a>
                        </li>
                    ) : (
                        <li>
                            <a className="nav-anchor" href="/login">
                                로그인
                            </a>
                        </li>
                    )}
                </ul>
            </div>

            <nav className="nav-div">
                <Link id="logo" to="/">
                    {logo}
                </Link>
                <button className="nav-btn" onClick={() => setSide(side ? false : true)}>
                    {listIcon}
                </button>

                <ul className="nav-ul">
                    <li className="nav-li px-2">
                        <Link className="nav-anchor" to="/board">
                            모든 글
                        </Link>
                    </li>
                    <li className="nav-li px-2">
                        <Link className="nav-anchor" to="/setting">
                            글 작성
                        </Link>
                    </li>
                    <li className="nav-li px-2">
                        <Link className="nav-anchor" to="/profile">
                            내 정보
                        </Link>
                    </li>
                    {auth.isAuthenticated ? (
                        <li className="nav-li px-2">
                            <a className="nav-anchor" onClick={logout} href="/">
                                로그아웃
                            </a>
                        </li>
                    ) : (
                        <li className="nav-li px-2">
                            <a className="nav-anchor" href="/login">
                                로그인
                            </a>
                        </li>
                    )}
                </ul>
            </nav>
        </div>
    );
};

export default Nav;
