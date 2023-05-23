import mongoose from "mongoose";

const DB = "mongodb+srv://pandaycoder:JovJv1Oos3YU29Ce@cluster0.wzetloq.mongodb.net/My_Admin";

const Connection = async () => {
    await mongoose.connect(DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then((res) => console.log("Database Connected"))
        .catch((err) => console.log(err));
};

export default Connection;
