const { MongoClient } = require('mongodb');
require('dotenv').config();

async function migrateUsers() {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db();
    
    // Get all users from test database
    const testDb = client.db('test');
    const testUsers = await testDb.collection('users').find({}).toArray();
    console.log(`Found ${testUsers.length} users in test database`);

    // Get main database
    const mainDb = client.db('main');
    
    if (testUsers.length > 0) {
      // Copy users to main database
      const result = await mainDb.collection('users').insertMany(testUsers, { ordered: false });
      console.log(`Copied ${result.insertedCount} users to main database`);
    }

    // List all users in main database
    const mainUsers = await mainDb.collection('users').find({}).toArray();
    console.log(`Total users in main database: ${mainUsers.length}`);
    
    mainUsers.forEach(user => {
      console.log(`- ${user.email}: plan=${user.plan || 'free'}, status=${user.planStatus || 'none'}`);
    });

  } catch (error) {
    if (error.code === 11000) {
      console.log('Some users already exist in main database (duplicate key error)');
    } else {
      console.error('Migration error:', error);
    }
  } finally {
    await client.close();
    console.log('Migration completed');
  }
}

// Run if called directly
if (require.main === module) {
  migrateUsers().catch(console.error);
}

module.exports = { migrateUsers };
