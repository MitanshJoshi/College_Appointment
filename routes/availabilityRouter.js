import express from "express"
import { isAuthenticated, isAuthorized } from "../middleware/auth.js";
import { deleteSlot, getAvailability, setAvailability } from "../Controllers/availabilityController.js";

const router = express.Router();

router.post("/setAvailabality",isAuthenticated,isAuthorized("professor"),setAvailability);
router.get("/getAvailability/:professorId",isAuthenticated,getAvailability);
router.delete("/deleteAvailabality",isAuthenticated,isAuthorized("professor"),deleteSlot);

export default router;