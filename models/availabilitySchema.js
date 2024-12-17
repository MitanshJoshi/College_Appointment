import mongoose from "mongoose";

const AvailabilitySchema = new mongoose.Schema({
    professorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    slots: {
        type: [String],
        required: true,
        validate: {
            validator: function (slots) {
                return slots.every(slot => /^([01]?\d|2[0-3]):[0-5]\d$/.test(slot));
            },
            message: "Invalid time slot format. Use HH:mm format.",
        },
    },
});

const Availability = mongoose.model("Availability", AvailabilitySchema);
export default Availability;
