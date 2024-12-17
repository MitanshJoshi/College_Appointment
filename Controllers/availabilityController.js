import Availability from "../models/availabilitySchema.js";

export const setAvailability = async (req, res) => {
    try {
        const { slots } = req.body;
        if (!slots || !Array.isArray(slots) || slots.length === 0) {
            return res.status(400).json({ message: "Slots array is required" });
        }
        const availability = await Availability.findOneAndUpdate(
            { professorId: req.user._id },
            { professorId: req.user._id, slots },
            { upsert: true, new: true }
        );
        res.status(200).json({
            message: "Availability updated successfully",
            availability,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while updating availability", error });
    }
};

export const getAvailability = async (req, res) => {
    try {
        const { professorId } = req.params;

        const availability = await Availability.findOne({ professorId }).populate("professorId", "username");
        if (!availability) {
            return res.status(404).json({ message: "No availability found for this professor" });
        }

        res.status(200).json({
            professor: availability.professorId.username,
            slots: availability.slots,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while fetching availability", error });
    }
};

export const deleteSlot = async (req, res) => {
    try {
        const { slot } = req.body;

        const availability = await Availability.findOne({ professorId: req.user._id });
        if (!availability) {
            return res.status(404).json({ message: "No availability found" });
        }

        availability.slots = availability.slots.filter((s) => s !== slot);
        await availability.save();

        res.status(200).json({
            message: "Slot removed successfully",
            availability,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while deleting the slot", error });
    }
};
