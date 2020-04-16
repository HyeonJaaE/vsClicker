import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import firebase from "../firebase";
import Nav from "./Nav";

const Profile = (props) => {
    const [data, setData] = useState({
        password: "",
        changeDisplayName: "",
        changePassword: "",
    });

    const auth = useSelector((state) => state.auth);

    useEffect(() => {
        if (!auth.isAuthenticated) {
            window.alert("비 로그인 상태입니다.");
            props.history.push("/");
        }
    }, []);

    const handleChange = (e) => {
        setData({ ...data, [e.target.id]: e.target.value });
    };

    const signOut = (e) => {
        e.preventDefault();
        var user = firebase.auth().currentUser;
        const credential = firebase.auth.EmailAuthProvider.credential(
            auth.user.email,
            data.password
        );

        // Prompt the user to re-provide their sign-in credentials

        user.reauthenticateWithCredential(credential)
            .then(() => {
                user.delete()
                    .then(() => {
                        window.alert("탈퇴 완료");
                        props.history.push("/");

                        // User deleted.
                    })
                    .catch((err) => {
                        //console.log(err);
                        // An error happened.
                    });
            })
            .catch((err) => {
                //console.log(err);
            });
    };

    const submit = (e) => {
        e.preventDefault();
        var user = firebase.auth().currentUser;
        const credential = firebase.auth.EmailAuthProvider.credential(
            auth.user.email,
            data.password
        );

        // Prompt the user to re-provide their sign-in credentials

        user.reauthenticateWithCredential(credential)
            .then(() => {
                user.updatePassword(data.changePassword)
                    .then(() => {
                        window.alert("변경 완료");
                        props.history.push("/");
                        // Update successful.
                    })
                    .catch((err) => {
                        window.alert(err);
                    });
            })
            .catch((err) => {
                window.alert(err);
            });
    };

    return (
        <div className="d-flex flex-column h-100" style={{ backgroundColor: "rgb(242, 244, 247)" }}>
            <Nav />
            <div className="container-fluid mt-4" style={{ minHeight: "100vh" }}>
                <div className="col-12 col-sm-8 col-md-6 col-lg-5 mx-auto p-0">
                    <form className="form-group" onSubmit={submit}>
                        <label className="mb-0 mt-3">닉네임 변경</label>
                        <input
                            className="form-control"
                            type="text"
                            id="changeDisplayName"
                            onChange={handleChange}
                            defaultValue={auth.user.displayName}
                            readOnly
                        ></input>
                        <label className="mb-0 mt-3">아이디</label>
                        <input
                            className="form-control"
                            type="text"
                            value={auth.user.email}
                            readOnly
                        ></input>
                        <label className="mb-0 mt-3">비밀번호 확인</label>
                        <input
                            className="form-control"
                            type="password"
                            id="password"
                            placeholder="현재 비밀번호"
                            onChange={handleChange}
                        ></input>
                        <label className="mb-0 mt-3">비밀번호 변경</label>
                        <input
                            className="form-control"
                            type="password"
                            id="changePassword"
                            placeholder="변경할 비밀번호"
                            onChange={handleChange}
                        ></input>
                        <div className="d-flex justify-content-between pt-4">
                            <button className="btn btn-outline-secondary">변경</button>
                            <button className="btn btn-danger" onClick={signOut}>
                                회원 탈퇴
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
