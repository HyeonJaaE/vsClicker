import React, { useState, useEffect, useRef } from "react";
import firebase from "../firebase";
import Nav from "./Nav";
import Vs from "./Vs";

const Home = () => {
    const about = useRef();
    const [contents, setContents] = useState([]);
    const [idx, setIdx] = useState(0);

    const db = firebase.firestore();
    const contentsDoc = db.collection("contents").orderBy("view", "desc").limit(10);

    useEffect(() => {
        contentsDoc
            .get()
            .then((snapShot) => {
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
        <div>
            <Nav />
            <div className="slide-container">
                <a href="#" class="arrow left" onClick={() => handleIdx("left")}></a>
                {contents[idx]}
                <a href="#" class="arrow right" onClick={() => handleIdx("right")}></a>
            </div>
            <div ref={about} className="about col-12">
                <div className="col-12 col-lg-6 p-0">
                    <h3>ABOUT ME</h3>
                    {window.scrollY}
                </div>

                <div className="about-img col-12 col-lg-6 p-0">
                    <img src="./logo512.png"></img>
                </div>
            </div>
            <div style={{ height: "1500px" }}></div>
            <div className="align-self-end mt-auto col-12 mt-auto py-4 bg-dark text-center text-white-50">
                presentlee914@gmail.com
            </div>
        </div>
    );
};

export default Home;
