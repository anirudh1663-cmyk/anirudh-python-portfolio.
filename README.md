# Anirudh Singh — Portfolio

Responsive HTML, CSS, and JavaScript portfolio with a Netlify Server API and persistent PostgreSQL contact storage through Netlify Database and Drizzle ORM.

## Development

Use Node.js 24 or newer. Run `npm install`, then `netlify dev --port 8889`.

Netlify publishes `public/` and detects `netlify/server/index.mjs` automatically. No frontend build is required. Database connections are managed by Netlify. Schema changes belong in `db/schema.ts`; run `npm run db:generate -- --name describe_change` to generate migrations. Netlify applies migrations during deployment.

`npm test` verifies request validation, successful storage, storage failure, spam handling, origin checks, body limits, and method handling. These tests inject a storage adapter and do not connect to the live database.

## Contact messages

`POST /api/contact` accepts JSON containing `name`, `email`, and `message`. Messages are stored privately in the `messages` table, with a creation timestamp. There is deliberately no public endpoint for reading messages. Site owners can inspect messages in Netlify Database tooling. The form stores messages; it does not send email notifications.

`GET /api/health` checks server availability, not database connectivity. Invalid submissions return 400, storage outages return 503, and successful saves return 201. The frontend keeps entered values on failure and resets only after success.

## Editing content

Edit `public/index.html` to update the biography, projects, and profile links. Styles and contact submission behavior live in `public/style.css` and `public/script.js`. Existing learning projects are presented as work in progress rather than completed client work.
