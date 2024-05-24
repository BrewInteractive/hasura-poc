# Hasura Graphql Engine

Hasura is a blazing fast, instant realtime GraphQL server that gives you **instant, realtime GraphQL APIs over Postgres**, with webhook triggers on database events for asynchronous business logic. Hasura helps you build GraphQL apps backed by Postgres or incrementally move to GraphQL for existing applications using Postgres.

Hasura is a **GraphQL engine** that provides the following features:

- **Instant Realtime GraphQL APIs**: Instantly get a production-ready GraphQL API up and running that gives you realtime GraphQL subscriptions out of the box.
- **Auto-Generated CRUD APIs**: Hasura automatically generates CRUD APIs on top of your schema.
- **Secure**: Hasura provides a variety of authentication modes and rules to secure your data.
- **Webhook Triggers**: Trigger webhooks on database events like insert, update, delete, etc. to build custom business logic.
- **Remote Joins**: Join data across tables and remote data sources.
- **GraphQL Actions**: Write custom business logic in the form of GraphQL mutations.
- **GraphQL Console**: A powerful web-based admin console to manage your data and manage your GraphQL server.
- **Schema Stitching**: Extend your existing GraphQL schema with Hasura.
- **REST API**: Hasura provides a REST API over GraphQL.
- **Metadata**: Hasura provides a metadata API to query the schema and relationships.
- **API Gateway**: Hasura can be used as an API gateway to unify multiple GraphQL services.
- **Remote Schemas**: Hasura can be used to merge remote GraphQL schemas.

Hasura is open-source and has a vibrant community. You can get started with Hasura by following the [quickstart guide](https://hasura.io/docs/latest/graphql/core/getting-started/index.html).

## Running Locally

- Install Docker and Docker Compose.
- set .env files in apps/hasura, apps/web folders.
- Run the following command to start the Hasura GraphQL Engine and the web app:

```bash
docker-compose up -d
```

- Hasura Console
    [http://localhost:45554/console](http://localhost:45554/console)
- Web app
    [http://localhost:3000](http://localhost:3000)
