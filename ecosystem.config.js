module.exports = {
  apps : [{
    name: 'application-status',
    script: 'src/main.ts',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    args: 'one two',
    exec_mode: 'cluster',
    instances: 2,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'local'
    },
    env_development: {
      NODE_ENV: 'development',
    },
    env_staging: {
      NODE_ENV: 'staging'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],
};
