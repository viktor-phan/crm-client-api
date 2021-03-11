const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TicketSchema = new Schema({
  clientId: {
    type: Schema.Types.ObjectId,
  },
  subject: {
    type: String,
    maxlength: 50,
    require: true,
    default: ""
  },
  openAt: {
    type: Date,
    require: true,
    default: Date.now(),
  },
  status: {
    type: String,
    maxlength: 50,
    require: true,
    default: "Pending ..."
  },
  sender: {
    type: String,
    maxlength: 50,
    require: true,
    default: ""
  },
  conversations: [
    {
      sender: {
        type: String,
        maxlength: 50,
        require: true,
        default: ""
      },
      message: {
        type: String,
        maxlength: 500,
        require: true,
        default: ""
      },
      msgAt: {
        type: Date,
        require: true,
        default: Date.now(),
      },
    },
  ],
});

module.exports = { TicketSchema: mongoose.model("ticket", TicketSchema) };
