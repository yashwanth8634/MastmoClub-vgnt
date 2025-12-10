#!/usr/bin/env node

const mongoose = require('mongoose');

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mastmoclub';

async function cleanupDB() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB');
    
    const db = mongoose.connection.db;
    
    // Drop existing problematic indexes
    console.log('\nDropping old indexes...');
    const indexesToDrop = ['email_1', 'phone_1'];
    
    for (const indexName of indexesToDrop) {
      try {
        await db.collection('registrations').dropIndex(indexName);
        console.log(`✓ Dropped ${indexName} index`);
      } catch (e) {
        if (e.message.includes('index not found')) {
          console.log(`• ${indexName} index does not exist (skipped)`);
        } else {
          console.error(`✗ Error dropping ${indexName}:`, e.message);
        }
      }
    }
    
    // Remove registrations with null emails in members array
    console.log('\nCleaning up invalid registrations...');
    const result = await db.collection('registrations').deleteMany({
      'members.email': null
    });
    
    if (result.deletedCount > 0) {
      console.log(`✓ Deleted ${result.deletedCount} registrations with null emails`);
    } else {
      console.log('• No registrations with null emails found');
    }
    
    // List all current indexes
    console.log('\nCurrent indexes on registrations:');
    try {
      const indexes = await db.collection('registrations').listIndexes().toArray();
      indexes.forEach(idx => {
        console.log(`  - ${idx.name}:`, idx.key);
      });
    } catch (e) {
      console.log('  (Unable to list indexes)');
    }
    
    await mongoose.connection.close();
    console.log('\n✓ Cleanup complete!');
  } catch (error) {
    console.error('\n✗ Error:', error.message);
    process.exit(1);
  }
}

cleanupDB();
