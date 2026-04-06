#!/usr/bin/env ts-node

import 'dotenv/config';
import * as readline from 'readline';
import { createUser, getAllUsers, deleteUser } from '../src/services/user.service';
import { prisma } from '../src/lib/prisma';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function addUser() {
  try {
    const username = await question('Enter username: ');
    const email = await question('Enter email: ');

    if (!username || username.trim().length === 0) {
      console.error('❌ Username cannot be empty');
      return;
    }

    if (!email || email.trim().length === 0) {
      console.error('❌ Email cannot be empty');
      return;
    }

    const trimmedEmail = email.trim().toLowerCase();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);
    if (!emailOk) {
      console.error('❌ Invalid email format');
      return;
    }

    const trimmedUsername = username.trim();
    const user = await createUser(trimmedUsername, trimmedEmail);
    
    console.log('\n✅ User created successfully!');
    console.log(`   ID: ${user.id}`);
    console.log(`   Username: ${user.username}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Created: ${user.createdAt.toLocaleString()}\n`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`\n❌ Error: ${error.message}\n`);
    } else {
      console.error('\n❌ An unknown error occurred\n');
    }
  }
}

async function listUsers() {
  try {
    const users = await getAllUsers();
    
    if (users.length === 0) {
      console.log('\n📋 No users found\n');
      return;
    }

    console.log('\n📋 Users List:\n');
    console.log('┌─────┬──────────────────────────────────────┬─────────────────────┬──────────────────────────────┬─────────────────────┐');
    console.log('│ #   │ ID                                   │ Username            │ Email                        │ Created At          │');
    console.log('├─────┼──────────────────────────────────────┼─────────────────────┼──────────────────────────────┼─────────────────────┤');
    
    users.forEach((user, index) => {
      const id = user.id.padEnd(36);
      const username = user.username.padEnd(19);
      const email = (user.email ?? '').padEnd(28);
      const createdAt = user.createdAt.toLocaleDateString().padEnd(19);
      console.log(`│ ${(index + 1).toString().padEnd(3)} │ ${id} │ ${username} │ ${email} │ ${createdAt} │`);
    });
    
    console.log('└─────┴──────────────────────────────────────┴─────────────────────┴──────────────────────────────┴─────────────────────┘\n');
  } catch (error) {
    if (error instanceof Error) {
      console.error(`\n❌ Error: ${error.message}\n`);
    }
  }
}

async function removeUser() {
  try {
    const username = await question('Enter username to delete: ');

    if (!username || username.trim().length === 0) {
      console.error('❌ Username cannot be empty');
      return;
    }

    const confirm = await question(`⚠️  Are you sure you want to delete user '${username}'? (yes/no): `);
    
    if (confirm.toLowerCase() !== 'yes') {
      console.log('\n❌ Deletion cancelled\n');
      return;
    }

    await deleteUser(username.trim());
    console.log(`\n✅ User '${username}' deleted successfully!\n`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`\n❌ Error: ${error.message}\n`);
    }
  }
}

async function main() {
  console.log('\n╔════════════════════════════════════╗');
  console.log('║   User Management CLI Tool         ║');
  console.log('╚════════════════════════════════════╝\n');

  while (true) {
    console.log('Choose an option:');
    console.log('  1. Add new user');
    console.log('  2. List all users');
    console.log('  3. Delete user');
    console.log('  4. Exit\n');

    const choice = await question('Enter your choice (1-4): ');

    switch (choice.trim()) {
      case '1':
        await addUser();
        break;
      case '2':
        await listUsers();
        break;
      case '3':
        await removeUser();
        break;
      case '4':
        console.log('\n👋 Goodbye!\n');
        rl.close();
        await prisma.$disconnect();
        process.exit(0);
      default:
        console.log('\n❌ Invalid choice. Please enter 1, 2, 3, or 4.\n');
    }
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n\n👋 Goodbye!\n');
  rl.close();
  await prisma.$disconnect();
  process.exit(0);
});

// Run the CLI
main().catch(async (error) => {
  console.error('Fatal error:', error);
  await prisma.$disconnect();
  process.exit(1);
});
