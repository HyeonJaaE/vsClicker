import React from "react";
import Nav from "./Nav";

const Home = () => {
    return (
        <div>
            <Nav />
            <div className="container about">
                <div className="title">
                    <h3>ABOUT ME</h3>
                </div>

                <p className="">Front-End 개발자 이현재입니다.</p>
                <a href="/resume">RESUME</a>
            </div>

            <div className="container">
                <div className="portfolio">
                    <div className="title" style={{ textAlign: "right" }}>
                        <h3>PORTFOLIO</h3>
                    </div>
                    <div className="portfolio-img">
                        <div>
                            <img src="./cat3.jpg"></img>
                            <p>설명</p>
                        </div>
                        <div>
                            <img src="./cat3.jpg"></img>
                        </div>
                        <div>
                            <img src="./cat3.jpg"></img>
                        </div>
                    </div>
                </div>
            </div>

            <div className="jumbotron d-flex" id="p1" style={{ height: "20rem" }}>
                <div className="col-3 pt-4">
                    <p>포트폴리오 1</p>
                </div>
                <div className="col-3 pt-4">
                    <p>Link</p>
                    <hr className="bg-secondary" />
                </div>
            </div>
            <div className="jumbotron d-flex" id="p2" style={{ height: "20rem" }}>
                <div className="col-3 pt-4">
                    <p>포트폴리오 1</p>
                </div>
                <div className="col-3 pt-4">
                    <p>Link</p>
                    <hr className="bg-secondary" />
                </div>
            </div>
        </div>
    );
};

export default Home;
