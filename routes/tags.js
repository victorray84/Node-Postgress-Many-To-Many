const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", async (req, res, next) => {
  try {
    const data = await db.query(`SELECT * FROM tags`);
    res.json(data.rows);
  } catch (error) {
    return next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const result = await db.query(
      `INSERT INTO tags (name) VALUES ($1) RETURNING *`,
      [req.body.name]
    );
    res.json(result.rows[0]);
  } catch (error) {
    return next(error);
  }
});

router.post("/craetetagWithMessages", async (req, res, next) => {
  try {
    await db.query("BEGIN");
    console.log(req.body.tagname);
    const tags = await db.query(
      `INSERT INTO tags (name) VALUES ($1) ON CONFLICT (name) DO NOTHING RETURNING *`,
      [req.body.tagname]
    );

    const tag_id = tags.rows[0].id;

    await Promise.all(
      req.body.messages.map(async (message_id) => {
        await db.query(
          `INSERT INTO messages_tags (message_id, tag_id) VALUES ($1, $2) ON CONFLICT (message_id, tag_id) DO NOTHING `,
          [message_id, tag_id]
        );
      })
    );

    await db.query("COMMIT");

    res.json({ Success: true });
  } catch (error) {
    await db.query("ROLLBACK");
    return next(error);
  }
});

module.exports = router;
