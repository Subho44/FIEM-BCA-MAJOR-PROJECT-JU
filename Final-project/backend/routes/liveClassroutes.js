const express = require("express");
const router = express.Router();
const lctrl = require("../controller/liveClassController");
const { protect, allowRoles } = require("../middleware/authMiddleware");

router.post("/",protect,allowRoles("admin","instructor"),lctrl.createLiveclass);
router.get("/",lctrl.getliveclasses);
router.get("/:id",lctrl.getsingelliveclasses);

module.exports = router;