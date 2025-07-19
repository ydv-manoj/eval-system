import mysql from 'mysql2/promise';
import { config } from './environment';
import { logger } from './logger';

let connection: mysql.Connection | null = null;

export const connectDatabase = async (): Promise<mysql.Connection> => {
  try {
    if (connection) {
      return connection;
    }

    connection = await mysql.createConnection({
      host: config.database.host,
      port: config.database.port,
      user: config.database.user,
      password: config.database.password,
      database: config.database.name,
      charset: 'utf8mb4',
      timezone: '+00:00',
    });

    // Test connection
    await connection.ping();
    
    logger.info('Database connected successfully', {
      host: config.database.host,
      database: config.database.name,
    });

    return connection;
  } catch (error) {
    logger.error('Database connection failed', { error });
    throw error;
  }
};

export const getConnection = (): mysql.Connection => {
  if (!connection) {
    throw new Error('Database not connected. Call connectDatabase first.');
  }
  return connection;
};

export const closeDatabase = async (): Promise<void> => {
  if (connection) {
    await connection.end();
    connection = null;
    logger.info('Database connection closed');
  }
};
