
import express from "express";
import authRoutes from "./routes/auth"

const app = express();

app.use(express.json())

app.get("/api/health", (req, res) => {
    res.json({ message: "Server is running" })
})

app.use("/api/auth", authRoutes);

app.listen(5000, () => {
    console.log("Server is running on port 5000");

})