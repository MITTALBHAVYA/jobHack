import App from "./app.js";
import cloudinary from "cloudinary";
import dotenv from "dotenv";

class Server {
  constructor() {
    this.loadEnv();
    this.configureCloudinary();
    this.port = process.env.PORT || 3000;
  }

  loadEnv() {
    dotenv.config({ path: './config/config.env' });
  }

  configureCloudinary() {
    cloudinary.v2.config({
      cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
      api_key: process.env.CLOUDINARY_CLIENT_API,
      api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
    });
  }

  start() {
    App.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }
}

const server = new Server();
server.start();
