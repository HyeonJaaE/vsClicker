import React from "react";

const Card = (props) => {
    return (
        <div>
            <div
                className="card border-1 my-3 p-0 shadow-sm"
                onClick={() => {
                    window.location = "/vs/" + props.id;
                }}
                style={{ cursor: "pointer" }}
            >
                <div className="col p-4">
                    <div
                        className="d-flex pb-1 justify-content-between"
                        style={{
                            borderBottomColor: "rgb(223,223,223)",
                            borderBottomStyle: "solid",
                            borderBottomWidth: "1px",
                        }}
                    >
                        {props.view > 100 ? (
                            <div className="align-self-center">
                                <span className="badge badge-primary text-center ">인기</span>
                            </div>
                        ) : (
                            <div className="align-self-center">
                                <span
                                    className="badge badge-primary text-center"
                                    style={{ visibility: "hidden" }}
                                >
                                    인기
                                </span>
                            </div>
                        )}

                        <div className="col-lg-10 col-md-9 col-sm-8 col-8 lead m-0 p-0 text-center align-self-center">
                            <p className="pTitle mb-0">
                                <a href={"https://hyeonjaae.firebaseapp.com/vs/" + props.id}>
                                    {props.title}
                                </a>
                            </p>
                        </div>

                        {props.url ? (
                            <div className="align-self-center">
                                <span className="badge badge-dark text-center ">사진</span>
                            </div>
                        ) : (
                            <div className="align-self-center">
                                <span
                                    className="badge badge-dark text-center "
                                    style={{ visibility: "hidden" }}
                                >
                                    사진
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="row m-0" style={{ height: "19vh" }}>
                        <div
                            className="d-flex col-6 p-1 justify-content-center align-items-center"
                            style={{
                                borderRightStyle: "solid",
                                borderWidth: "1px",
                                borderColor: "rgb(223,223,223)",
                            }}
                        >
                            <h3>{props.sub[0]}</h3>
                        </div>
                        <div className="d-flex col-6 p-1 justify-content-center align-items-center">
                            <h3>{props.sub[1]}</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Card;
