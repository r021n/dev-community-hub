import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJs,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJs.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/admin/stats",
          { headers: { Authorization: `Bearer ${auth.token}` } }
        );
        setStats(response.data);
      } catch (error) {
        console.error("gagal mengambil data admin", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [auth.token]);

  if (loading) return <p>Loading dashboard...</p>;
  if (!stats) return <p>Gagal memuat data statistik</p>;

  const chartData = {
    labels: ["Users", "Posts", "Comments", "Likes"],
    datasets: [
      {
        label: "Total Count",
        data: [
          stats.totalUsers,
          stats.totalPosts,
          stats.totalComments,
          stats.totalLikes,
        ],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };
  return (
    <div>
      <h2>Admin Dashboard</h2>
      <div style={{ maxWidth: "600px" }}>
        <Bar data={chartData} />
      </div>
    </div>
  );
};

export default AdminDashboardPage;
