export default {
  up: (_req, res) => {
    res.json({}).status(200);
  },

  health: (_req, res) => {
    res
      .json({
        service: "xianfires-api-v1",
        version: process.env.npm_package_version ?? "unknown",
        uptime: Math.floor(process.uptime()),
        timestamp: new Date().toISOString(),
      })
      .status(200);
  },
};
