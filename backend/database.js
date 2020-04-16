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

async function delete_chat(user1, user2){
  sql = "DELETE FROM messages WHERE user_id = ? OR user_id = ?;";
  await pool.execute(sql, [user1, user2]);
  sql = "DELETE FROM users WHERE user_id = ? OR user_id = ?;";
  await pool.execute(sql, [user1, user2]);
}

async function add_user(user_id, partner){
  sql = "INSERT INTO users (user_id, partner) VALUES (?,?);";
  await pool.execute(sql, [user_id, partner]);
}

async function assign_available_user(partner){
  console.log(partner);
  sql = "UPDATE users SET partner = ? WHERE partner = -2 LIMIT 1;";
  await pool.execute(sql,[partner]);

  sql = "SELECT user_id FROM users WHERE partner = ?";
  const [rows, fields] = await pool.execute(sql,[partner]);
  console.log(rows);
  if(rows[0] == undefined){
    available = String(-2);
    console.log("no partner available");
  }else{
    available = rows[0].user_id;
  }
  await add_user(partner, available);
  console.log(available);
  return available;
}

module.exports.add_message = add_message;
module.exports.get_messages = get_messages;
module.exports.delete_chat = delete_chat;
module.exports.add_user = add_user;
module.exports.assign_available_user = assign_available_user;
