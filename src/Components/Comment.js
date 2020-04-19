import React, { useState, useEffect } from "react";
import firebase from "../firebase";
import CommentDiv from "./CommentDiv";
import { useSelector } from "react-redux";
import { fn_dateTimeToFormatted } from "./Function";

const Comment = (props) => {
    const auth = useSelector((state) => state.auth);

    const [replyToAdd, setReplyToAdd] = useState("");
    const [willReply, setWillReply] = useState(false);
    const [reply, setReply] = useState(null);

    //firestore init
    const db = firebase.firestore();
    const contentsDoc = db.collection("contents").doc(props.n);
    const commentsCol = contentsDoc.collection("comments");
    const replyCol = commentsCol.doc(props.commentDocId).collection("reply");

    useEffect(() => {
        if (!props.data.replyTo) {
            getReply();
        }
    }, []);

    useEffect(() => {
        if (!props.data.replyTo) {
            const replyListener = replyCol.onSnapshot(
                (docSnapshot) => {
                    getReply();
                },
                (err) => {
                    //console.log(`Encountered error: ${err}`);
                }
            );
            return () => replyListener();
        }
    }, []);

    const getReply = () => {
        replyCol
            .orderBy("cDate", "asc")
            .get()
            .then((querySnaphot) => {
                var tmp = [];
                querySnaphot.forEach((doc) => {
                    //console.log(doc.id);
                    // this.props.docid는 comment id , doc.id 는 reply id
                    tmp.push([doc.data(), props.commentDocId, doc.id]);
                });
                //console.log("tmp", tmp);
                setReply(tmp);
            });
    };

    const toggle = () => {
        if (auth.isAuthenticated) {
            if (!willReply) {
                setWillReply(true);
            } else {
                setWillReply(false);
            }
        } else {
            window.alert("로그인 후 이용할 수 있습니다.");
        }
    };

    const up = () => {
        var ref = commentsCol;

        //comment 일때는 docId = comment id , docId2 = undefined
        //reply 일때는 docId = comment id , docId2 = reply id
        if (props.data.replyTo) {
            ref = replyCol.doc(props.replyDocId);
        } else {
            ref = commentsCol.doc(props.commentDocId);
        }

        if (auth.isAuthenticated) {
            ref.get().then((snapShot) => {
                if (!snapShot.data().cUp.find((e) => e === auth.user.email)) {
                    if (window.confirm("추천하시겠습니까?")) {
                        ref.update({
                            cUp: firebase.firestore.FieldValue.arrayUnion(auth.user.email),
                            upCount: firebase.firestore.FieldValue.increment(1),
                        }).then(() => {
                            window.alert("추천 완료");
                        });
                    }
                } else {
                    window.alert("이미 추천하셨습니다");
                }
            });
        } else {
            window.alert("로그인 후 이용 가능합니다");
        }
    };

    const report = () => {
        var ref = contentsDoc;

        if (props.data.replyTo) {
            ref = replyCol.doc(props.replyDocId);
        } else {
            ref = commentsCol.doc(props.commentDocId);
        }

        if (auth.isAuthenticated) {
            ref.get().then((snapShot) => {
                if (!snapShot.data().cReport.find((e) => e === auth.user.email)) {
                    if (window.confirm("신고하시겠습니까?")) {
                        ref.update({
                            cReport: firebase.firestore.FieldValue.arrayUnion(auth.user.email),
                            reportCount: firebase.firestore.FieldValue.increment(1),
                        }).then(() => {
                            window.alert("신고 완료");
                        });
                    }
                } else {
                    window.alert("이미 신고하셨습니다.");
                }
            });
        } else {
            window.alert("로그인 후 이용 가능합니다");
        }
    };

    const del = () => {
        if (window.confirm("댓글을 삭제하시겠습니까?")) {
            var ref = contentsDoc;

            if (props.data.replyTo) {
                ref = replyCol.doc(props.replyDocId);
            } else {
                ref = commentsCol.doc(props.commentDocId);
            }

            ref.delete().then(() => {
                window.alert("삭제 완료");
                //window.location.reload();
            });
        }
    };

    const onSubmit = (e) => {
        e.preventDefault();

        replyCol
            .doc()
            .set({
                cAuthor: {
                    cName: auth.user.displayName,
                    cid: auth.user.email,
                },
                replyTo: props.data.cAuthor.cName,
                cBody: replyToAdd,
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

    var btnStyleActive = {
        outline: "none",
        background: "none!important",
        border: "none",
        padding: "0!important",
        backgroundColor: "white",
        cursor: "pointer",
        fontSize: "11px",
    };

    return (
        <div className="d-flex flex-column p-3">
            <div className="d-flex justify-content-between" style={{}}>
                <div>
                    <p className="mb-0">
                        <strong>{props.data.cAuthor.cName} </strong>
                        <small className="text-secondary">
                            {props.data.cDate && fn_dateTimeToFormatted(props.data.cDate.toDate())}
                        </small>
                    </p>
                </div>
                <div>
                    <input
                        className="text-info"
                        type="button"
                        style={btnStyleActive}
                        value="신고"
                        onClick={report}
                    ></input>
                </div>
            </div>
            <div className="">
                {props.data.replyTo && (
                    <small className="pr-2 text-secondary">ㅡ{props.data.replyTo} </small>
                )}

                {props.data.cBody}
            </div>
            <div className="d-flex ">
                <div className="pr-2">
                    <input
                        type="button"
                        style={btnStyleActive}
                        value="답글"
                        onClick={toggle}
                    ></input>
                    <input type="button" style={btnStyleActive} value="추천" onClick={up}></input>
                    <small>{props.data.upCount && props.data.upCount}개</small>
                </div>

                <div>
                    {props.data.cAuthor.cid === auth.user.email && (
                        <input
                            type="button"
                            style={btnStyleActive}
                            value="삭제"
                            onClick={del}
                        ></input>
                    )}
                </div>
            </div>

            {reply && (
                <div>
                    <CommentDiv n={props.n} d={reply} />
                </div>
            )}

            {willReply && (
                <div className="col-12 my-3">
                    <form onSubmit={onSubmit}>
                        <div className="d-flex">
                            <div className="w-100">
                                <input
                                    className="w-100 form-control my-input"
                                    type="text"
                                    id="replyToAdd"
                                    placeholder="답글 달기"
                                    onChange={(e) => setReplyToAdd(e.target.value)}
                                />
                            </div>
                            <div>
                                <input
                                    className="form-control my-input"
                                    type="submit"
                                    value="답글 등록"
                                />
                            </div>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Comment;
