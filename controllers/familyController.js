const Family = require("../model/Family");

const getAllMembers = async (req, res) => {
  const family = await Family.find();
  if (!family)
    return res.status(204).json("message", "No family members exist");
  res.json(family);
};

const createNewMember = async (req, res) => {
  if (!req?.body?.firstname || !req?.body?.lastname)
    return res
      .status(400)
      .json({ message: "First and Last names are required" });

  try {
    const result = await Family.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    });

    res.status(201).json(result);
  } catch (err) {
    console.error(err);
  }
};

const updateMember = async (req, res) => {
  const member = await Family.findOne({ _id: req.body.id }).exec();
  if (!member) {
    res
      .status(204)
      .json({ message: `Member with ID ${req.body.id} does not exist` });
  }
  if (req.body?.firstname) {
    member.firstname = req.body.firstname;
  }
  if (req.body?.lastname) {
    member.lastname = req.body.lastname;
  }
  const result = await member.save();
  res.json(result);
};

const deleteMember = async (req, res) => {
  if (!req?.body?.id)
    return res.status(400).json({ message: "ID parameter is required" });
  const member = await Family.findOne({ _id: req.body?.id }).exec();
  if (!member) {
    res
      .status(204)
      .json({ message: `Member with ID ${req.body.id} does not exist` });
  }
  const result = await Family.deleteOne({ _id: req.body?.id });
  res.status(201).json({
    message: `User ${result.firstname} with ${result._id} is deleted`,
  });
};

const getMember = async (req, res) => {
  if (!req?.params?.id)
    return res.status(400).json({ message: "ID parameter is required" });
  const member = await Family.findOne({ _id: req.params?.id }).exec();
  if (!member) {
    res
      .status(204)
      .json({ message: `Member with ID ${req.params.id} does not exist` });
  }
  res.json(member);
};

module.exports = {
  getAllMembers,
  createNewMember,
  updateMember,
  deleteMember,
  getMember,
};
