import express from "express";

import { saveDoctorScheduleController, getAvailableSlotsController } from "../controllers/doctorScheduleController.js";
import { AllDoctorsController, createPatientsController, patientsController, getPatientByIdController, updatePatientByIdController, deletePatientByIdController } from '../controllers/patientController.js'

import { isDoctor, isRequiredAuth } from "../middleware/authMiddlewares.js";

const router = express.Router();

router.get('/all-doctors', AllDoctorsController)

// SAVE SCHEDULE
router.post("/save-schedule", isRequiredAuth, isDoctor, saveDoctorScheduleController);
// GET AVAILABLE SLOTS
router.post("/available-slots", getAvailableSlotsController);

router.post('/patients', isRequiredAuth, isDoctor, createPatientsController)
router.get('/patients', isRequiredAuth, isDoctor, patientsController)
router.get('/patients/:id', isRequiredAuth, isDoctor, getPatientByIdController)
router.put('/patients/:id', isRequiredAuth, isDoctor, updatePatientByIdController)
router.delete('/patients/:id', isRequiredAuth, isDoctor, deletePatientByIdController)

export default router;