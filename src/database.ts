import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import {Asset} from 'expo-asset';

async function openDatabase(): Promise<SQLite.WebSQLDatabase> {
    const databaseName = 'onyxdatabase.db';
    const databaseDir = FileSystem.documentDirectory + 'SQLite/';

    // Check if the SQLite directory exists; if not, create it
    if (!(await FileSystem.getInfoAsync(databaseDir)).exists) {
        await FileSystem.makeDirectoryAsync(databaseDir);
    }

    // Download the SQLite database file from assets to the SQLite directory
    await FileSystem.downloadAsync(
        Asset.fromModule(require(`../assets/${databaseName}`)).uri,
        databaseDir + databaseName,
    );

    // Open the downloaded database file
    return SQLite.openDatabase(databaseName);
}

const db = SQLite.openDatabase('onyxdatabase.db');

export const initDatabase = () => {
db.exec([{sql: 'PRAGMA foreign_keys = ON;', args: []}], false, () =>
    console.log('Foreign keys turned on'),
);
    db.transaction(tx => {
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS todotoday (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, completed BOOLEAN, date TEXT)',
        );
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS todosomeday (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, completed BOOLEAN, date TEXT)',
        );
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS todoeveryday (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, completed BOOLEAN, date TEXT)',
        );

        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS taskName (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, goal INTEGER)',
        );

        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS pomodoro (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, date TEXT)',
        );

        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS customTodo (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE, notes TEXT(10000), date TEXT)',
        );
    });
}
const executeSql = (query: string, values: any[] = []): Promise<any> => {
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql(
          query,
          values,
          (txObj, resultSet) => {
            //console.log("result set:", query, resultSet.rows._array);
            resolve(resultSet.rows._array);
          },
          (txObj, error) => {
            console.log('Error', error);
            reject(error);
            return true; // Return true to roll back the transaction
          },
        );
      },
      (error) => {
        console.log('Transaction error', error);
        reject(error);
      },
      () => {
        console.log('Transaction successful');
      },
    );
  });
};

export const createTodoTable = async (table: string, date: string) => {
    console.log('create table:', table, date);
    const todoTable = table + 'Todos';
    const createTodosQuery = `CREATE TABLE IF NOT EXISTS ${todoTable} (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, completed BOOLEAN)`;
    const newCustomTodoQuery = `INSERT INTO customTodo (name, notes, date) VALUES(?, ?, ?)`;

    try {
        await executeSql(createTodosQuery);
        console.log('Created table:', todoTable);
    } catch (error) {
        console.error('Error creating todos table:', error);
    }

    try {
        await executeSql(newCustomTodoQuery, [table, '', date]);
        console.log('inserted record:', [table, '', date]);
    } catch (error) {
        console.error('Error creating custom todo:', error);
    }
};

export const readCustomTodo = async (name: string) => {
    const query = `SELECT * FROM customTodo WHERE name=?`;
    try {
        const result = await executeSql(query, [name]);
        return result;
    } catch (error) {
        console.error('Error reading custom todo', error);
        return error;
    }
};
export const updateCustomTodo = async (id: number, notes: string) => {
    const updateQuery = 'UPDATE customTodo SET notes = ? WHERE id = ?';

    try {
        await executeSql(updateQuery, [notes, id]);
        console.log(`Successfully updated customTodo with id ${id}`);
    } catch (error) {
        console.error(`Error updating customTodo with id ${id}:`, error);
        throw error;
    }
};

export const createRecord = async (
    table: string,
    data: Record<string, any>,
) => {
    const keys = Object.keys(data);
    console.log('CREATED RECORD:', data);
    const values = keys.map(() => '?').join(', ');
    const query = `INSERT INTO ${table} (${keys.join(
        ', ',
    )}) VALUES (${values})`;

    return executeSql(query, Object.values(data));
};

export const readRecords = async (table: string) => {
    const query = `SELECT * FROM ${table}`;
    try {
        const result = await executeSql(query);
        //console.log('read records from:', table);
        //console.log('read result:', result);
        return result;
    } catch (error) {
        console.error('error reading records from: ', table, error);
        return error;
    }
};

export const readPomodoro = async () => {
    const query = `SELECT id, name, date FROM pomodoro`;
    const result = await executeSql(query);
    return result;
};
export const updateRecord = async (
    table: string,
    id: number,
    data: Record<string, any>,
) => {
    const keys = Object.keys(data);
    console.log('UPDATE RECORD:', data);
    const values = keys.map(() => '?').join(', ');
    const query = `UPDATE ${table} SET ${keys
        .map(key => `${key} = ?`)
        .join(', ')} WHERE id = ?`;

    return executeSql(query, [...Object.values(data), id]);
};

export const deleteRecord = async (table: string, id: number) => {
    console.log('DELETED RECORD:', table, id);
    const query = `DELETE FROM ${table} WHERE id = ?`;
    return executeSql(query, [id]);
};

export const deletePomodoro = async (name: string) => {
    console.log('DELETED RECORD:', name);
    const query = `DELETE FROM pomodoro WHERE name = ?`;
    return executeSql(query, [name]);
};

// this is not optimised
export const readTodayPomodoro = async () => {
    let today = new Date().toLocaleDateString();
    today = today.substring(today.indexOf(','));
    const query = `SELECT * FROM pomodoro WHERE date LIKE '${today}%'`;
    const result = await executeSql(query);
    return result;
};

export const readSelectedDateTodo = async (date: String) => {
    const formattedDate = formatDateString(date);
    const query = `SELECT * FROM todotoday WHERE date LIKE '${formattedDate}%'`;
    console.log(date);
    const result = await executeSql(query);

    return result;
}

function formatDateString(originalDate: String) {
    const parts = originalDate.split('-');
    if (parts.length === 3) {
        const formattedDate = `${parts[1]}/${parts[2]}/${parts[0]}`;
        console.log('formatted date:', formattedDate);
        return formattedDate;
    } else {
        console.error('Invalid date format');
        return null;
    }
}

export const createTodoSelectedDate = async (data: Record<string, any>) => {
    // Ensure 'date' property exists in data and is a valid date string
    if (!data.hasOwnProperty('date') || typeof data.date !== 'string') {
        console.error('Invalid date format');
        return null;
    }

    // Format the date using the provided function
    console.log('date in createtodo:', data.date);
    const formattedDate = formatDateString(data.date);

    // Check if date formatting is successful
    if (!formattedDate) {
        console.error('Invalid date format');
        return null;
    }

    // Use the formatted date in the data
    data.date = formattedDate;

    const keys = Object.keys(data);
    const values = keys.map(() => '?').join(', ');
    const query = `INSERT INTO todotoday (${keys.join(
        ', ',
    )}) VALUES (${values})`;

    return executeSql(query, Object.values(data));
};

export const updatePomodoro = async (oldName: string, newName: string) => {
    const pomodoroQuery = `UPDATE pomodoro SET name = ? WHERE name = ?`;
    await executeSql(pomodoroQuery, [newName, oldName]);
};
