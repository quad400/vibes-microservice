const { execSync } = require('child_process');

type commandTypeProps = "run" | "generate" | "revert" | "drop"

const commandType = process.argv[2] as commandTypeProps;
const service = process.argv[3]; // The service name (e.g., 'user-service')
const migrationName = process.argv[4]; // The migration name (only for generation)

if (!commandType || !service) {
  console.error(
    'Please provide the command type (generate or run) and the service name.',
  );
  process.exit(1);
}

let command = '';

if (commandType === 'generate') {
  if (!migrationName) {
    console.error('Please provide a migration name for generation.');
    process.exit(1);
  }
  command = `npm run build && npx typeorm -d dist/apps/${service}/apps/${service}/src/typeorm.config.js migration:generate apps/${service}/src/migrations/${migrationName}`;
} else if (commandType === 'run') {
  command = `npm run build && npx typeorm -d dist/apps/${service}/apps/${service}/src/typeorm.config.js migration:run`;
} else if (commandType === 'drop') {
  command = `npm run build && npx typeorm -d dist/apps/${service}/apps/${service}/src/typeorm.config.js migration:drop`;
} else if (commandType === 'revert') {
  command = `npm run build && npx typeorm -d dist/apps/${service}/apps/${service}/src/typeorm.config.js migration:revert`;
} else {
  console.error('Unknown command type. Use "generate" or "run".');
  process.exit(1);
}

try {
  execSync(command, { stdio: 'inherit' });
} catch (error) {
  console.error('Error executing migration command:', error.message);
  process.exit(1);
}
