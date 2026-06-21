import express from "express";

import {
  createAppointmentController,
  getAppointmentsController, checkSlotAvailabilityController, getAllAppointmentsController, updateAppointmentStatusController
} from "../controllers/appointmentController.js";
import { isDoctor, isRequiredAuth } from "../middleware/authMiddlewares.js";

const router = express.Router();

router.post("/create", createAppointmentController);

router.get( "/doctor/:doctorId", isRequiredAuth, isDoctor, getAllAppointmentsController );

router.get( "/doctor/:doctorId/:appointmentDate",isRequiredAuth, isDoctor, getAppointmentsController );

router.put("/status/:doctorId", isRequiredAuth, isDoctor, updateAppointmentStatusController);

router.post("/check-slot", checkSlotAvailabilityController);


export default router;