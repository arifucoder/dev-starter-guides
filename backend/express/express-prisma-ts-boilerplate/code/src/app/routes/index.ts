import { Router } from "express";
import { GenreRoutes } from "../module/genre/genre.route";

const router = Router();

// notun module add korle ekhane register koro
router.use("/genres", GenreRoutes);

export const IndexRoutes = router;
