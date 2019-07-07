module.exports = {
    apps: [{
        name: 'MMMDjangoServer',
        script: 'gunicorn home.wsgi.prod',
        instances: 1,
        autorestart: true,
        watch: false,
        env: {
            NODE_ENV: 'development'
        },
        env_production: {
            NODE_ENV: 'production'
        }
    }],
    deploy: {
        production: {
            user: 'root',
            host: '188.120.231.51',
            ref: 'origin/develop',
            repo: 'git@github.com:BardinPetr/MassMediaMonitoringSystem.git',
            path: '/home/root/deployment',
            'post-deploy': 'npm i && source venv/bin/activate && venv/bin/pip install -r requirements.txt && pm2 reload ecosystem.config.js --env production'
        }
    }
};
