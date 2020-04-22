import React, { useState, useEffect, useRef } from "react";
import firebase from "../firebase";
import Nav from "./Nav";
import Vs from "./Vs";

const Home = () => {
    const about = useRef();
    const [contents, setContents] = useState([]);
    const [idx, setIdx] = useState(0);
    const [totalVote, setTotalVote] = useState(0);
    const [totalUser, setTotalUser] = useState(0);
    const [contentsCount, setContentsCount] = useState(0);
    const db = firebase.firestore();
    const infoDoc = db.collection("info").doc("infoDoc");
    const contentsDoc = db.collection("contents").orderBy("view", "desc").limit(10);

    useEffect(() => {
        contentsDoc
            .get()
            .then((snapShot) => {
                setContentsCount(snapShot.size);
                snapShot.forEach((doc) => {
                    //console.log(doc.data());
                    var tmp = (
                        <div key={doc.id} className="slide">
                            <Vs key={doc.id} homeMode={true} docref={doc.id} />
                        </div>
                    );
                    setContents((contents) => contents.concat(tmp));
                });
            })
            .catch((err) => {
                console.log(err);
            });

        infoDoc.get().then((snapShot) => {
            console.log(snapShot.data().totalVote);
            setTotalVote(snapShot.data().totalVote);
            setTotalUser(snapShot.data().totalUser);
        });
        /*
        if (window.scrollY > about.current.offsetTop) {
            console.log(1);
        }
        */
    }, []);

    const handleIdx = (e) => {
        //console.log(e.target.value);
        switch (e) {
            case "left":
                if (idx === 0) {
                    setIdx(contents.length - 1);
                } else {
                    setIdx(idx - 1);
                }
                break;

            case "right":
                if (idx === contents.length - 1) {
                    setIdx(0);
                } else {
                    setIdx(idx + 1);
                }

                break;
        }
    };

    return (
        <div className="home">
            <Nav />
            <div className="slide-container">
                <a href="#" class="arrow left" onClick={() => handleIdx("left")}></a>
                {contents[idx]}
                <a href="#" class="arrow right" onClick={() => handleIdx("right")}></a>
            </div>

            <div ref={about} className="about col-12">
                <div
                    className="d-flex col-12 col-lg-6 p-0 align-items-center justify-content-center"
                    style={{ minHeight: "300px" }}
                >
                    <p className="col-12 col-8-lg text-center">
                        <h3>당신의 밸런스 게임에 투표하세요</h3>
                        <hr />
                        찍먹vs부먹 , 양념치킨vs후라이드치킨 등 다양한 밸런스 게임
                        <br />
                        <br />
                        <a href="/board">모든 게시물 확인</a>
                    </p>
                </div>

                <div className="about-img right col-12 col-lg-6 p-0">
                    <img style={{ width: "85%", height: "85%" }} src="./vsclickerimg1_1.png"></img>
                </div>
            </div>

            <div ref={about} className="about col-12">
                <div className="about-img left col-12 col-lg-6 p-0">
                    <img style={{ width: "100%", height: "100%" }} src="./vsclicker2.png"></img>
                </div>
                <div
                    className="d-flex col-12 col-lg-6 p-0 align-items-center justify-content-center"
                    style={{ minHeight: "300px" }}
                >
                    <p className="col-12 col-8-lg text-center">
                        <h3>직접 제작하는 나만의 투표</h3>
                        <hr />
                        <a href="/setting">투표 작성하러 가기</a>
                    </p>
                </div>
            </div>

            <div
                className="d-flex col-12 bg-dark justify-content-center text-white"
                style={{ height: "250px" }}
            >
                <div className="mx-4 my-auto">
                    <p className="text-center">
                        <h6>투표수</h6>
                        <br />
                        <h2>{totalVote}</h2>
                    </p>
                </div>
                <div className="mx-4 my-auto">
                    <p className="text-center">
                        <h6>게시물</h6>
                        <br />
                        <h2>{contentsCount}</h2>
                    </p>
                </div>
                <div className="mx-4 my-auto">
                    <p className="text-center">
                        <h6>이용자</h6>
                        <br />
                        <h2>{totalUser}</h2>
                    </p>
                </div>
            </div>
            <div
                className="align-self-end mt-auto col-12 mt-auto py-4 bg-dark text-center text-white"
                style={{ borderTop: "1px solid gray" }}
            >
                presentlee914@gmail.com
            </div>
        </div>
    );
};

export default Home;
