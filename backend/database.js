// assumes that there exists a database hackthebot with table messages

const USER = 'message handler';
const PASSWORD = 'HLS56kdllvlj)lj582wP.8rUls8';

const mysql = require('mysql2/promise');
const pool = mysql.createPool({
  host: "localhost",
  user: USER,
  password: PASSWORD,
  database: "hackthebot"
});
pool.pool.config.connectionConfig.namedPlaceholders = true;

// user table format:
// "CREATE TABLE users (user_id VARCHAR(255), partner VARCHAR(255), PRIMARY KEY(user_id));"

// message table format:
// "CREATE TABLE messages (message_id int NOT NULL AUTO_INCREMENT, user_id VARCHAR(255) NOT NULL, content VARCHAR(511) NOT NULL, PRIMARY KEY(message_id));"


async function add_message(user_id, message_content){
  sql = "INSERT INTO messages (user_id,content) VALUES (?,?);";
  await pool.execute(sql, [user_id, message_content]);
}

async function get_messages(partner){
  sql = "SELECT * FROM messages WHERE user_id = ?;";
  const [rows, fields] = await pool.execute(sql,[partner]);
  return rows;
}

async function delete_messages(user1, user2){
  sql = "DELETE FROM messages WHERE user_id = ? OR user_id = ?;";
  await pool.execute(sql, [user1, user2]);
}

module.exports.add_message = add_message;
module.exports.get_messages = get_messages;
module.exports.delete_messages = delete_messages;
