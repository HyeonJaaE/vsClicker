import React from "react";
import Comment from "./Comment";

const CommentDiv = (props) => {
    const tmp = props.d;
    const list = tmp.map((t, i) => (
        <Comment key={i} data={t[0]} commentDocId={t[1]} replyDocId={t[2]} n={props.n}></Comment>
    ));

    return <div className="d-flex flex-column">{list}</div>;
};

export default CommentDiv;
