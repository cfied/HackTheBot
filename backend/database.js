// assumes that there exists a database hackthebot with table messages

const USER = 'message handler';
const PASSWORD = 'HLS56kdllvlj)lj582wP.8rUls8';
const parameters = {
  host: "localhost",
  user: USER,
  password: PASSWORD,
  database: "hackthebot"
};



// user table format:
// "CREATE TABLE users (user_id VARCHAR(255), room_id INT, PRIMARY KEY(user_id));"

// message table format:
// "CREATE TABLE messages (message_id int NOT NULL AUTO_INCREMENT, user_id VARCHAR(255) NOT NULL, room_id INT NOT NULL, content VARCHAR(511) NOT NULL, PRIMARY KEY(message_id));"


async function add_message(user_id, room_id, message_content){
  console.log("add message");
  const mysql = require('mysql2');
  const con = mysql.createConnection(parameters);
  con.config.namedPlaceholders = true;
  sql = "INSERT INTO messages (user_id,room_id,content) VALUES (?,?,?);";
  await con.execute(sql, [user_id, room_id, message_content]);
  await con.end();
}

async function get_messages(room_id){
  const mysql = require('mysql2/promise');
  const con = await mysql.createConnection(parameters);
  con.config.namedPlaceholders = true;
  sql = "SELECT * FROM messages WHERE room_id = ?;";
  const [rows, fields] = await con.execute(sql,[room_id]);
  console.log("got results");
  console.log("Get messages: " + JSON.stringify(rows[0]));
  await con.end();
  return rows;
}

async function delete_room(room_id){
  console.log("delete room");
  const mysql = require('mysql2');
  const con = await mysql.createConnection(parameters);
  con.config.namedPlaceholders = true;
  sql = "DELETE FROM messages WHERE room_id = ?;";
  await con.execute(sql, [room_id]);
  await con.end();
}

module.exports.add_message = add_message;
module.exports.get_messages = get_messages;
module.exports.delete_room = delete_room;
