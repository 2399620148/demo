// https://nuxt.com/docs/api/configuration/nuxt-config

export default {
    app: {
        // pageTransition: { name: 'page', mode: 'out-in' }
        buildAssetsDir: "static",
        head: {
        }
    },

    nitro: {
        plugins: [
            '~/server/plugins/nitroPlugin'
        ]
    },
    
    runtimeConfig: {
        env: 'development',
        salt: 'zhangsanfeng',
        authorization: 'w54ydqubpxoxzormdlv2hgsu7rmkih49',

        redisServer: "hx-redis-test.redis.rds.aliyuncs.com",
        redisSecret: "Hxacc2023",
        dbServer: "http://dev-db-666.zhifa315.com/learning",
        appCode: "41bb4fb6d9c647239bf14f1d436427b9",
        dbExamServer: "http://dev-db-666.zhifa315.com/examing", // 远端数据库ORM服务 new

        aliyunId: "LTAI5tEyAPaSEkCekEFXt2za",
        aliyunSecret: "rVFFefSlVUNvXVQVJ6Tj375sO7G7j7",

        // Keys within public are also exposed client-side
        public: {
            apiBase: '/api'
        }
    },

    modules: [
        '@nuxtjs/tailwindcss',
    ],

    tailwindcss: {
        // add '~tailwind.config` alias
        exposeConfig: true
    },
    experimental: { 
        treeshakeClientOnly: false
    },
}
