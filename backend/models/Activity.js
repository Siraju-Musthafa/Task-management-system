const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },

    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    action: {
      type: String,
      enum: [
        "created",
        "assigned",
        "updated",
        "status_changed",
        "priority_changed",
        "completed",
        "deleted",
      ],
      required: true,
    },

    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

activitySchema.index({
  task: 1,
  createdAt: -1,
});

module.exports = mongoose.model("Activity", activitySchema);
