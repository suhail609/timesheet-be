/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Sequelize } from 'sequelize';
import { Umzug, SequelizeStorage } from 'umzug';
import { sequelizeConfig } from './config/sequelize.config';

//TODO: Fix type errors here

const config = sequelizeConfig(); // This returns SequelizeModuleOptions

async function getUmzug(sequelize: Sequelize) {
  return new Umzug({
    migrations: {
      glob:
        process.env.NODE_ENV === 'production'
          ? 'dist/sequelize/migrations/*.js'
          : 'src/sequelize/migrations/*.ts',
      resolve: ({ name, path, context }) => {
        if (!path) throw new Error(`Migration path is undefined for ${name}`);
        const migration = require(path);
        return {
          name,
          up: async () => migration.up(context),
          down: async () => migration.down(context),
        };
      },
    },
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize }),
    logger: console,
  });
}

async function runMigrations() {
  const sequelize = new Sequelize(
    config.database!,
    config.username!,
    config.password,
    {
      host: config.host,
      port: config.port,
      dialect: config.dialect,
      logging: config.logging,
    },
  );

  await sequelize.authenticate();
  const umzug = await getUmzug(sequelize);

  const command = process.argv[2];

  switch (command) {
    case 'up':
      await umzug.up();
      console.log('✅ Migrations executed');
      break;
    case 'down':
      await umzug.down();
      console.log('↩️  Rolled back one migration');
      break;
    case 'pending':
      const pending = await umzug.pending();
      console.log('🕓 Pending migrations:');
      pending.forEach((m) => console.log(`- ${m.name}`));
      break;
    default:
      console.log(`❓ Unknown command: ${command}`);
      console.log(`Usage: ts-node migration-runner.ts [up|down|pending]`);
  }

  await sequelize.close();
}

runMigrations().catch((err) => {
  console.error('❌ Migration failed:', err);
});

/** NOTE:
import { Sequelize } from 'sequelize';
import { Umzug, SequelizeStorage } from 'umzug';
import { sequelizeConfig } from './config/sequelize.config';

const isProd = process.env.NODE_ENV === 'production';

async function getUmzug(sequelize: Sequelize) {
  return new Umzug({
    migrations: {
      glob: isProd
        ? 'dist/sequelize/migrations/*.js'
        : 'src/sequelize/migrations/*.ts',
      resolve: ({ name, path, context }) => {
        if (!path) throw new Error(`Migration path is undefined for ${name}`);
        const migration = require(path);
        return {
          name,
          up: async () => migration.up(context),
          down: async () => migration.down(context),
        };
      },
    },
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize }),
    logger: console,
  });
}

async function run() {
  const sequelize = new Sequelize(sequelizeConfig);
  await sequelize.authenticate();

  const umzug = await getUmzug(sequelize);

  const command = process.argv[2]; // e.g. up, down, pending

  switch (command) {
    case 'up':
      await umzug.up();
      console.log('✅ Migrations executed');
      break;
    case 'down':
      await umzug.down();
      console.log('↩️  Rolled back one migration');
      break;
    case 'pending':
      const pending = await umzug.pending();
      console.log('🕓 Pending migrations:');
      pending.forEach((m) => console.log(`- ${m.name}`));
      break;
    default:
      console.log(`❓ Unknown command: ${command}`);
      console.log(`Usage: ts-node migration-runner.ts [up|down|pending]`);
  }

  await sequelize.close();
}

run().catch((err) => {
  console.error('❌ Migration failed:', err);
});


"scripts": {
  "migrate:up": "ts-node src/sequelize/migration-runner.ts up",
  "migrate:down": "ts-node src/sequelize/migration-runner.ts down",
  "migrate:pending": "ts-node src/sequelize/migration-runner.ts pending",
  "migrate:prod": "NODE_ENV=production node dist/sequelize/migration-runner.js up"
}

 */
