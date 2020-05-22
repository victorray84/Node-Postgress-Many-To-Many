
CREATE TABLE messages
(
    id SERIAL PRIMARY KEY,
    text TEXT UNIQUE
);

CREATE TABLE tags
(
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE
);

CREATE TABLE messages_tags
(
    id SERIAL PRIMARY KEY,
    message_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL
);

ALTER TABLE messages_tags 
	ADD CONSTRAINT messages_tags_message_id_fkey FOREIGN KEY
	(
		message_id
	) REFERENCES messages (
		id
	)
    ON UPDATE CASCADE
    ON DELETE CASCADE
;

ALTER TABLE messages_tags 
	ADD CONSTRAINT messages_tags_tag_id_fkey FOREIGN KEY
	(
		tag_id
	) REFERENCES tags (
		id
	)
    ON UPDATE CASCADE
    ON DELETE CASCADE
;


CREATE UNIQUE INDEX idx_messages_tags ON messages_tags (message_id, tag_id);

ALTER TABLE messages_tags 
ADD CONSTRAINT unique_messages_tags 
UNIQUE
USING INDEX idx_messages_tags;

INSERT INTO messages
    (text)
VALUES
    ('first'),
    ('second'),
    ('third');

INSERT INTO tags
    (name)
VALUES
    ('funny'),
    ('happy'),
    ('silly');
