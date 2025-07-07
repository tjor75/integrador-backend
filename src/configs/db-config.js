let DBConfig;

if (!process.env.DB_CONNECTION_STRING) {
    DBConfig = {
        host        : process.env.DB_HOST     ?? "",
        database    : process.env.DB_DATABASE ?? "",
        user        : process.env.DB_USER     ?? "",
        password    : process.env.DB_PASSWORD ?? "",
        port        : process.env.DB_PORT     ?? 5432
    };
} else {
    DBConfig = { connectionString: process.env.DB_CONNECTION_STRING };
}

export default DBConfig;