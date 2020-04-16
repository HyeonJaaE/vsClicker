import React, { useState, useEffect } from "react";
import firebase from "../firebase";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const arrowIcon = (
    <svg
        class="bi bi-arrow-bar-right"
        width="1.5em"
        height="1.5em"
        viewBox="0 0 16 16"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            fill-rule="evenodd"
            d="M10.146 4.646a.5.5 0 01.708 0l3 3a.5.5 0 010 .708l-3 3a.5.5 0 01-.708-.708L12.793 8l-2.647-2.646a.5.5 0 010-.708z"
            clip-rule="evenodd"
        />
        <path
            fill-rule="evenodd"
            d="M6 8a.5.5 0 01.5-.5H13a.5.5 0 010 1H6.5A.5.5 0 016 8zm-2.5 6a.5.5 0 01-.5-.5v-11a.5.5 0 011 0v11a.5.5 0 01-.5.5z"
            clip-rule="evenodd"
        />
    </svg>
);

const listIcon = (
    <svg
        class="bi bi-list"
        width="1.5em"
        height="1.5em"
        viewBox="0 0 16 16"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            fill-rule="evenodd"
            d="M2.5 11.5A.5.5 0 013 11h10a.5.5 0 010 1H3a.5.5 0 01-.5-.5zm0-4A.5.5 0 013 7h10a.5.5 0 010 1H3a.5.5 0 01-.5-.5zm0-4A.5.5 0 013 3h10a.5.5 0 010 1H3a.5.5 0 01-.5-.5z"
            clip-rule="evenodd"
        />
    </svg>
);

const logo = "</>";

const Nav = () => {
    const [side, setSide] = useState(false);
    const auth = useSelector((state) => state.auth);

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
        <div className="navigation">
            <div className={`side-nav ${side ? "side-nav-active" : ""}`}>
                <div className="side-nav-header">
                    <button onClick={() => setSide(side ? false : true)}>{arrowIcon}</button>
                </div>
                <ul>
                    <li>
                        <Link className="nav-anchor" to="/search">
                            PORTFOLIO
                        </Link>
                    </li>
                    <li>
                        <Link className="nav-anchor" to="/best">
                            RESUME
                        </Link>
                    </li>

                    <li>
                        <Link className="nav-anchor" to="/search">
                            CONTACT
                        </Link>
                    </li>
                    {auth.isAuthenticated ? (
                        <li className="nav-li">
                            <a className="nav-anchor" onClick={logout} href="/">
                                LOGOUT
                            </a>
                        </li>
                    ) : (
                        <li className="nav-li">
                            <a className="nav-anchor" href="/login">
                                LOGIN
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
                    <li className="nav-li">
                        <Link className="nav-anchor" to="/search">
                            PORTFOLIO
                        </Link>
                    </li>
                    <li className="nav-li">
                        <Link className="nav-anchor" to="/best">
                            RESUME
                        </Link>
                    </li>

                    <li className="nav-li">
                        <Link className="nav-anchor" to="/search">
                            CONTACT
                        </Link>
                    </li>
                    {auth.isAuthenticated ? (
                        <li className="nav-li">
                            <a className="nav-anchor" onClick={logout} href="/">
                                LOGOUT
                            </a>
                        </li>
                    ) : (
                        <li className="nav-li">
                            <a className="nav-anchor" href="/login">
                                LOGIN
                            </a>
                        </li>
                    )}
                </ul>
            </nav>

            <div className="d-flex col-12 col-lg-10 mt-4 text-right">
                <div className="d-flex flex-column col-2">
                    <div
                        className="mb-4 mr-3"
                        style={{ borderRight: "1.2px solid white", minHeight: "20rem" }}
                    ></div>
                    <a className="mb-1" to="/search">
                        <img src="./instagram-icon.png" style={{ height: "35px" }}></img>
                    </a>
                    <a className="" href="https://github.com/hyeonjaae">
                        <img src="./github-icon.png" style={{ height: "35px" }}></img>
                    </a>
                </div>

                <div className="d-flex col-10 justify-content-end mt-5">
                    <div className="text-white">
                        <h2 className="typo">이현재</h2>
                        <h2 className="">LEE HYEONJAE</h2>
                        <h2 className="">FRONT END DEVELOPER</h2>
                        <h6>
                            <img src="./email-icon.png" style={{ height: "20px" }}></img>
                            &nbsp;presentlee914@gmail.com
                        </h6>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Nav;
