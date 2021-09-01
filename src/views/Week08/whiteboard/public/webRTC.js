"use strict";

(function () {
  // 連線到 Server Port
  const socket = io("http://localhost:3001");
  let localstream;
  let pc;
  const myVideo = document.querySelector("#myVideo");
  const remoteVideo = document.querySelector("#remoteVideo");
  const joinBtn = document.querySelector(".joinBtn");
  const initialBtn = document.querySelector(".initialBtn");
  const btnCall = document.querySelector(".btnCall");

  initialBtn.addEventListener("click", initPeerConnection);
  joinBtn.addEventListener("click", joinRoom);
  btnCall.addEventListener("click", function () {
    createSignal(true);
  });

  function joinRoom() {
    socket.emit("joinRoom", "secret room");
  }

  async function initPeerConnection() {
    await createMedia();
    getAudioVideo();
    createPeerConnection();
    addLocalStream();
    onIceCandidates();
    onIceconnectionStateChange();
    onAddStream();
  }

  // 初始化影像/聲音
  async function createMedia() {
    localstream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    myVideo.srcObject = localstream;
  }

  // 取得裝置名稱
  function getAudioVideo() {
    const video = localstream.getVideoTracks();
    const audio = localstream.getAudioTracks();

    if (video.length > 0) {
      console.log(`使用影像裝置 => ${video[0].label}`);
    }
    if (audio.length > 0) {
      console.log(`使用聲音裝置 => ${audio[0].label}`);
    }
  }

  // 建立 P2P 連接
  function createPeerConnection() {
    const configuration = {
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302", // Google's public STUN server
        },
      ],
    };
    pc = new RTCPeerConnection(configuration);
  }

  // 增加本地流
  function addLocalStream() {
    pc.addStream(localstream);
  }

  // 監聽 ICE Server
  function onIceCandidates() {
    // 找尋到 ICE 候選位置後，送去 Server 與另一位配對
    pc.onicecandidate = ({ candidate }) => {
      console.log("candidate:", candidate);
      if (!candidate) {
        return;
      }
      console.log("onIceCandidate => ", candidate);
      socket.emit("peerconnectSignaling", { candidate });
    };
  }

  // 監聽 ICE 連接狀態
  function onIceconnectionStateChange() {
    pc.oniceconnectionstatechange = (evt) => {
      console.log("ICE 伺服器狀態變更 => ", evt.target.iceConnectionState);
    };
  }

  // 監聽是否有流傳入，如果有的話就顯示影像
  function onAddStream() {
    pc.onaddstream = (event) => {
      console.log("event:", event);
      if (!remoteVideo.srcObject && event.stream) {
        remoteVideo.srcObject = event.stream;
        console.log("接收流並顯示於遠端視訊！", event);
      }
    };
  }

  let offer;

  const signalOption = {
    offerToReceiveAudio: 1, // 是否傳送聲音流給對方
    offerToReceiveVideo: 1, // 是否傳送影像流給對方
  };

  async function createSignal(isOffer) {
    try {
      if (!pc) {
        console.log("尚未開啟視訊");
        return;
      }
      // 呼叫 peerConnect 內的 createOffer / createAnswer
      offer = await pc[`create${isOffer ? "Offer" : "Answer"}`](signalOption);
      console.log(offer);
      // 設定本地流配置
      await pc.setLocalDescription(offer);
      sendSignalingMessage(pc.localDescription, isOffer ? true : false);
    } catch (err) {
      console.log(err);
    }
  }

  function sendSignalingMessage(desc, offer) {
    const isOffer = offer ? "offer" : "answer";
    console.log(`寄出 ${isOffer}`);
    socket.emit("peerconnectSignaling", { desc });
  }

  socket.on("peerconnectSignaling", async ({ desc, candidate }) => {
    // desc 指的是 Offer 與 Answer
    // currentRemoteDescription 代表的是最近一次連線成功的相關訊息
    if (desc && !pc.currentRemoteDescription) {
      console.log("desc => ", desc);

      await pc.setRemoteDescription(new RTCSessionDescription(desc));
      createSignal(desc.type === "answer" ? true : false);
    } else if (candidate) {
      // 新增對方 IP 候選位置
      console.log("candidate =>", candidate);
      pc.addIceCandidate(new RTCIceCandidate(candidate));
    }
  });

  socket.on("roomBroadcast", (message) => {
    console.log("房間廣播 => ", message);
  });
})();
