const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/messgaetags", async (req, res, next) => {
  try {
    await db.query("BEGIN");

    const message = await db.query(
      `INSERT INTO messages (text) VALUES ($1)  RETURNING *`,
      [req.body.messagename]
    );

    const message_id = message.rows[0].id;

    await Promise.all(
      req.body.tagnames.map(async (tag_id) => {
        await db.query(
          `INSERT INTO messages_tags (message_id, tag_id) VALUES ($1, $2) ON CONFLICT  ON CONSTRAINT unique_messages_tags  DO NOTHING `,
          [message_id, tag_id]
        );
      })
    );

    await db.query("COMMIT");

    res.json({ Success: true });
  } catch (error) {
    console.log(error);
    await db.query("ROLLBACK");
    if (error.code === "23505") {
      var err = new Error("Duplicate message name exits");
      err.status = 409;

      return next(err);
    }

    return next(error);
  }
});

router.get("/getMessageWithTags/:id", async (req, res, next) => {
  try {
    const message = await db.query(
      `SELECT m.id, m.text, t.id as tag_id, t.name FROM messages m INNER JOIN messages_tags ON messages_tags.message_id = m.id INNER JOIN tags t ON t.id = messages_tags.tag_id WHERE m.id = $1`,
      [req.params.id]
    );

    if (message.rowCount == 0) {
      var err = new Error("Id not found");
      err.status = 404;

      return next(err);
    }

    var messageMap = {};
    var messages = [];

    message.rows.forEach((row) => {
      console.log(row);
      var messageByName = messageMap[row.text];
      if (!messageByName) {
        messageByName = {
          id: row.id,
          name: row.text,
          tags: [],
        };

        messageMap[row.text] = messageByName;
        messages.push(category);
      }

      messageByName.tags.push({
        id: row.tag_id,
        name: row.name,
      });
    });

    res.json({ data: messages });
  } catch (error) {
    return next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const rows = await db.query(`SELECT * FROM messages WHERE id = $1`, [
      req.params.id,
    ]);
    console.log(rows);

    if (rows.rowCount == 0) {
      var err = new Error("Id not found");
      err.status = 404;

      return next(err);
    }

    await db.query("BEGIN");
    var tagids = [];
    await db.query("UPDATE messages SET text = $1 WHERE id = $2", [
      req.body.name,
      req.params.id,
    ]);
    await Promise.all(
      req.body.tags.map(async (tag_id) => {
        tagids.push(tag_id);
        await db.query(
          `INSERT INTO messages_tags (message_id, tag_id) VALUES ($1, $2) ON CONFLICT  ON CONSTRAINT unique_messages_tags  DO NOTHING `,
          [req.params.id, tag_id]
        );
      })
    );

    const deleteTags =
      "DELETE FROM messages_tags WHERE message_id = $1 AND tag_id NOT  IN (" +
      tagids.join(",") +
      ")";
    await db.query(deleteTags, [req.params.id]);

    await db.query("COMMIT");

    res.json({ Success: "Updated successfully" });
  } catch (error) {
    await db.query("ROLLBACK");
    if (error.code === "23505") {
      var err = new Error("Duplicate message name exits");
      err.status = 409;

      return next(err);
    }
    return next(error);
  }
});

module.exports = router;
