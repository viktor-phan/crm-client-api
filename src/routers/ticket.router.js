//All are private route, need JWT

const express = require("express");
const {
  insertTicket,
  getTickets,
  getTicketbyId,
  updateClientReply,
  updateStatusClose,
  deleteTicket
} = require("../models/ticket/Ticket.model");
const {
  userAuthorization,
} = require("../middlewares/authorization.middleware");
const { deleteJWT } = require("../helpers/redis.helper");
const router = express.Router();

//Get all tickets data
router.get("/", userAuthorization, async (req, res) => {
  try {
    const userId = req.userId;
    const result = await getTickets(userId);

    return res.json({
      status: "success",
      result,
    });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});

//Get one ticket data
router.get("/:ticketId", userAuthorization, async (req, res) => {
  try {
    const { ticketId } = req.params;
    const clientId = req.userId;
    const result = await getTicketbyId(ticketId, clientId);
    res.json({ result });
  } catch (error) {
    res.json({ message: "error" });
  }
});

//Create a ticket
router.post("/", userAuthorization, async (req, res) => {
  const { subject, sender, message } = req.body;
  const userId = req.userId;
  const ticketObj = {
    clientId: userId,
    subject,
    sender,
    conversations: [
      {
        sender,
        message,
      },
    ],
  };
  const result = await insertTicket(ticketObj);
  if (result._id) {
    return res.json({ message: "Create success" });
  }
  res.json({ message: "Error" });
});

//Update ticket when comment
router.put("/:_id", async (req, res) => {
  try {
    const { _id } = req.params;
    const clientId = req.userId;
    const { sender, message } = req.body;
    const result = await updateClientReply({ _id, clientId});

    if (result._id) {
      return res.json({
        status: "success",
        message: "your message updated",
      });
    }
    res.json({
      status: "error",
      message: "Unable to update your message please try again later",
    });
  } catch (error) {
    res.json({
      status: "error",
      message: "Unable to update your message please try again later",
    });
  }
});

//Update ticket when close edit
router.patch("/close-ticket/:_id", userAuthorization, async (req, res) => {
  try {
    const { _id } = req.params;
    const clientId = req.userId;
    const { sender, message } = req.body;
    const result = await updateStatusClose({ _id, sender, message });

    if (result._id) {
      return res.json({
        status: "success",
        message: "your message closed",
      });
    }
    res.json({
      status: "error",
      message: "Unable to update your message please try again later",
    });
  } catch (error) {
    res.json({
      status: "error",
      message: "Unable to update your message please try again later",
    });
  }
});

//Delete a ticket
router.delete("/:_id", userAuthorization, async (req, res) => {
  try {
    const { _id } = req.params;
    const clientId = req.userId;
  
    const result = await deleteTicket({ _id, clientId });

    return res.json({
      status: "success",
      result,
    });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});

module.exports = router;
