module.exports = {
  apps: [
    {
      name: 'blog-backend',
      cwd: './backend',
      script: 'src/server.js',
      interpreter: 'node',
      watch: false,
      env_production: {
        NODE_ENV: 'production',
        PORT: 4000,
      },
    },
    {
      name: 'blog-frontend',
      cwd: './frontend',
      script: 'npm',
      args: 'run start',
      watch: false,
      env_production: {
        NODE_ENV: 'production',
        PORT: 3200,
      },
    },
  ],
};
