import React, { useState, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import Nav from "./Nav";
import { connect } from "react-redux";
import firebase from "../firebase";

const Login = (props) => {
    const [data, setData] = useState({
        user: null,
        email: "",
        password: "",
        errors: { password: "" },
    });

    useEffect(() => {
        /*
        if (props.auth.isAuthenticated) {
            window.alert("잘못된 접근입니다.");
            props.history.push("/");
        }*/
    });

    const updateField = (e) => {
        setData({ ...data, [e.target.id]: e.target.value });
    };

    const submit = (e) => {
        e.preventDefault();

        firebase
            .auth()
            .signInWithEmailAndPassword(data.email, data.password)
            .then(() => {
                props.history.push("/");
            })
            .catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorMessage);
                console.log(errorCode);
                // ...
            });
    };

    const { errors } = data;
    return (
        <div className="d-flex flex-column h-100" style={{ backgroundColor: "rgb(242, 244, 247)" }}>
            <Nav />
            <div className="container-fluid mt-4" style={{ minHeight: "100vh" }}>
                <div className="col-xs-12 col-sm-8 col-md-6 col-lg-4 mx-auto ">
                    <div className="text-center">
                        <h4>로그인</h4>
                    </div>
                    <small>
                        아직 계정이 없다면 <Link to="/signup">계정 생성</Link>
                    </small>
                    <form noValidate onSubmit={submit}>
                        <div className="form-group">
                            <input
                                className="form-control my-input"
                                onChange={updateField}
                                error={errors.email}
                                id="email"
                                type="email"
                                placeholder="이메일"
                                /*className={classnames("", {
                      invalid: errors.email || errors.emailnotfound
                    })}*/
                            />
                            <span className="text-danger">
                                {errors.email}
                                {errors.emailnotfound}
                            </span>
                        </div>
                        <div className="form-group">
                            <input
                                className="form-control my-input"
                                onChange={updateField}
                                error={errors.password}
                                id="password"
                                type="password"
                                placeholder="비밀번호"
                                /*className={classnames("", {
                      invalid: errors.password || errors.passwordincorrect
                    })}*/
                            />
                            <span className="text-danger">
                                {errors.password}
                                {errors.passwordincorrect}
                            </span>
                        </div>

                        <div className="form-group text-right">
                            <button
                                className="btn btn-outline-secondary btn-sm"
                                type="submit"
                                value="submit"
                            >
                                로그인
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
