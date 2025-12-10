const mongoose = require('mongoose');

const mongoUri = 'mongodb://localhost:27017/mastmoclub';

async function cleanupDB() {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
    
    const db = mongoose.connection.db;
    
    // Drop existing indexes on registrations
    try {
      await db.collection('registrations').dropIndex('email_1');
      console.log('Dropped email_1 index');
    } catch (e) {
      console.log('email_1 index does not exist');
    }
    
    try {
      await db.collection('registrations').dropIndex('phone_1');
      console.log('Dropped phone_1 index');
    } catch (e) {
      console.log('phone_1 index does not exist');
    }
    
    // Remove registrations with null emails in members array
    const result = await db.collection('registrations').deleteMany({
      'members.email': null
    });
    console.log(`Deleted ${result.deletedCount} registrations with null emails`);
    
    await mongoose.connection.close();
    console.log('Cleanup complete!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

cleanupDB();
