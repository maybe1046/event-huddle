import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    description: { type: String, required: true },
    overview: { type: String, required: true },
    image: { type: String, required: true },
    venue: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    mode: {
      type: String,
      required: true,
      enum: ["online", "offline", "hybrid"],
    },
    audience: { type: String, required: true },
    agenda: { type: [String], required: true },
    organizer: { type: String, required: true },
    tags: { type: [String], required: true },
  },
  { timestamps: true },
);

// Slug generation, date normalization, and field validation
eventSchema.pre("save", function () {
  // Only regenerate slug when title changes (or on first save)
  if (this.isModified("title")) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // strip non-word chars except spaces/hyphens
      .replace(/\s+/g, "-") // collapse spaces to hyphens
      .replace(/-+/g, "-"); // collapse consecutive hyphens

    if (!this.slug) {
      throw new Error("Title must contain at least one alphanumeric character");
    }
  }

  // Normalize date to ISO format (YYYY-MM-DD)
  if (this.isModified("date")) {
    const match = this.date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) {
      throw new Error("Invalid date format. Use YYYY-MM-DD");
    }
    const [, y, m, d] = match;
    const parsed = new Date(Date.UTC(Number(y), Number(m) - 1, Number(d)));
    if (
      parsed.getUTCFullYear() !== Number(y) ||
      parsed.getUTCMonth() + 1 !== Number(m) ||
      parsed.getUTCDate() !== Number(d)
    ) {
      throw new Error("Invalid date value");
    }
    this.date = `${y}-${m}-${d}`;
  }

  // Normalize time to HH:MM 24-hour format
  if (this.isModified("time")) {
    const timeMatch = this.time.match(/^(\d{1,2}):([0-5]\d)\s*(AM|PM)?$/i);
    if (!timeMatch) {
      throw new Error("Invalid time format. Use HH:MM or HH:MM AM/PM");
    }

    let hours = parseInt(timeMatch[1], 10);
    const minutes = timeMatch[2];
    const period = timeMatch[3]?.toUpperCase();

    if (period) {
      if (hours < 1 || hours > 12) {
        throw new Error("Invalid 12-hour time value");
      }
      if (hours === 12) hours = period === "AM" ? 0 : 12;
      else if (period === "PM") hours += 12;
    } else if (hours < 0 || hours > 23) {
      throw new Error("Invalid hour value");
    }

     } else if (hours < 0 || hours > 23) {
       throw new Error("Invalid hour value");
     }

     this.time = `${String(hours).padStart(2, "0")}:${minutes}`;

    this.time = `${String(hours).padStart(2, "0")}:${minutes}`;
  }

  // Validate required fields are non-empty
  const requiredStrings = [
    "title",
    "description",
    "overview",
    "image",
    "venue",
    "location",
    "audience",
    "organizer",
  ] as const;

  for (const field of requiredStrings) {
    if (typeof this[field] === "string" && !this[field].trim()) {
      throw new Error(`${field} cannot be empty`);
    }
  }

  if (!this.agenda.length || this.agenda.some((item) => !item.trim())) {
    throw new Error("agenda cannot contain empty items");
  }
  if (!this.tags.length || this.tags.some((item) => !item.trim())) {
    throw new Error("tags cannot contain empty items");
  }
});

eventSchema.index({ slug: 1 }, { unique: true });

const Event: Model<IEvent> =
  mongoose.models.Event || mongoose.model<IEvent>("Event", eventSchema);

export default Event;
