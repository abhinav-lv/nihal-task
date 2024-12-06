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
      <div className="p-4 bg-gray-800 text-white">
        <h1 className="text-2xl">Dashboard</h1>
      </div>
      <div className="p-4">
        <Link to="/record">
          <button className="rounded-sm p-2 bg-blue-600 text-white">
            Record Video
          </button>
        </Link>
      </div>
      <div className="p-4">
        <ul>
          {videos.map((video, index) => (
            <li key={index} className="mt-2">
              {video.name} -{" "}
              <Link to={`/player/${video.name}`}>
                <button className="rounded-sm p-2 bg-blue-600 text-white">
                  Play
                </button>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;
