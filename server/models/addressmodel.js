const mongoose = require('mongoose')

const Address = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["Home", "Work", "Other"],
      default: "Home",
    },

    building: {
      type: String,
      required: true,
    },

    floor: {
      type: String,
    },

    landmark: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model("Address",Address)