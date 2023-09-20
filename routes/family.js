const express = require("express");
const router = express.Router();
const familyController = require("../controllers/familyController");
const ROLES = require('../config/roles_list');
const verifyRoles = require('../middleware/verifyRoles');

router
  .route("/")
  .get(familyController.getAllMembers)
  .post(verifyRoles(ROLES.Admin, ROLES.Editor),familyController.createNewMember)
  .put(verifyRoles(ROLES.Admin, ROLES.Editor),familyController.updateMember)
  .delete(verifyRoles(ROLES.Admin),familyController.deleteMember);

router.route("/:id").get(familyController.getMember);

module.exports = router;