export const healthCheck = (req, res) => {
    res.status(200).json({
      status: "OK",
      service: "CampusOps Backend",
      timestamp: new Date().toISOString()
    });
  };
  