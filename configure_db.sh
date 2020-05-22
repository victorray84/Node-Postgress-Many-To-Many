echo "Configuring messages-tags-node"

dropdb -U postgres messages-tags-node
createdb -U postgres messages-tags-node

psql -U postgres messages-tags-node < ./db/messages-tags-node.sql



echo "messages-tags-node"