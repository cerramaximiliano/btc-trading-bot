module.exports = {
    apps: [
        {
            name: 'btc-admin',
            script: './server/server.js',
            env: {
                PORT: 3030
            },
            exec_mode: 'fork',
            instance: 1,
            kill_timeout: 4000,
            listen_timeout: 5000,
            wait_ready: true
        }
    ]
}