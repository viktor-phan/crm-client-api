const { TicketSchema } = require("./Ticket.Schema");
const insertTicket = (ticketObj) => {
  return new Promise((resolve, reject) => {
    try {
      TicketSchema(ticketObj)
        .save()
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          reject(error);
        });
    } catch (error) {
      reject(error);
    }
  });
};

const getTickets = (clientId) => {
  //have to use clientId instead of userId
  return new Promise((resolve, reject) => {
    try {
      TicketSchema.find({ clientId })
        .then((data) => resolve(data))
        .catch((err) => reject(err));
    } catch (error) {
      reject(error);
    }
  });
};

const getTicketbyId = (_id, clientId) => {
  //have to use clientId instead of userId
  return new Promise((resolve, reject) => {
    try {
      TicketSchema.find({ _id, clientId })
        .then((data) => resolve(data))
        .catch((err) => reject(err));
    } catch (error) {
      reject(error);
    }
  });
};
const updateClientReply = ({ _id, sender, message }) => {
  return new Promise((resolve, reject) => {
    try {
      TicketSchema.findOneAndUpdate(
        { _id },
        {
          status: "Pending operator response",
          $push: {
            conversations: { sender, message },
          },
        },
        { new: true }
      )
        .then((data) => resolve(data))
        .catch((error) => reject(error));
    } catch (error) {
      reject(error);
    }
  });
};

const updateStatusClose = ({ _id, clientId }) => {
  return new Promise((resolve, reject) => {
    try {
      TicketSchema.findOneAndUpdate(
        { _id },
        {
          status: "Closed",
        },
        { new: true }
      )
        .then((data) => resolve(data))
        .catch((error) => reject(error));
    } catch (error) {
      reject(error);
    }
  });
};
const deleteTicket = ({ _id, clientId }) => {
    return new Promise((resolve, reject) => {
      try {
        TicketSchema.findOneAndDelete(
          { _id, clientId }
        )
          .then((data) => resolve(data))
          .catch((error) => reject(error));
      } catch (error) {
        reject(error);
      }
    });
}

module.exports = {
  insertTicket,
  getTickets,
  getTicketbyId,
  updateStatusClose,
  updateClientReply,
  deleteTicket
};
