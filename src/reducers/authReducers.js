const isEmpty = require("is-empty");
const initialState = {
    isAuthenticated: false,
    user: {},
    loading: false,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case "SET_CURRENT_USER":
            return {
                ...state,
                isAuthenticated: !isEmpty(action.payload),
                user: action.payload,
            };
        default:
            return state;
    }
};

// 리듀서에서 함수 ( state, action )을 export
// XXXaction.js 에서 dispatch( e ) 함수 사용, e 가 action으로 전달
// e { type: XXX, payload: XXX}
// 리듀서에서 받은 e에 따라서 스토어에 정보 저장, 갱신
