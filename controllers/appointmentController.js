import AppointmentModel from "../models/appointments.js";
import transporter from "../utils/mailer.js";


// CREATE APPOINTMENT
export const createAppointmentController = async (req, res) => {

  try {

    const appointment = await AppointmentModel.create(req.body);

    res.status(201).send({
      success: true,
      message: "Appointment created successfully",
      appointment,
    });

  } catch (error) {

    console.log(error);

    res.status(500).send({
      success: false,
      message: "Error in create appointment",
      error,
    });
  }
};


// GET APPOINTMENTS
export const getAppointmentsController = async (req, res) => {
  try {
    const { doctorId, date } = req.params;

    if (!doctorId) {
      return res.status(400).send({
        success: false,
        message: "Doctor ID is required",
      });
    }

    let query = { doctorId };

    // ✅ If date is provided → filter by full day range
    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);

      const end = new Date(date);
      end.setHours(23, 59, 59, 999);

      query.appointmentDate = {
        $gte: start,
        $lte: end,
      };
    }

    const appointments = await AppointmentModel.find(query)
      .sort({ appointmentDate: 1 });

    return res.status(200).send({
      success: true,
      total: appointments.length,
      appointments,
    });

  } catch (error) {
    console.log("Get Appointments Error:", error);

    return res.status(500).send({
      success: false,
      message: "Error fetching appointments A",
      error,
    });
  }
};

export const checkSlotAvailabilityController = async (req, res) => {

  try {

    const { doctorId, appointmentDate, slot } = req.body;

    if (!doctorId || !appointmentDate || !slot) {
      return res.status(400).send({
        success: false,
        message: "Missing required fields",
      });
    }

    const existing = await AppointmentModel.findOne({
      doctorId,
      appointmentDate,
      slot,
    });

    if (existing) {
      return res.status(200).send({
        success: false,
        available: false,
        message: "Slot already booked",
      });
    }

    return res.status(200).send({
      success: true,
      available: true,
      message: "Slot is available",
    });

  } catch (error) {

    console.log(error);

    res.status(500).send({
      success: false,
      message: "Error checking slot",
    });
  }
};

// =======================================
// GET ALL APPOINTMENTS
// =======================================
export const getAllAppointmentsController =
  async (req, res) => {
    try {
      const { doctorId } = req.params;

      const appointments =
        await AppointmentModel.find({
          doctorId,
        }).sort({
          appointmentDate: 1,
        });

      res.status(200).send({
        success: true,
        total: appointments.length,
        appointments,
      });
    } catch (error) {
      console.log(error);

      res.status(500).send({
        success: false,
        message:
          "Error fetching appointments",
        error,
      });
    }
  };

// =======================================
// UPDATE STATUS + SEND EMAIL
// =======================================
export const updateAppointmentStatusController =
  async (req, res) => {
    try {
      const { id } = req.params;

      const { status } = req.body;

      // VALIDATE STATUS
      if (
        ![
          "pending",
          "confirmed",
          "completed",
          "cancelled",
        ].includes(status)
      ) {
        return res.status(400).send({
          success: false,
          message: "Invalid status",
        });
      }

      // FIND APPOINTMENT
      const appointment =
        await AppointmentModel.findById(
          id
        );

      if (!appointment) {
        return res.status(404).send({
          success: false,
          message:
            "Appointment not found",
        });
      }

      // UPDATE STATUS
      appointment.status = status;

      await appointment.save();

      // =====================================
      // SEND MAIL WHEN CONFIRMED
      // =====================================
      if (status === "confirmed") {
        await transporter.sendMail({
          from:
            process.env.EMAIL_USER,

          to: appointment.patientEmail,

          subject:
            "Doctor Appointment Confirmed",

          html: `
          <h2>Appointment Confirmed</h2>

          <p>Hello ${appointment.patientName},</p>

          <p>Your appointment has been confirmed successfully.</p>

          <p>
            <b>Date:</b>
            ${new Date(
              appointment.appointmentDate
            ).toLocaleDateString()}
          </p>

          <p>
            <b>Slot:</b>
            ${appointment.slot}
          </p>

          <p>
            Thank you.
          </p>
          `,
        });
      }

      // =====================================
      // SEND MAIL WHEN CANCELLED
      // =====================================
      if (status === "cancelled") {
        await transporter.sendMail({
          from:
            process.env.EMAIL_USER,

          to: appointment.patientEmail,

          subject:
            "Doctor Appointment Cancelled",

          html: `
          <h2>Appointment Cancelled</h2>

          <p>Hello ${appointment.patientName},</p>

          <p>
            Your appointment has been cancelled.
          </p>

          <p>
            <b>Date:</b>
            ${new Date(
              appointment.appointmentDate
            ).toLocaleDateString()}
          </p>

          <p>
            <b>Slot:</b>
            ${appointment.slot}
          </p>
          `,
        });
      }

      // =====================================
      // SEND MAIL WHEN COMPLETED
      // =====================================
      if (status === "completed") {
        await transporter.sendMail({
          from:
            process.env.EMAIL_USER,

          to: appointment.patientEmail,

          subject:
            "Appointment Completed",

          html: `
          <h2>Appointment Completed</h2>

          <p>Hello ${appointment.patientName},</p>

          <p>
            Your appointment has been completed successfully.
          </p>

          <p>
            Thank you for visiting.
          </p>
          `,
        });
      }

      res.status(200).send({
        success: true,
        message:
          "Appointment status updated",
        appointment,
      });
    } catch (error) {
      console.log(error);

      res.status(500).send({
        success: false,
        message:
          "Error updating appointment status",
        error,
      });
    }
  };
