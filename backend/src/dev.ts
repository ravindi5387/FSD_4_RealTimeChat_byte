import server from "./server";
import { env } from "./config/env";

server.listen(env.port, "0.0.0.0", () => {
  console.log(`Real-time Chat API running on http://localhost:${env.port}`);
});
