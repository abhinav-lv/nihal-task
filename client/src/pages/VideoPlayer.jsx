import React from "react";
import { useParams } from "react-router-dom";

function VideoPlayer() {
  const { id } = useParams();

  return (
    <div>
      <h1>Video Player</h1>
      <video controls>
        <source src={`/api/video/${id}`} type="video/mp4" />
      </video>
    </div>
  );
}

export default VideoPlayer;
