const adminService = require("../services/adminService");

const getStats = async (req, res) => {
  try {
    const stats = await adminService.getDashboardStats();
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data statistik" });
  }
};

module.exports = { getStats };
