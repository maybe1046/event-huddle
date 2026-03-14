import mongoose, { Schema, Types, type Document, type Model } from "mongoose";
import Event from "./event.model";

export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

// Email regex following RFC 5322 simplified pattern
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const bookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (v: string) => EMAIL_REGEX.test(v),
        message: "Invalid email format",
      },
    },
  },
  { timestamps: true },
);

// Verify the referenced event exists before saving
bookingSchema.pre("save", async function () {
  if (this.isModified("eventId")) {
    const eventExists = await Event.exists({
      _id: this.eventId,
    });
    if (!eventExists) {
      throw new Error("Referenced event does not exist");
    }
  }
});

// Index on eventId for faster booking lookups by event
bookingSchema.index({ eventId: 1 });

const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>("Booking", bookingSchema);

export default Booking;
