
/**
 * IssueFlow - Issues Database Schema
 *
 * This file defines what information each issue stores
 * and which users are allowed to access or modify it.
 */

// Import the schema type from DeepSpace.
import type { CollectionSchema } from 'deepspace/schema'

// Define the issues database collection.
export const issuesSchema: CollectionSchema = {
  name: 'issues',

  // Define the fields stored in every issue.
  columns: [
    {
      name: 'title',
      storage: 'text',
      interpretation: 'plain',
    },
    {
      name: 'description',
      storage: 'text',
      interpretation: 'plain',
    },
    {
      name: 'status',
      storage: 'text',
      interpretation: 'plain',
    },
    {
      name: 'priority',
      storage: 'text',
      interpretation: 'plain',
    },
    {
      name: 'createdBy',
      storage: 'text',
      interpretation: 'plain',
    },
  ],

  // Define access permissions for different user roles.
  permissions: {
    // Viewers can read issues but cannot modify them.
    viewer: {
      read: true,
      create: false,
      update: false,
      delete: false,
    },

    // Members can create issues and modify their own records.
    member: {
      read: true,
      create: true,
      update: 'own',
      delete: 'own',
    },

    // Administrators can manage all issues.
    admin: {
      read: true,
      create: true,
      update: true,
      delete: true,
    },
  },
}
