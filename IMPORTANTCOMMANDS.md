# Important commands

To run the docker container for our db, we do `docker compose up dev-db -d`

for prisma, once everything is installed, we run `npx prisma init`

Once we've done the configuration, we can run the following commands:
`npx prisma migrate dev` (only for developpment because it resets the DB)

To access the db, we can run `npx prisma studio`