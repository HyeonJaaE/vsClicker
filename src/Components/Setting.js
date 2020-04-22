import React, { useState, useEffect } from "react";

import { checkFile } from "./Function";
import firebase from "../firebase";
import { useSelector } from "react-redux";

import Nav from "./Nav";
//import { GET_ERRORS } from '../actions/types';

const Setting = (props) => {
    const auth = useSelector((state) => state.auth);

    const [info, setInfo] = useState({
        title: "",
        subtitle1: "",
        subtitle2: "",
        file1: null,
        file2: null,
        option: "txt",
    });
    const [url1, setUrl1] = useState(null);
    const [url2, setUrl2] = useState(null);
    const [data, setData] = useState(null);

    useEffect(() => {
        if (!auth.isAuthenticated) {
            window.alert("로그인 후 이용가능합니다");
            props.history.push("/");
        }
    });

    useEffect(() => {
        //파일 업로드 => url1, url2 != null

        if (url1 !== null && url2 !== null && data !== null) {
            var _data = data;
            _data.url = [url1, url2];
            docSet(_data);
        }
        /*

        if (this.state.file1) {
            if (this.state.file1.size > 1024 * 1024 * 2) window.alert("용량 초과");
        }*/
    }, [data, url1, url2]);

    const updateField = (e) => {
        if (e.target.files) {
            setInfo({ ...info, [e.target.id]: e.target.files[0] });
        } else {
            setInfo({ ...info, [e.target.id]: e.target.value });
        }
    };

    const onSubmit = (e) => {
        e.preventDefault();

        //타입이 img 일때, txt 일때 따로 처리
        //img일때는 fileupload 함수 호출하여 url값을 반환 받는다
        var _data = {
            author: {
                id: auth.user.email,
                name: auth.user.displayName,
            },
            subtitle: [info.subtitle1, info.subtitle2],
            title: info.title,
            type: info.option,
            view: 0,
            voteA: 0,
            voteB: 0,
            date: firebase.firestore.FieldValue.serverTimestamp(),
        };

        if (info.option === "img") {
            if (info.file1.size > 1024 * 1024 * 2) {
                window.alert("1번 파일의 용량이 2MB를 초과합니다.");
                return;
            }
            if (info.file2.size > 1024 * 1024 * 2) {
                window.alert("2번 파일의 용량이 2MB를 초과합니다.");
                return;
            }

            if (!checkFile(info.file1.type)) {
                window.alert("파일 확장자명을 확인해주세요.");
                return;
            }

            if (!checkFile(info.file2.type)) {
                window.alert("파일 확장자명을 확인해주세요.");
                return;
            }

            setData(_data);
            fileUpload(info.file1, 1);
            fileUpload(info.file2, 2);
        } else {
            docSet(_data);
        }
    };

    const docSet = (e) => {
        //console.log("e", e);
        var db = firebase.firestore();

        db.collection("contents")
            .doc()
            .set(e)
            .then((docRef) => {
                //console.log("Document written with ID: ", docRef);
                props.history.push("/");
            })
            .catch(function (error) {
                //console.error("Error adding document: ", error);
            });
    };

    const fileUpload = (e, o) => {
        var storageRef = firebase.storage().ref();
        // File or Blob named mountains.jpg
        var file = e;
        // Create the file metadata
        var metadata = {
            contentType: "image",
        };

        // Upload file and metadata to the object 'images/mountains.jpg'
        var uploadTask = storageRef.child("img/" + Date.now() + file.name).put(file, metadata);

        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on(
            firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
            function (snapshot) {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                //console.log("Upload is " + progress + "% done");
                switch (snapshot.state) {
                    case firebase.storage.TaskState.PAUSED: // or 'paused'
                        //console.log("Upload is paused");
                        break;
                    case firebase.storage.TaskState.RUNNING: // or 'running'
                        //console.log("Upload is running");
                        break;
                }
            },
            function (error) {
                // A full list of error codes is available at
                // https://firebase.google.com/docs/storage/web/handle-errors
                switch (error.code) {
                    case "storage/unauthorized":
                        // User doesn't have permission to access the object
                        break;

                    case "storage/canceled":
                        // User canceled the upload
                        break;

                    case "storage/unknown":
                        // Unknown error occurred, inspect error.serverResponse
                        break;
                }
            },
            () => {
                // Upload completed successfully, now we can get the download URL
                uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                    //console.log("File available at", downloadURL);
                    switch (o) {
                        case 1:
                            setUrl1(downloadURL);
                            break;
                        case 2:
                            setUrl2(downloadURL);
                            break;
                    }
                });
            }
        );
    };

    return (
        <div className="d-flex flex-column h-100" style={{ backgroundColor: "rgb(242, 244, 247)" }}>
            <Nav />
            <div className="container-fluid mt-4" style={{ minHeight: "100vh" }}>
                <div className="col-12 col-sm-10 col-md-9 col-lg-8 mx-auto p-0">
                    <form onSubmit={onSubmit}>
                        <div className="d-flex">
                            <div className="p-0">
                                <select
                                    className="form-control p-0"
                                    id="option"
                                    onChange={updateField}
                                >
                                    <option value="txt">글</option>
                                    <option value="img">이미지</option>
                                </select>
                            </div>
                            <div className="flex-fill">
                                <input
                                    className="form-control my-input"
                                    type="text"
                                    id="title"
                                    placeholder="제목"
                                    onChange={updateField}
                                    required
                                />
                            </div>
                        </div>
                        <div className="my-4">
                            글 설명 작성, 첨부 파일의 용량은 2MB를 넘을 수 없습니다.
                            <br />
                            <small className="text-info">
                                업로드 가능한 확장자명 jpg, jpeg, gif, png
                            </small>
                        </div>

                        <div className="row mx-auto mt-4">
                            <div className="col-sm-6 col-12 p-0">
                                <textarea
                                    className="form-control"
                                    rows="10"
                                    id="subtitle1"
                                    onChange={updateField}
                                    required
                                    style={{ resize: "none" }}
                                />

                                {info.option === "img" ? (
                                    <input
                                        type="file"
                                        className="form-control-file"
                                        id="file1"
                                        name="file1"
                                        onChange={updateField}
                                        accept="image/gif, image/jpeg, image/png"
                                        required
                                    />
                                ) : (
                                    <input
                                        type="file"
                                        className="form-control-file"
                                        id="file1"
                                        name="file1"
                                        onChange={updateField}
                                        disabled
                                        style={{ visibility: "hidden" }}
                                    />
                                )}
                            </div>

                            <div className="col-sm-6 col-12 p-0">
                                <textarea
                                    className="form-control"
                                    rows="10"
                                    id="subtitle2"
                                    onChange={updateField}
                                    required
                                    style={{ resize: "none" }}
                                />

                                {info.option === "img" ? (
                                    <input
                                        type="file"
                                        className="form-control-file"
                                        id="file2"
                                        name="file2"
                                        accept="image/gif, image/jpeg, image/png"
                                        onChange={updateField}
                                        required
                                    />
                                ) : (
                                    <input
                                        type="file"
                                        className="form-control-file"
                                        id="file2"
                                        name="file2"
                                        onChange={updateField}
                                        disabled
                                        style={{ visibility: "hidden" }}
                                    />
                                )}
                            </div>
                        </div>

                        <div className="d-flex justify-content-end">
                            {data ? (
                                <div className="spinner-border text-secondary" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div>
                            ) : (
                                <button
                                    className="btn btn-outline-secondary btn-sm"
                                    type="submit"
                                    value="submit"
                                >
                                    작성
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Setting;
