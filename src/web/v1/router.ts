import express from "express";

// Countries Router
import countriesRouter from "./countries/router";

const router = express.Router();

// Countries
router.use("/countries", countriesRouter);

export default router;
