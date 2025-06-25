/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Sequelize } from 'sequelize'; // raw Sequelize instance for migrations
import { Umzug, SequelizeStorage } from 'umzug';
import { sequelizeConfig } from './config/sequelize.config';

async function runMigrations() {
  const sequelize = new Sequelize(sequelizeConfig);

  const umzug = new Umzug({
    migrations: {
      glob: 'src/sequelize/migrations/*.ts',
      resolve: ({ name, path, context }) => {
        if (!path) {
          throw new Error(`Migration path is undefined for migration ${name}`);
        }
        const migration = require(path); // Non-null assertion not needed with above guard
        return {
          name,
          up: async () => migration.up(context),
          down: async () => migration.down(context),
        };
      },
    },
    context: sequelize.getQueryInterface(), // This is the QueryInterface
    storage: new SequelizeStorage({ sequelize }),
    logger: console,
  });

  await sequelize.authenticate();
  await umzug.up();
  console.log('✅ Migrations executed successfully.');
  await sequelize.close();
}

runMigrations().catch((err) => {
  console.error('❌ Migration failed:', err);
});
