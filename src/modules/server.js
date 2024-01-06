/* eslint-disable no-undef */

import http from "http";
import cors from "cors";
import bodyParser from "body-parser";

export default function server(app) {
  const PORT = process.env.PORT || 3000;

  const server = http.createServer(app);

  app.use(cors());
  app.use(bodyParser.json());

  server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });

  process.on("SIGINT", () => {
    console.log("\nReceived SIGINT (Ctrl+C). Initiating graceful shutdown...");

    server.close(() => {
      console.log("Server closed. Exiting process.");
      process.exit(0);
    });
  });
}
