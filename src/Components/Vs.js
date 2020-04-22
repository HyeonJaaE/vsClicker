import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import Nav from "./Nav";
import { fn_dateTimeToFormatted } from "./Function";
import CommentDiv from "./CommentDiv";
import firebase from "../firebase";

const Vs = (props) => {
    var parameter = props.docref;
    if (!props.homeMode) {
        parameter = props.match.params.n;
    }
    const auth = useSelector((state) => state.auth);
    const cta = useRef();
    //가져올 글 정보, 댓글 정보, 투표 여부, 댓글 정렬
    const [contents, setContents] = useState(null);
    const [comments, setComments] = useState(null);
    const [voted, setVoted] = useState(false);
    const [order, setOrder] = useState("upCount");
    const [commentToAdd, setCommentToAdd] = useState("");

    //firestore init
    const db = firebase.firestore();
    const infoDoc = db.collection("info").doc("infoDoc");
    const contentsDoc = db.collection("contents").doc(parameter);
    const commentsCol = contentsDoc.collection("comments");

    useEffect(() => {
        contentsDoc
            .update({
                view: firebase.firestore.FieldValue.increment(1),
            })
            .then(() => {
                //console.log("조회수 + 1");
                contentsDoc.get().then((snapShot) => {
                    //console.log("콘텐츠 검색");
                    setContents(snapShot.data());
                });
            });
    }, []);

    useEffect(() => {
        const voteListener = contentsDoc.onSnapshot((snapShot) => {
            setContents(snapShot.data());
        });

        return () => voteListener();
    }, []);

    useEffect(() => {
        const commentsListener = commentsCol.onSnapshot(
            (docSnapshot) => {
                //console.log(docSnapshot);
                getComments();
            },
            (err) => {
                //console.log(`Encountered error: ${err}`);
            }
        );

        return () => commentsListener();
    }, []);

    useEffect(() => {
        //console.log("정렬");
        getComments();
    }, [order]);

    const onChangeOrder = (e) => {
        e.preventDefault();
        //console.log(e.target.value);
        setOrder(e.target.value);
    };

    const getComments = () => {
        //console.log("Get Comments");
        commentsCol
            .orderBy(order, "desc")
            .get()
            .then((querySnaphot) => {
                var tmp = [];
                querySnaphot.forEach((doc) => {
                    ////console.log(doc.data());
                    tmp.push([doc.data(), doc.id]);
                });
                ////console.log("tmp", tmp);
                setComments(tmp);
            });
    };

    const onSubmit = (e) => {
        e.preventDefault();
        cta.current.value = "";

        commentsCol
            .doc()
            .set({
                cAuthor: {
                    cName: auth.user.displayName,
                    cid: auth.user.email,
                },
                cBody: commentToAdd,
                cReport: [],
                cUp: [],
                cDate: firebase.firestore.FieldValue.serverTimestamp(),
                upCount: 0,
                reportCount: 0,
            })
            .then((docRef) => {
                ////console.log(docRef);
            })
            .catch((err) => {
                ////console.log(err);
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
        if (!voted) {
            infoDoc.update({
                totalVote: firebase.firestore.FieldValue.increment(1),
            });

            contentsDoc
                .update({
                    [e]: firebase.firestore.FieldValue.increment(1),
                })
                .then((docRef) => {
                    setVoted(true);
                    ////console.log(docRef);
                })
                .catch((err) => {
                    ////console.log(err);
                });
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
            {!props.homeMode && <Nav />}
            <div
                className="d-flex flex-column col-lg-8 col-md-9 col-sm-10 align-self-center shadow my-4 p-0"
                style={{ backgroundColor: "white" }}
            >
                {contents ? (
                    contents.type === "img" ? (
                        <div className="d-flex justify-content-center">
                            <div
                                className="d-flex flex-column justify-content-center p-0 vsDiv whenHover1 text-light"
                                style={imgDivStyle}
                                id="voteA"
                                onClick={() => vote("voteA")}
                            >
                                <img
                                    src={contents.url[0]}
                                    style={{
                                        height: "100%",
                                        width: "100%",
                                        opacity: 0.85,
                                    }}
                                    alt={contents.voteA}
                                />
                                <div
                                    className="align-self-center text-center"
                                    style={{ position: "absolute", zIndex: "123" }}
                                >
                                    <h3>{contents.subtitle[0]}</h3>
                                    {voted && (
                                        <>
                                            <h1 className="mb-0">
                                                {contents.voteA > 0
                                                    ? (
                                                          (contents.voteA /
                                                              (contents.voteA + contents.voteB)) *
                                                          100
                                                      ).toFixed(0)
                                                    : 0}
                                                %
                                            </h1>
                                            {contents.voteA}
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
                                    src={contents.url[1]}
                                    style={{
                                        height: "100%",
                                        width: "100%",
                                        opacity: 0.85,
                                    }}
                                    alt={contents.voteB}
                                />
                                <div
                                    className="align-self-center text-center"
                                    style={{ position: "absolute", zIndex: "123" }}
                                >
                                    <h3>{contents.subtitle[1]}</h3>
                                    {voted && (
                                        <>
                                            <h1 className="mb-0">
                                                {contents.voteB > 0
                                                    ? (
                                                          (contents.voteB /
                                                              (contents.voteA + contents.voteB)) *
                                                          100
                                                      ).toFixed(0)
                                                    : 0}
                                                %
                                            </h1>
                                            {contents.voteB}
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
                                <h3 className="">{contents.subtitle[0]}</h3>
                                {voted && (
                                    <>
                                        <h1 className="mb-0">
                                            {contents.voteA > 0
                                                ? (
                                                      (contents.voteA /
                                                          (contents.voteA + contents.voteB)) *
                                                      100
                                                  ).toFixed(0)
                                                : 0}
                                            %
                                        </h1>
                                        {contents.voteA}
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
                                <h3>{contents.subtitle[1]}</h3>
                                {voted && (
                                    <>
                                        <h1 className="mb-0">
                                            {contents.voteB > 0
                                                ? (
                                                      (contents.voteB /
                                                          (contents.voteA + contents.voteB)) *
                                                      100
                                                  ).toFixed(0)
                                                : 0}
                                            %
                                        </h1>
                                        {contents.voteB}
                                    </>
                                )}
                            </div>
                        </div>
                    )
                ) : (
                    <div style={{ minHeight: "300px", width: "100%" }}>
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
                    <p className="mb-0">{contents && contents.title}</p>
                    <footer className="blockquote-footer">
                        by&nbsp;
                        {contents && contents.author.name}&nbsp;&nbsp;
                        <cite title="Source Title">
                            {contents && fn_dateTimeToFormatted(contents.date.toDate())}
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
                    {order == "upCount" ? (
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

                {comments && (
                    <>
                        <CommentDiv n={parameter} d={comments} />
                    </>
                )}

                <div className="col-12 my-3">
                    <form onSubmit={onSubmit}>
                        {auth.isAuthenticated ? (
                            <div className="d-flex">
                                <div className="w-100">
                                    <input
                                        ref={cta}
                                        className="w-100 form-control my-input"
                                        type="text"
                                        id="commentToAdd"
                                        placeholder="댓글 달기"
                                        onChange={(e) => setCommentToAdd(e.target.value)}
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
