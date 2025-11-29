import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Simple Ultraviolet-style proxy endpoint
app.all("/proxy/*", async (req, res) => {
  try {
    const targetUrl = req.url.replace("/proxy/", "");

    const response = await fetch(targetUrl, {
      method: req.method,
      headers: req.headers,
      body: req.method === "GET" ? null : req.body
    });

    const data = await response.arrayBuffer();
    res.status(response.status);
    res.send(Buffer.from(data));
  } catch (err) {
    res.status(500).send("Proxy Error: " + err.message);
  }
});

app.get("/", (req, res) => {
  res.send("Proxy server is running correctly.");
});

app.listen(PORT, () => {
  console.log(`Proxy running on port ${PORT}`);
});
