import axios from "axios";

// 发布问题
const QUE_POST = "QUE_POST";
// 读取问题
const QUE_LIST = "QUE_LIST";
// 回复问题
const QUE_REPL = "QUE_REPL";
const DEL_REPL = "DEL_REPL";
const DEL_QUES = "DEL_QUES";
const QUE_MY_LIST = "QUE_MY_LIST";

const initState = {
  questions: [],
  users: {},
  replys: [],
  myquestions: [],
};

export function question(state = initState, action) {
  switch (action.type) {
    case QUE_LIST:
      return {
        ...state,
        questions: action.payload.questions,
        users: action.payload.users
      };
    case QUE_REPL:
      return {
        ...state,
        replys: [...action.payload.replys]
      }
    case DEL_REPL:
      return {
        ...state,
        replys: []
      }
    case QUE_POST:
      return {
        ...state,
        questions: [...state.questions, action.payload.question]
      };
    case QUE_MY_LIST:
      return {
        ...state,
        myquestions: [...action.payload.myquestions]
      }
    case DEL_QUES:
      return initState;
    default:
      return state;
  }
}

function quePost({ question }) {
  return { type: QUE_POST, payload: { question } };
}
function queList({ questions, users }) {
  return { type: QUE_LIST, payload: { questions, users } };
}
function queRepl({ replys }) {
  return { type: QUE_REPL, payload: { replys } }; 
}
function myQueList({myquestions}) {
  return { type: QUE_MY_LIST, payload: {myquestions}}
}
export function delRepl() {
  return { type: DEL_REPL}; 
}
export function eraseQues() {
  return { type: DEL_QUES};
}
export function postQue({ image, question, addition }) {
  return async (dispatch, getState) => {
    const res = await axios.post("/user/postques", {
      image,
      question,
      addition
    });
    // const userid = getState().user._id;
    if (res.status === 200 && res.data.code === 0) {
      dispatch(quePost({ question: res.data.data }));
    }
  };
}

export function getQueList() {
  return (dispatch, getState) => {
    axios.get("/user/getqueslist").then(res => {
      if (res.status === 200 && res.data.code === 0) {
        dispatch(
          queList({ questions: res.data.questions, users: res.data.users })
        );
      }
    });
  };
}

export function replyQue({questionid, content, replysnum}) {
  return (dispatch, getState) => {
    axios.post("/user/replyque", {
      questionid,
      content,
      replysnum
    }).then(res => {
      if (res.status === 200 && res.data.code === 0) {
        dispatch(
          queRepl({ replys: res.data.replys })
        );
      }
    })
  };
}

export function getReplyList({questionid}) {
  return (dispatch, getState) => {
    axios.post("/user/getreplylist", {
      questionid,
    }).then(res => {
      if (res.status === 200 && res.data.code === 0) {
        dispatch(
          queRepl({ replys: res.data.replys })
        );
      }
    })
  };
}

export function getMyQueList() {
  return dispatch => {
    axios.get("/user/getmyqueslist")
      .then(res => {
        if (res.status === 200 && res.data.code === 0) {
          dispatch(
            myQueList({ myquestions: res.data.myquestions })
          );
        }
      })
  }
}

export function readQue({questionid}) {
  return dispatch => {
    axios.post("/user/readque", {
      questionid
    }).then(res => {
      if (res.status === 200 && res.data.code === 0) {
        dispatch(
          myQueList({ myquestions: res.data.myquestions })
        );
      }
    })
  }
}

export function reviewQue({questionid, act}) {
  return dispatch => {
    axios.post("/admin/reviewque", {
      questionid,
      act
    }).then(res => {
      if (res.status === 200 && res.data.code === 0) {
        dispatch(
          eraseQues()
        );
      }
    })
  }
}