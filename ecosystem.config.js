module.exports = {
    apps: [{
        name: 'MMMDjangoServer',
        interpreter: __dirname + '/venv/bin/python',
        script: __dirname + '/manage.py',
        args: 'runserver 0.0.0.0:80',
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
            host: require(__dirname + '/credentials.json').server_ip,
            ref: 'origin/develop',
            repo: 'git@github.com:BardinPetr/MassMediaMonitoringSystem.git',
            path: '/home/root/deployment',
            'post-deploy': 'npm i && source venv/bin/activate && venv/bin/pip install -r requirements.txt && npm run-script build && python manage.py collectstatic --noinput && pm2 reload ecosystem.config.js --env production'
        }
    }
};
