
/**
 * Collection Schemas
 *
 * All collections with columns and RBAC permissions.
 * Shared between the frontend and backend.
 */

// Import the DeepSpace schema type.
import type { CollectionSchema } from 'deepspace/schema'

// Import the three database schemas.
import { issuesSchema } from './schemas/issues-schema'
import { usersSchema } from './schemas/users-schema'
import { settingsSchema } from './schemas/admin-schema'

// Register the collections.
export const schemas: CollectionSchema[] = [
  usersSchema,
  settingsSchema,
  issuesSchema,
]
