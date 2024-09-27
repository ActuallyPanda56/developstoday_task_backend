import express from "express";
import { getCountries, getCountryFlags, getCountryInfo } from "./controller/countries";
const router = express.Router();

router.get("/", getCountries);

router.get("/flags", getCountryFlags);

router.get("/:countryCode", getCountryInfo);

export default router;
