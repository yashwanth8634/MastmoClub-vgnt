# Database Backup and Recovery Plan

This document outlines the procedures for backing up and restoring the application's MongoDB database.

## 1. Overview

Database backups are essential for disaster recovery. This plan relies on a script that uses the standard MongoDB tools (`mongodump` and `mongorestore`).

- **Backup Tool**: `mongodump`
- **Restore Tool**: `mongorestore`
- **Backup Location**: Backups are stored in the `/backups` directory at the root of the project.
- **Backup Format**: Gzipped archive files.

**Important**: The backup script requires the `MONGODB_URI` environment variable to be set to the connection string of the database you want to back up.

## 2. Backup Procedure

### Manual Backups

To perform a manual backup, run the backup script from the root of the project:

```bash
# Ensure your .env file has the correct MONGODB_URI
node scripts/backup.mjs
```

The script will:
1. Create a `backups/` directory if it does not exist.
2. Generate a gzipped archive of the database named with the current timestamp (e.g., `backups/backup-2025-12-10T12-00-00.000Z`).

### Automated Backups (Recommended)

For production environments, backups should be automated. This can be achieved using a cron job on a server or a scheduled task on a cloud provider (e.g., a GitHub Action, a Vercel Cron Job).

**Example Cron Job:**

This cron job runs the backup script every day at 2:00 AM.

```cron
0 2 * * * /usr/bin/node /path/to/your/project/scripts/backup.mjs >> /var/log/cron.log 2>&1
```

**Note**: Ensure the cron environment has access to the `MONGODB_URI` environment variable.

## 3. Recovery Procedure

To restore the database from a backup, you will use the `mongorestore` command.

1.  **Identify the backup file**: Choose the backup file from the `/backups` directory that you want to restore.

2.  **Run `mongorestore`**: Execute the following command, replacing `<backup-file-path>` with the path to your chosen backup file and `<target-mongodb-uri>` with the connection string of the database you want to restore to.

    ```bash
    mongorestore --uri="<target-mongodb-uri>" --archive="<backup-file-path>" --gzip
    ```

    **Example:**

    ```bash
    mongorestore --uri="mongodb://localhost:27017/restored-db" --archive="backups/backup-2025-12-10T12-00-00.000Z" --gzip
    ```

**WARNING**: The restore command will overwrite data in the target database. Always be cautious when restoring data, especially in a production environment. It is often best to restore to a new, temporary database first to verify the backup's integrity.
