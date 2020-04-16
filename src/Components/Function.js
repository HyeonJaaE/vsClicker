import React from "react";

const Hello = (props) => {
    return <div>Hello {props.name}</div>;
};

const fn_dateTimeToFormatted = (dt) => {
    var min = 60 * 1000;
    var c = new Date();
    var d = new Date(dt);
    var minsAgo = Math.floor((c - d) / min);

    var result = {
        raw:
            d.getFullYear() +
            "-" +
            (d.getMonth() + 1 > 9 ? "" : "0") +
            (d.getMonth() + 1) +
            "-" +
            (d.getDate() > 9 ? "" : "0") +
            d.getDate() +
            " " +
            (d.getHours() > 9 ? "" : "0") +
            d.getHours() +
            ":" +
            (d.getMinutes() > 9 ? "" : "0") +
            d.getMinutes() +
            ":" +
            (d.getSeconds() > 9 ? "" : "0") +
            d.getSeconds(),
        formatted: "",
    };

    if (minsAgo < 60) {
        // 1시간 내
        result.formatted = minsAgo + "분 전";
    } else if (minsAgo < 60 * 24) {
        // 하루 내
        result.formatted = Math.floor(minsAgo / 60) + "시간 전";
    } else {
        // 하루 이상
        result.formatted = Math.floor(minsAgo / 60 / 24) + "일 전";
    }

    return result.formatted;
};

const checkFile = (e) => {
    if (e == "image/gif" || e == "image/jpg" || e == "image/jpeg" || e == "image/png") {
        return true;
    } else {
        return false;
    }
};
export { fn_dateTimeToFormatted };
export { checkFile };
export default Hello;
