import  {Appointment}  from "../models/appointmentSchema.js";
import  Availability from "../models/availabilitySchema.js";

export const bookAppointment = async (req, res) => {
    try {
        const { professorId, timeSlot } = req.body;
        const availability = await Availability.findOne({ professorId });
        if (!availability || !availability.slots.includes(timeSlot)) {
            return res.status(400).json({
                message: "The selected time slot is not available",
            });
        }

        const appointment = new Appointment({
            studentId: req.user._id,
            professorId,
            timeSlot,
        });
        await appointment.save();


        availability.slots = availability.slots.filter(slot => slot !== timeSlot);
        await availability.save();

        res.status(201).json({
            message: "Appointment booked successfully",
            appointment,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to book appointment", error });
    }
};


export const cancelAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const appointment = await Appointment.findById(appointmentId);
        
        
        if (!appointment) {
            return res.status(404).json({
                message: "Appointment not found",
            });
        }
        if(appointment.status === "cancelled")
        {
            return res.json("Appointment is already cancelled")
        }
        if (
            (req.user.role === "student" && appointment.studentId.toString() !== req.user._id.toString()) ||
            (req.user.role === "professor" && appointment.professorId.toString() !== req.user._id.toString())
        ) {
            return res.status(403).json({
                message: "You do not have permission to cancel this appointment",
            });
        }
        appointment.status = "cancelled";
        await appointment.save();
        const availability = await Availability.findOne({ professorId: appointment.professorId });
        if (availability) {
            availability.slots.push(appointment.timeSlot);
            await availability.save();
        }
        res.status(200).json({
            message: "Appointment cancelled successfully",
            appointment,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to cancel appointment", error });
    }
};

export const getAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({
            $or: [
                { studentId: req.user._id },
                { professorId: req.user._id },
            ],
        }).populate("studentId", "username") 
          .populate("professorId", "username");
        res.status(200).json({ appointments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch appointments", error });
    }
};
