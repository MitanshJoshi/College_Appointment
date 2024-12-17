import express from "express"
import { isAuthenticated, isAuthorized } from "../middleware/auth.js";
import { bookAppointment, cancelAppointment, getAppointments } from "../Controllers/appointmentController.js";

const router = express.Router();

router.post("/bookAppointment",isAuthenticated,isAuthorized("student"),bookAppointment);
router.get("/getAppointments",isAuthenticated,getAppointments);
router.delete("/cancelAppointment/:appointmentId",isAuthenticated,cancelAppointment)

export default router;