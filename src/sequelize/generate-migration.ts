import * as fs from 'fs';
import * as path from 'path';

const migrationsDir = path.resolve(__dirname, './migrations');

function getTimestamp() {
  return new Date()
    .toISOString()
    .replace(/[-T:\.Z]/g, '')
    .slice(0, 14);
}

function createMigrationFile(name: string) {
  const timestamp = getTimestamp();
  const filename = `${timestamp}-${name}.ts`;
  const filepath = path.join(migrationsDir, filename);

  const template = `import { QueryInterface, DataTypes } from 'sequelize';

export = {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    // TODO: define changes here
  },

  down: async (queryInterface: QueryInterface): Promise<void> => {
    // TODO: undo changes here
  },
};
`;

  fs.writeFileSync(filepath, template);
  console.log(`✅ Migration created: ${filepath}`);
}

// Get name from CLI argument
const migrationName = process.argv[2];
if (!migrationName) {
  console.error('❌ Please provide a migration name.');
  process.exit(1);
}

createMigrationFile(migrationName);
