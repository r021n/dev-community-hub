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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Users,
  FileText,
  MessageSquare,
  ThumbsUp,
  LayoutDashboard,
  AlertCircle,
} from "lucide-react";

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
  const [error, setError] = useState(null);
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/admin/stats",
          { headers: { Authorization: `Bearer ${auth.token}` } }
        );
        setStats(response.data);
        setError(null);
      } catch (error) {
        console.error("gagal mengambil data admin", error);
        setError(
          "Gagal memuat data statistik. Pastikan server berjalan dan Anda memiliki akses admin."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [auth.token]);

  if (loading)
    return (
      <div className="container p-8 mx-auto space-y-8">
        <div className="space-y-2">
          <Skeleton className="w-64 h-8" />
          <Skeleton className="w-48 h-4" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-[400px] rounded-xl" />
      </div>
    );

  if (error)
    return (
      <div className="container p-8 mx-auto">
        <Alert variant="destructive">
          <AlertCircle className="w-4 h-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );

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
        backgroundColor: [
          "rgba(59, 130, 246, 0.7)", // Blue (Users)
          "rgba(16, 185, 129, 0.7)", // Green (Posts)
          "rgba(245, 158, 11, 0.7)", // Amber (Comments)
          "rgba(239, 68, 68, 0.7)", // Red (Likes)
        ],
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Sembunyikan legend karena label bawah sudah jelas
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)", // Grid halus
        },
      },
      x: {
        grid: {
          display: false, // Hilangkan grid vertikal
        },
      },
    },
  };

  const StatCard = ({ title, value, icon: Icon, colorClass }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className={`w-4 h-4 ${colorClass}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">Total keseluruhan</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="container p-4 mx-auto space-y-8 sm:p-8">
      {/* Header Dashboard */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <LayoutDashboard className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard Admin</h2>
          <p className="text-muted-foreground">
            Ringkasan aktivitas dan statistik platform.
          </p>
        </div>
      </div>

      {/* 1. Grid Kartu Statistik (Summary) */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Pengguna"
          value={stats.totalUsers}
          icon={Users}
          colorClass="text-blue-500"
        />
        <StatCard
          title="Total Postingan"
          value={stats.totalPosts}
          icon={FileText}
          colorClass="text-green-500"
        />
        <StatCard
          title="Total Komentar"
          value={stats.totalComments}
          icon={MessageSquare}
          colorClass="text-amber-500"
        />
        <StatCard
          title="Total Likes"
          value={stats.totalLikes}
          icon={ThumbsUp}
          colorClass="text-red-500"
        />
      </div>

      {/* 2. Bagian Grafik */}
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Analisis Data</CardTitle>
          <CardDescription>
            Visualisasi perbandingan jumlah data pada platform.
          </CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          {/* Container Chart harus memiliki tinggi tetap agar responsif */}
          <div className="h-[400px] w-full">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboardPage;
