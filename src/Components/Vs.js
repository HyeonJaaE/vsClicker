import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Nav from "./Nav";
import { fn_dateTimeToFormatted } from "./Function";
import CommentDiv from "./CommentDiv";
import firebase from "../firebase";

const Vs = (props) => {
    const [data, setData] = useState({
        commentToAdd: "",
        data: null,
        comments: null,
        vote: [],
        check: [],
        order: "upCount",
    });

    const auth = useSelector((state) => state.auth);
    const onChangeOrder = (e) => {
        e.preventDefault();
        setData({ ...data, comments: null, order: e.target.value }, getComments());
    };

    const commentsListener = () => {
        const db = firebase.firestore();
        let doc = db.collection("contents").doc(props.match.params.n).collection("comments");

        doc.onSnapshot(
            (docSnapshot) => {
                //console.log(docSnapshot);
                getComments();
            },
            (err) => {
                //console.log(`Encountered error: ${err}`);
            }
        );
    };

    const getComments = () => {
        const db = firebase.firestore();
        db.collection("contents")
            .doc(props.match.params.n)
            .collection("comments")
            .orderBy(data.order, "desc")
            .get()
            .then((querySnaphot) => {
                var tmp = [];
                querySnaphot.forEach((doc) => {
                    //console.log(doc.id);
                    tmp.push([doc.data(), doc.id]);
                });
                //console.log("tmp", tmp);
                setData({ ...data, comments: tmp });
            });
    };

    useEffect(() => {
        commentsListener();
        getComments();
        const db = firebase.firestore();
        const data = db.collection("contents").doc(props.match.params.n);

        data.update({
            view: firebase.firestore.FieldValue.increment(1),
        });

        data.onSnapshot((snapShot) => {
            var A = snapShot.data().voteA;
            var B = snapShot.data().voteB;
            setData({
                ...data,
                data: snapShot.data(),
                check: [A.find((e) => e === auth.user.email), B.find((e) => e === auth.user.email)],
                vote: [A.length, B.length],
            });
        });
    }, []);

    const handleChange = (e) => {
        setData({ ...data, [e.target.id]: e.target.value });
    };

    const onSubmit = (e) => {
        e.preventDefault();

        var db = firebase.firestore();
        db.collection("contents")
            .doc(props.match.params.n)
            .collection("comments")
            .doc()
            .set({
                cAuthor: {
                    cName: auth.user.displayName,
                    cid: auth.user.email,
                },
                cBody: data.commentToAdd,
                cReport: [],
                cUp: [],
                cDate: firebase.firestore.FieldValue.serverTimestamp(),
                upCount: 0,
                reportCount: 0,
            })
            .then((docRef) => {
                window.location.reload();
                //console.log(docRef);
            })
            .catch((err) => {
                //console.log(err);
            });
    };

    const toLogin = () => {
        if (window.confirm("로그인 후 이용 가능합니다. 로그인 화면으로 이동하시겠습니까?")) {
            props.history.push("/login");
        } else {
            // They clicked no
        }
    };

    const vote = (e) => {
        if (!auth.isAuthenticated) {
            toLogin();
        } else {
            if (!data.check[0] && !data.check[1]) {
                if (window.confirm("한 번 투표하면 변경/취소 불가능 합니다. 투표하시겠습니까?")) {
                    let db = firebase.firestore();
                    db.collection("contents")
                        .doc(props.match.params.n)
                        .update({
                            [e]: firebase.firestore.FieldValue.arrayUnion(auth.user.email),
                        })
                        .then((docRef) => {
                            //console.log(docRef);
                            window.location.reload();
                        })
                        .catch((err) => {
                            //console.log(err);
                        });
                } else {
                }
            } else {
                window.alert("이미 투표함");
            }
        }
    };

    var imgDivStyle = {
        height: "300px",
        width: "100%",
        cursor: "pointer",
    };

    var btnStyleActive = {
        outline: "none",
        background: "none!important",
        border: "none",
        padding: "0!important",
        backgroundColor: "white",
        cursor: "pointer",
    };

    var btnStyleInactive = {
        outline: "none",
        background: "none!important",
        border: "none",
        padding: "0!important",
        backgroundColor: "white",
        color: "gray",
        cursor: "pointer",
    };

    return (
        <div className="d-flex flex-column h-100" style={{ backgroundColor: "rgb(242, 244, 247)" }}>
            <Nav name="HOME" />
            <div
                className="d-flex flex-column col-lg-8 col-md-9 col-sm-10 align-self-center shadow my-4 p-0"
                style={{ minHeight: "100vh", backgroundColor: "white" }}
            >
                {data.data ? (
                    data.data.type === "img" ? (
                        <div className="d-flex justify-content-center">
                            <div
                                className="d-flex flex-column justify-content-center p-0 vsDiv whenHover1 text-light"
                                style={imgDivStyle}
                                id="voteA"
                                onClick={() => vote("voteA")}
                            >
                                <img
                                    src={data.data.url[0]}
                                    style={{
                                        height: "100%",
                                        width: "100%",
                                        opacity: 0.85,
                                    }}
                                    alt={data.vote[1]}
                                />
                                <div
                                    className="align-self-center text-center"
                                    style={{ position: "absolute", zIndex: "123" }}
                                >
                                    <h3>{data.data.subtitle[0]}</h3>
                                    {(data.check[0] || data.check[1]) && (
                                        <>
                                            <h1 className="mb-0">
                                                {data.vote[0] > 0
                                                    ? (
                                                          (data.vote[0] /
                                                              (data.vote[0] + data.vote[1])) *
                                                          100
                                                      ).toFixed(1)
                                                    : 0}
                                                %
                                            </h1>
                                            {data.vote[0]}
                                        </>
                                    )}
                                </div>
                            </div>
                            <div
                                className="d-flex align-self-center justify-content-center bg-dark text-white rounded-circle shadow-lg"
                                style={{
                                    position: "absolute",
                                    zIndex: "9999",
                                    width: "50px",
                                    height: "50px",
                                }}
                            >
                                <div className="align-self-center">
                                    <h4 className="m-0">VS</h4>
                                </div>
                            </div>

                            <div
                                className="d-flex flex-column justify-content-center p-0 vsDiv whenHover1 text-light"
                                style={imgDivStyle}
                                id="voteB"
                                onClick={() => vote("voteB")}
                            >
                                <img
                                    src={data.data.url[1]}
                                    style={{
                                        height: "100%",
                                        width: "100%",
                                        opacity: 0.85,
                                    }}
                                    alt={data.vote[1]}
                                />
                                <div
                                    className="align-self-center text-center"
                                    style={{ position: "absolute", zIndex: "123" }}
                                >
                                    <h3>{data.data.subtitle[1]}</h3>
                                    {(data.check[0] || data.check[1]) && (
                                        <>
                                            <h1 className="mb-0">
                                                {data.vote[1] > 0
                                                    ? (
                                                          (data.vote[1] /
                                                              (data.vote[0] + data.vote[1])) *
                                                          100
                                                      ).toFixed(1)
                                                    : 0}
                                                %
                                            </h1>
                                            {data.vote[1]}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="d-flex justify-content-center">
                            <div
                                className="d-flex flex-column justify-content-center p-0 text-center vsDiv whenHover2 text-dark"
                                style={{
                                    height: "300px",
                                    width: "100%",
                                    backgroundColor: "rgb(247, 202, 201)",
                                }}
                                id="voteA"
                                onClick={() => vote("voteA")}
                            >
                                <h3 className="">{data.data.subtitle[0]}</h3>
                                {(data.check[0] || data.check[1]) && (
                                    <>
                                        <h1 className="mb-0">
                                            {data.vote[0] > 0
                                                ? (
                                                      (data.vote[0] /
                                                          (data.vote[0] + data.vote[1])) *
                                                      100
                                                  ).toFixed(1)
                                                : 0}
                                            %
                                        </h1>
                                        {data.vote[0]}
                                    </>
                                )}
                            </div>
                            <div
                                className="d-flex align-self-center justify-content-center bg-dark text-white rounded-circle shadow-lg"
                                style={{
                                    position: "absolute",
                                    zIndex: "9999",
                                    width: "50px",
                                    height: "50px",
                                }}
                            >
                                <div className="align-self-center">
                                    <h4 className="m-0">VS</h4>
                                </div>
                            </div>
                            <div
                                className="d-flex flex-column justify-content-center p-0 text-center vsDiv whenHover3 text-dark"
                                style={{
                                    height: "300px",
                                    width: "100%",
                                    backgroundColor: "rgb(145, 168, 209)",
                                }}
                                id="voteB"
                                onClick={() => vote("voteB")}
                            >
                                <h3>{data.data.subtitle[1]}</h3>
                                {(data.check[0] || data.check[1]) && (
                                    <>
                                        <h1 className="mb-0">
                                            {data.vote[1] > 0
                                                ? (
                                                      (data.vote[1] /
                                                          (data.vote[0] + data.vote[1])) *
                                                      100
                                                  ).toFixed(1)
                                                : 0}
                                            %
                                        </h1>
                                        {data.vote[1]}
                                    </>
                                )}
                            </div>
                        </div>
                    )
                ) : (
                    <div style={{ height: "300px", width: "100%" }}>
                        <div className="mx-auto" style={{ height: "30px", width: "30px" }}>
                            <div className="spinner-border text-secondary m-auto" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        </div>
                    </div>
                )}

                <blockquote
                    className="blockquote p-3 m-0"
                    style={{
                        borderBottomColor: "rgb(223,223,223)",
                        borderBottomStyle: "solid",
                        borderBottomWidth: "1px",
                    }}
                >
                    <p className="mb-0">{data.data && data.data.title}</p>
                    <footer className="blockquote-footer">
                        by&nbsp;
                        {data.data && data.data.author.name}&nbsp;&nbsp;
                        <cite title="Source Title">
                            {data.data && fn_dateTimeToFormatted(data.data.date.toDate())}
                        </cite>
                    </footer>
                </blockquote>

                <div
                    className="d-flex px-3 py-2 align-items-center"
                    style={{
                        borderBottomColor: "rgb(223,223,223)",
                        borderBottomStyle: "solid",
                        borderBottomWidth: "1px",
                    }}
                >
                    <div className="mr-2">
                        <p className="mb-0">댓글</p>
                    </div>
                    <div className="flex-fill"></div>
                    {data.order == "upCount" ? (
                        <div className="">
                            <button style={btnStyleActive} value="upCount" onClick={onChangeOrder}>
                                추천순
                            </button>
                            <button style={btnStyleInactive} value="cDate" onClick={onChangeOrder}>
                                최신순
                            </button>
                        </div>
                    ) : (
                        <div className="btn-group btn-group-sm">
                            <button
                                style={btnStyleInactive}
                                value="upCount"
                                onClick={onChangeOrder}
                            >
                                추천순
                            </button>
                            <button style={btnStyleActive} value="cDate" onClick={onChangeOrder}>
                                최신순
                            </button>
                        </div>
                    )}
                </div>

                {data.comments && <CommentDiv n={props.match.params.n} data={data.comments} />}

                <div className="col-12 my-3">
                    <form onSubmit={onSubmit}>
                        {auth.isAuthenticated ? (
                            <div className="d-flex">
                                <div className="w-100">
                                    <input
                                        className="w-100 form-control my-input"
                                        type="text"
                                        id="commentToAdd"
                                        placeholder="댓글 달기"
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <input
                                        className="form-control my-input"
                                        type="submit"
                                        value="댓글 등록"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="d-flex">
                                <div className="w-100">
                                    <input
                                        className="w-100 form-control my-input"
                                        type="button"
                                        id="commentToAdd"
                                        value="로그인 후 댓글 작성 가능"
                                        style={{ cursor: "pointer", width: "500px" }}
                                        onClick={toLogin}
                                    />
                                </div>
                                <div>
                                    <input
                                        className="form-control my-input"
                                        type="submit"
                                        value="댓글 등록"
                                        disabled
                                    />
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Vs;
