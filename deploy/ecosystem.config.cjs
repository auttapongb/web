module.exports = {
  apps: [{
    name: "veritytech-web",
    script: "python3",
    args: "-m http.server 8500",
    cwd: "/var/www/veritytech",
    instances: 1,
    autorestart: true,
    watch: false,
    env: { NODE_ENV: "production" },
  }],
};
