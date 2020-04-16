import React from "react";
import Comment from "./Comment";

const CommentDiv = (props) => {
    const tmp = props.data;
    //console.log("div", tmp);
    const list = tmp.map((t, i) => (
        <Comment key={i} data={t[0]} docId={t[1]} docId2={t[2]} n={props.n}></Comment>
    ));

    return <div className="d-flex flex-column">{list}</div>;
};

export default CommentDiv;
