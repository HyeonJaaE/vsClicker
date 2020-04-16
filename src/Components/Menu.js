import React, { useState } from "react";
import { useSelector } from "react-redux";

const Menu = (props) => {
    const [data, setData] = useState({
        search: "",
    });
    const auth = useSelector((state) => state.auth);

    const onChangeOrder = (e) => {
        e.preventDefault();
        props.handleOrder(e.target.value);
    };

    const onChangeType = (e) => {
        //console.log(e.target.value);
        props.handleType(e.target.value);
    };

    const onChangeGetMyContents = (e) => {
        switch (e.target.value) {
            case "mine":
                props.getMyContents(true);
                break;
            case "every":
                props.getMyContents(false);
                break;
            default:
                props.getMyContents(false);
                break;
        }
    };

    const handleChange = (e) => {
        setData({ ...data, [e.target.id]: e.target.value });
    };

    const onSearch = (e) => {
        e.preventDefault();

        props.search(data.search);
    };

    return (
        <div className="mt-2">
            <div className="row">
                <div className="col p-0">
                    <select
                        className="form-control"
                        style={{ display: "inline", width: "auto" }}
                        name="정렬"
                        onChange={onChangeOrder}
                    >
                        <option value="view">인기순</option>
                        <option value="date">최신순</option>
                    </select>
                    <select
                        className="form-control"
                        style={{ display: "inline", width: "auto" }}
                        name="타입"
                        onChange={onChangeType}
                    >
                        <option value="all">모두</option>
                        <option value="img">이미지</option>
                        <option value="txt">텍스트</option>
                    </select>
                    {auth.isAuthenticated && (
                        <select
                            className="form-control"
                            style={{ display: "inline", width: "auto" }}
                            name="글 종류"
                            onChange={onChangeGetMyContents}
                        >
                            <option value="every">모든 글</option>
                            <option value="mine">내가 작성한 글</option>
                        </select>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Menu;
