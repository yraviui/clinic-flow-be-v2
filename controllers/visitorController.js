import axios from "axios";
import Visitor from "../models/visitors.js";

export const trackVisitor = async (req, res) => {
  try {
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket.remoteAddress ||
      req.ip;

    // Remove IPv6 prefix if present
    const cleanIp = ip.replace("::ffff:", "");

    const geoResponse = await axios.get(
      `http://ip-api.com/json/${cleanIp}`
    );

    const geo = geoResponse.data;

    await Visitor.create({
      siteName: req.body.siteName,
      ip: cleanIp,
      city: geo.city,
      country: geo.country,
      countryCode: geo.countryCode,
      region: geo.regionName,
      timezone: geo.timezone,
      userAgent: req.headers["user-agent"],
      page: req.body.page || "/",
    });

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};