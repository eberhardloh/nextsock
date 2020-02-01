const sql = require('sql-template-strings');

const mysql = require('serverless-mysql')({
    config: {
        host     : process.env.DBHOST     || "localhost",
        port     : process.env.DBPORT     || 3306,
        user     : process.env.DBUSERNAME || "username",
        password : process.env.DBPASSWORD || "password",
        database : process.env.DBDATABASE || "database"
    }
});

/*
 * SELECT returns [ {}, {} ]
 * INSERT, UPDATE, DELETE returns {}
 */

const query = async (query, key = '') => {
    try {
       // console.log('QUERY ' + JSON.stringify(query));
        const results = await mysql.query(query);
        await mysql.end();
//        console.log('RESULTS ' + JSON.stringify(results));
        if(key) {
            const obj = {};
            results.forEach((currentValue, index) => {
                obj[currentValue[key]] = currentValue;
            });
            return obj;
        } else {
            return results;
        }
    } catch (error) {
        console.log('SQL ERROR ' + JSON.stringify(error));
        return {error};
    }
}

const getUser = async (usercode) => {
    const result = await query(sql`
        SELECT
            id,
            SUBSTR(MD5(CONCAT(users.id, users.email)), users.id % 24 + 1, 8) AS usercode,
            users.username,
            users.role,
            users.email,
            0 AS session_uid
        FROM users
        HAVING (usercode = ${usercode})
        LIMIT 1
    `);
    console.log('getUser: ' + JSON.stringify(result, null, 2));
    return result.length ? result[0] : null;
}



module.exports = {
    query: query,

    getUser: getUser
}
