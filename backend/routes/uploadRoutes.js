const router = require("express").Router();

router.get("/", (req, res) => {
  res.json({
    message: "Upload Route Working",
  });
});

module.exports = router;