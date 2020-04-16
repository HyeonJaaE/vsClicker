import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import Nav from "./Nav";
import Card from "./Card";
import Menu from "./Menu";
import firebase from "../firebase";

const Board = () => {
    const auth = useSelector((state) => state.auth);

    const [data, setData] = useState({
        card: [],
        idx: null,
        type: "all",
        order: "view",
        getMy: false,
        limit: 10,
        search: false,
    });

    const handleType = (e) => {
        setData({ ...data, type: e, idx: null, card: [] }, () => {
            var ref = getRef(data.type, data.order);
            getContents(ref.limit(data.limit));
        });
    };

    const handleOrder = (e) => {
        setData(
            {
                ...data,
                order: e,
                idx: null,
                card: [],
            },
            () => {
                var ref = getRef(data.type, data.order);
                getContents(ref.limit(data.limit));
            }
        );
    };

    const handleGetMyContents = (e) => {
        if (auth.isAuthenticated) {
            setData(
                {
                    ...data,
                    getMy: e,
                    idx: null,
                    card: [],
                },
                () => {
                    var ref = getRef(data.type, data.order);
                    getContents(ref.limit(data.limit));
                }
            );
        } else {
            window.alert("로그인 후 사용 가능");
        }
    };

    const getRef = (t, o) => {
        var db = firebase.firestore();
        var tmp;
        switch (t) {
            case "all":
                tmp = db.collection("contents");
                break;
            case "img":
                tmp = db.collection("contents").where("type", "==", "img");
                break;
            case "txt":
                tmp = db.collection("contents").where("type", "==", "txt");
                break;
            default:
                tmp = db.collection("contents");
        }

        switch (o) {
            case "view":
                return tmp.orderBy("view", "desc");

            case "date":
                return tmp.orderBy("date", "desc");
            default:
                return tmp.orderBy("date", "desc");
        }
    };

    const getContents = (e) => {
        var ref = e;
        if (data.getMy) {
            ref = e.where("author.id", "==", auth.user.email);
        }

        ref.get()
            .then((snapShot) => {
                snapShot.forEach((doc) => {
                    var tmp = (
                        <Card
                            id={doc.id}
                            key={doc.id}
                            title={doc.data().title}
                            url={doc.data().url ? doc.data().url : null}
                            sub={doc.data().subtitle}
                            date={doc.data().date}
                            view={doc.data().view}
                        />
                    );
                    setData({
                        ...data,
                        card: data.card.concat(tmp),
                        idx: snapShot.docs[snapShot.docs.length - 1],
                    });
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const more = () => {
        var order = data.order;
        var ref = getRef(data.type, data.order);
        getContents(ref.startAfter(data.idx.data()[order]).limit(data.limit));
    };

    useEffect(() => {
        var ref = getRef(data.type, data.order);
        //getContents(ref.where("author.id", "==", "n4@naver.com").limit(data.limit));
        getContents(ref.limit(data.limit));
    }, []);

    return (
        <div className="d-flex flex-column h-100" style={{ backgroundColor: "rgb(242, 244, 247)" }}>
            <Nav />

            <div className="container-fluid" style={{ minHeight: "100vh" }}>
                <div className="col-sm-12 col-md-10 col-lg-7 mx-auto ">
                    <Menu
                        handleType={handleType}
                        getMyContents={handleGetMyContents}
                        handleOrder={handleOrder}
                    />
                    <div>{data.card}</div>
                    {data.idx && (
                        <div className="row pb-3 justify-content-center">
                            <button
                                className="btn text-white"
                                style={{ backgroundColor: "rgb(51, 85, 139)" }}
                                onClick={more}
                            >
                                더 보기
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="align-self-end mt-auto col-12 mt-auto py-4 bg-dark text-center text-white-50">
                presentlee914@gmail.com
            </div>
        </div>
    );
};

export default Board;
