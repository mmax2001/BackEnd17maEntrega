module.exports = {
    apps: [{
            name: "server1",
            script: "./app.js",
            watch: true,
            env: {
                PORT: 8080
            },
            args: "fork",
            node_args: "--expose-gc"
        },
        {
            name: "server2",
            script: "./app.js",
            watch: true,
            env: {
                PORT: 8081
            },
            args: "fork",
            node_args: "--expose-gc"
        },
        {
            name: "server3",
            script: "./app.js",
            watch: true,
            env: {
                PORT: 8082
            },
            args: "fork",
            node_args: "--expose-gc"
        },
        {
            name: "server4",
            script: "./app.js",
            watch: true,
            env: {
                PORT: 8083
            },
            args: "cluster",
            node_args: "--expose-gc"
        }
    ]
}