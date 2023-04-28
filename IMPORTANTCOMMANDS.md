# Important commands

To run the docker container for our db, we do `docker compose up dev-db -d`

for prisma, once everything is installed, we run `npx prisma init`

Once we've done the configuration, we can run the following commands:
`npx prisma migrate dev` (only for developpment because it resets the DB)

To access the db, we can run `npx prisma studio`

for the doc, for the authenticated routes, we want to add as Headers: 
Authorization     Bearer <TOKEN>

List of barcodes to try for the API and for caching:

3700214611548
3760091722508
3760091725301
3760091722515
3477730001305
3700214618998
3760091720627
3700214616987
3483981900052
3760091723574
3250391737284