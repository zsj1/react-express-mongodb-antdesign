import axios from "axios";
import io from "socket.io-client";
import { func } from "prop-types";
const socket = io("ws://localhost:9093");

// 获取聊天列表
const MSG_LIST = "MSG_LIST";
// 读取信息
const MSG_RECV = "MSG_RECV";
// 标识已读
const MSG_READ = "MSG_READ";
const MSG_DEL = "MSG_DEL";

const initState = {
  chatmsg: [],
  users: {},
  unread: 0
};

export function chat(state = initState, action) {
  switch (action.type) {
    case MSG_LIST:
      return {
        ...state,
        chatmsg: action.payload.msgs,
        users: action.payload.users,
        unread: action.payload.msgs.filter(v => !v.read && v.to ===action.payload.userid).length
      };
    case MSG_RECV:
      const isnew = state.chatmsg.filter(v => v === action.payload).length;
      if ( isnew === 0 ) {
        const n = action.payload.to === action.userid ? 1: 0;
        const msgs = action.payload.to === action.userid || action.payload.from === action.userid ? [...state.chatmsg, action.payload] : [...state.chatmsg];
        return {
          ...state,
          chatmsg: msgs,
          unread: state.unread + n,
        };
      } else {
        return state;
      }
    case MSG_READ:
      return {
        ...state, chatmsg: 
        state.chatmsg.map(v => {
          if (v.to === action.payload.userid && v.from === action.payload.from){
            v.read = true;
          }
          return v;
        }), 
        unread: state.unread - action.payload.num
      }
    case MSG_DEL:
      return initState;
    default:
      return state;
  }
}

function msgList(msgs, users, userid) {
  return { type: MSG_LIST, payload: {msgs, users, userid} };
}
function msgRecv(msg, userid) {
  return { type: MSG_RECV, payload: msg, userid };
}
function msgRead({from, userid, num}){
  return {type: MSG_READ, payload: {from, userid, num}}
}
export function eraseMsg() {
  return {type: MSG_DEL}
}
export function getMsgList() {
  return (dispatch, getState) => {
    axios.get("/user/getmsglist").then(res => {
      if (res.status === 200 && res.data.code === 0) {
        const userid = getState().user._id;
        // 获得当前redux中全部state
        // console.log(getState());  
        dispatch(msgList(res.data.msgs, res.data.users, userid));
      }
    });
  };
}

export function sendMsg({from, to, msg}) {
  return dispatch => {
    socket.emit('sendmsg', {from, to, msg});
  }
}

export function recvMsg() {
  return (dispatch, getState) => {
    socket.on('recvmsg', function(data) {
      // console.log('recvmsg', data);
      const userid = getState().user._id;
      // 只需要将信息转发给被发送的对象
      dispatch(msgRecv(data, userid));
    })
  }
}

export function readMsg(from) {
  return async (dispatch, getState) => {
    const res = await axios.post('/user/readmsg', {from});
    const userid = getState().user._id;
    if (res.status === 200 && res.data.code === 0) {
      dispatch(msgRead({from, userid, num: res.data.num}));
    }
    // axios.post('/user/readmsg', {from})
    //   .then(res => {
    //     const userid = getState().user._id;
    //     if (res.status === 200 && res.data.code === 0) {
    //       dispatch(msgRead({from, userid, num: res.data.num}));
    //     }
    //   })
  }
}