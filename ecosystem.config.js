module.exports = {
    apps: [{
        name: 'MMMDjangoServer',
        interpreter: __dirname + '/venv/bin/python',
        script: __dirname + '/manage.py',
        args: 'runserver 127.0.0.1:8000',
        instances: 1,
        autorestart: true,
        watch: true,
        max_memory_restart: '1.8G',
        env: {
            NODE_ENV: 'development'
        },
        env_production: {
            NODE_ENV: 'production'
        }
    }],
    deploy: {
        production: {
            user: 'bardin.petr',
            host: '188.120.231.51',
            ref: 'origin/develop',
            repo: 'git@github.com:BardinPetr/MassMediaMonitoringSystem.git',
            path: '/var/www/production',
            'post-deploy': 'npm i && python3.6 -m virtualenv -p python3 venv && source venv/bin/activate && venv/bin/pip install -r requirements.txt && pm2 reload ecosystem.config.js --env production'
        }
    }
};
