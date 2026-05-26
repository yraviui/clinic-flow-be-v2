export const generateSlots = (start, end, duration) => {

    const slots = [];

    let [startHour, startMinute] =
        start.split(":").map(Number);

    let [endHour, endMinute] =
        end.split(":").map(Number);

    let startTotal = startHour * 60 + startMinute;

    let endTotal = endHour * 60 + endMinute;

    while (startTotal < endTotal) {

        const hour = Math.floor(startTotal / 60);

        const minute = startTotal % 60;

        const formattedHour = hour % 12 || 12;

        const ampm = hour >= 12 ? "PM" : "AM";

        const formattedMinute =
            minute.toString().padStart(2, "0");

        slots.push(
            `${formattedHour}:${formattedMinute} ${ampm}`
        );

        startTotal += duration;
    }

    return slots;
};