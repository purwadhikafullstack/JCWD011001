module.exports = {
  apps: [
    {
      name: "JCWD-0110-01", // Format JCWD-{batchcode}-{groupnumber}
      script: "./projects/server/src/index.js",
      env: {
        NODE_ENV: "production",
        PORT: 3001,
      },
      time: true,
    },
  ],
};
