import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest";
import { GenreController } from "./genre.controller";
import { createGenreZodSchema, updateGenreZodSchema } from "./genre.validation";

// Auth lagle: import { checkAuth } from "../../middleware/checkAuth";
// router.post("/", checkAuth(Role.ADMIN), validateRequest(...), GenreController.createGenre);

const router = Router();

router.get("/", GenreController.getAllGenres);
router.get("/:id", GenreController.getGenreById);
router.post("/", validateRequest(createGenreZodSchema), GenreController.createGenre);
router.patch("/:id", validateRequest(updateGenreZodSchema), GenreController.updateGenre);
router.delete("/:id", GenreController.deleteGenre);
router.delete("/hard/:id", GenreController.hardDeleteGenre);

export const GenreRoutes = router;
