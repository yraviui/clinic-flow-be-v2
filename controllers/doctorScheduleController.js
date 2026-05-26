import DoctorScheduleModel from "../models/DoctorScheduleModel.js";
import AppointmentModel from "../models/appointments.js";
import { generateSlots } from "../utils/generateSlots.js";


// CREATE OR UPDATE SCHEDULE
export const saveDoctorScheduleController = async (req, res) => {

    try {

        const {
            morningStart,
            morningEnd,
            eveningStart,
            eveningEnd,
            slotDuration
        } = req.body;

        const doctorId = req.user._id;

        let schedule = await DoctorScheduleModel.findOne({
            doctorId
        });

        if (schedule) {

            schedule.morningStart = morningStart;
            schedule.morningEnd = morningEnd;
            schedule.eveningStart = eveningStart;
            schedule.eveningEnd = eveningEnd;
            schedule.slotDuration = slotDuration;

            await schedule.save();

        } else {

            schedule = await DoctorScheduleModel.create({
                doctorId,
                morningStart,
                morningEnd,
                eveningStart,
                eveningEnd,
                slotDuration
            });

        }

        res.status(200).send({
            success: true,
            message: "Schedule saved successfully",
            schedule
        });

    } catch (error) {

        res.status(500).send({
            success: false,
            message: "Error saving schedule",
            error
        });

    }

};


// GET AVAILABLE SLOTS
export const getAvailableSlotsController = async (req, res) => {

  try {

    const { doctorId, appointmentDate } = req.body;

    // VALIDATION
    if (!doctorId || !appointmentDate) {

      return res.status(400).send({
        success: false,
        message: "Doctor ID and appointment date are required",
      });

    }

    // FIND DOCTOR SCHEDULE
    const schedule = await DoctorScheduleModel.findOne({
      doctorId,
    });

    if (!schedule) {

      return res.status(404).send({
        success: false,
        message: "Doctor schedule not found",
      });

    }

    // GENERATE SLOTS FUNCTION
    const generateSlots = (
      startTime,
      endTime,
      duration
    ) => {

      const slots = [];

      // CONVERT HH:MM TO MINUTES
      const convertToMinutes = (time) => {

        const [hours, minutes] =
          time.split(":").map(Number);

        return hours * 60 + minutes;
      };

      // CONVERT MINUTES TO 12-HOUR FORMAT
      const convertTo12Hour = (minutes) => {

        let hours = Math.floor(minutes / 60);

        let mins = minutes % 60;

        const ampm =
          hours >= 12 ? "PM" : "AM";

        hours = hours % 12;

        if (hours === 0) {
          hours = 12;
        }

        return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")} ${ampm}`;
      };

      let start =
        convertToMinutes(startTime);

      const end =
        convertToMinutes(endTime);

      while (start < end) {

        slots.push(
          convertTo12Hour(start)
        );

        start += duration;
      }

      return slots;
    };

    // MORNING SLOTS
    const morningSlots = generateSlots(
      schedule.morningStart,
      schedule.morningEnd,
      schedule.slotDuration
    );

    // EVENING SLOTS
    const eveningSlots = generateSlots(
      schedule.eveningStart,
      schedule.eveningEnd,
      schedule.slotDuration
    );

    // ALL SLOTS
    const allSlots = [
      ...morningSlots,
      ...eveningSlots,
    ];

    // FIND BOOKED APPOINTMENTS
    const bookedAppointments =
      await AppointmentModel.find({
        doctorId,
        appointmentDate,
      });

    // GET BOOKED SLOT TIMES
    const bookedSlots =
      bookedAppointments.map(
        (appointment) => appointment.slot
      );

    // REMOVE BOOKED SLOTS
    const availableSlots =
      allSlots.filter(
        (slot) =>
          !bookedSlots.includes(slot)
      );

    res.status(200).send({
      success: true,
      availableSlots,
      bookedSlots,
      allSlots,
    });

  } catch (error) {

    console.log(error);

    res.status(500).send({
      success: false,
      message: "Error fetching available slots",
      error: error.message,
    });

  }
};