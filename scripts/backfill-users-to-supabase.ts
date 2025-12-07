/**
 * Backfill Script: Sync existing MongoDB users to Supabase Auth
 *
 * This script creates Supabase auth users for all existing MongoDB users
 * so they can receive password reset emails via Supabase.
 *
 * Usage: npx tsx scripts/backfill-users-to-supabase.ts
 */

import { MongoClient } from "mongodb";
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

// Load environment variables
config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!MONGODB_URI || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("❌ Missing required environment variables:");
  if (!MONGODB_URI) console.error("  - MONGODB_URI");
  if (!SUPABASE_URL) console.error("  - NEXT_PUBLIC_SUPABASE_URL");
  if (!SUPABASE_SERVICE_ROLE_KEY) console.error("  - SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

// Initialize Supabase admin client
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

interface MongoUser {
  email: string;
  firstName?: string;
  lastName?: string;
}

async function backfillUsers() {
  const mongoClient = new MongoClient(MONGODB_URI);

  try {
    console.log("🔄 Connecting to MongoDB...");
    await mongoClient.connect();

    const db = mongoClient.db("app_dev");
    const usersCollection = db.collection<MongoUser>("users");

    // Fetch all users from MongoDB
    const mongoUsers = await usersCollection.find({}).toArray();
    console.log(`📊 Found ${mongoUsers.length} users in MongoDB`);

    if (mongoUsers.length === 0) {
      console.log("✅ No users to backfill");
      return;
    }

    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    for (const user of mongoUsers) {
      if (!user.email) {
        console.warn(`⚠️  Skipping user without email`);
        skipCount++;
        continue;
      }

      try {
        // Create user in Supabase
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
          email: user.email,
          email_confirm: true, // Auto-confirm email
          user_metadata: {
            source: "mongodb",
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            backfilled: true,
            backfilledAt: new Date().toISOString(),
          },
        });

        if (error) {
          // Check if error is due to user already existing
          if (
            error.message?.includes("already") ||
            error.message?.includes("exists") ||
            error.message?.includes("duplicate")
          ) {
            console.log(`⏭️  User already exists in Supabase: ${user.email}`);
            skipCount++;
          } else {
            console.error(`❌ Error creating user ${user.email}:`, error.message);
            errorCount++;
          }
        } else {
          console.log(`✅ Created Supabase user: ${user.email}`);
          successCount++;
        }
      } catch (err) {
        console.error(`❌ Unexpected error for user ${user.email}:`, err);
        errorCount++;
      }
    }

    console.log("\n📊 Backfill Summary:");
    console.log(`   ✅ Successfully created: ${successCount}`);
    console.log(`   ⏭️  Skipped (already exist): ${skipCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);
    console.log(`   📊 Total processed: ${mongoUsers.length}`);
  } catch (error) {
    console.error("❌ Fatal error during backfill:", error);
    process.exit(1);
  } finally {
    await mongoClient.close();
    console.log("\n🔒 MongoDB connection closed");
  }
}

// Run the backfill
console.log("🚀 Starting user backfill from MongoDB to Supabase...\n");
backfillUsers()
  .then(() => {
    console.log("\n✨ Backfill completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Backfill failed:", error);
    process.exit(1);
  });
