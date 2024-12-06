import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Dashboard() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    axios.get("/api/videos").then((res) => setVideos(res.data));
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <ul>
        {videos.map((video, index) => (
          <li key={index}>
            {video.name} - <Link to={`/player/${video.name}`}>Play</Link>
          </li>
        ))}
      </ul>
      <Link to="/record">Record Video</Link>
    </div>
  );
}

export default Dashboard;
