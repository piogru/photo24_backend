import MongoStore from "connect-mongo";

const connectionString = process.env.DB_URI || "";
const mongoStore = new MongoStore({ mongoUrl: connectionString });

export default mongoStore;
