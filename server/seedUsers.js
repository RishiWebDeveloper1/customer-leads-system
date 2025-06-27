// server/seedLeads.js
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const leadSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  source: String,
  status: String, // New, Contacted, Qualified, Lost, Won
  tags: [String],
  notes: String,
  assignedTo: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Lead = mongoose.model("Lead", leadSchema);

const leads = [
  {
    name: "Alice Johnson",
    email: "alice@example.com",
    phone: "9876543210",
    source: "Website",
    status: "New",
    tags: ["Tech", "Urgent"],
    notes: "Interested in product demo",
    assignedTo: "agent@support.com",
  },
  {
    name: "Bob Smith",
    email: "bob@example.com",
    phone: "9123456789",
    source: "Referral",
    status: "Contacted",
    tags: ["Finance"],
    notes: "Asked for pricing details",
    assignedTo: "agent@support.com",
  },
  {
    name: "Charlie Khan",
    email: "charlie@example.com",
    phone: "9012345678",
    source: "LinkedIn",
    status: "Qualified",
    tags: ["Urgent"],
    notes: "Follow up next week",
    assignedTo: "agent@support.com",
  },
];

const seedLeads = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Lead.deleteMany(); // optional: clear existing leads
    await Lead.insertMany(leads);
    console.log("Leads seeded successfully ✅");
    process.exit();
  } catch (err) {
    console.error("Error seeding leads ❌", err);
    process.exit(1);
  }
};

seedLeads();