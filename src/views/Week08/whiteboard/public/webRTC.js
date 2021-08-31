"use strict";

(function () {
  navigator.getUserMedia(
    { video: true, audio: true },
    function (stream) {
      const localVideo = document.getElementById("localVideo");
      if (localVideo) {
        localVideo.srcObject = stream;
      }
    },
    function (error) {
      console.warn(error.message);
    }
  );
})();
