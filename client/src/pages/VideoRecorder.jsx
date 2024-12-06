import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

function VideoRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [videoBlob, setVideoBlob] = useState(null);
  const [previewAvailable, setPreviewAvailable] = useState(false);
  const videoRef = useRef();
  const previewRef = useRef();

  useEffect(() => {
    try {
      videoRef.current.classList.add("hidden");
    } catch {}
  }, []);

  const startRecording = async () => {
    videoRef.current.classList.toggle("hidden");

    try {
      // Request both video and audio streams
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      videoRef.current.srcObject = stream;

      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/mp4" });
        setVideoBlob(blob);
        setPreviewAvailable(true);
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop()); // Stop both video and audio tracks
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing media devices:", error);
      alert(
        "Could not access your camera or microphone. Please check permissions."
      );
    }
  };

  const pauseRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.pause();
      setIsPaused(true);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "paused") {
      mediaRecorder.resume();
      setIsPaused(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
    }
    videoRef.current.classList.toggle("hidden");
    setIsRecording(false);
    setIsPaused(false);
  };

  const saveVideo = async () => {
    const formData = new FormData();
    formData.append("video", videoBlob);

    await axios.post("/api/record", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    alert("Video saved!");
    setPreviewAvailable(false);
    setVideoBlob(null); // Clear preview after saving
  };

  return (
    <div>
      <h1>Record Video</h1>
      <div>
        <video
          ref={videoRef}
          autoPlay
          muted
          style={{ width: "100%", maxHeight: "400px" }}
        ></video>
      </div>
      <div>
        {!isRecording ? (
          <button onClick={startRecording}>Start Recording</button>
        ) : (
          <>
            {!isPaused ? (
              <button onClick={pauseRecording}>Pause Recording</button>
            ) : (
              <button onClick={resumeRecording}>Resume Recording</button>
            )}
            <button onClick={stopRecording}>Stop Recording</button>
          </>
        )}
      </div>
      {previewAvailable && (
        <div>
          <h3>Preview Your Recording</h3>
          <video
            ref={previewRef}
            controls
            src={URL.createObjectURL(videoBlob)}
            style={{ width: "100%", maxHeight: "400px" }}
          ></video>
          <button onClick={saveVideo}>Save Video</button>
        </div>
      )}
    </div>
  );
}

export default VideoRecorder;
