# pour créer la bdd mongodb

```mongosh
use cinedelicesdb
db.createUser({
  user: "cinedelicesuser",
  pwd: "cinedelicespassword",
  roles: [
    { role: "readWrite", db: "cinedelicesdb" },
    ]
})
db.roles.dropIndexes();
db.roles.insertOne({ role_name: "admin" });
```


```mongosh
use cinedelicesdb

// attribuer à cinedelicesuser un rôle complet d'administrateur
db.getSiblingDB('admin').grantRolesToUser("cinedelicesuser", [{ role: "userAdminAnyDatabase", db: "admin" }])

// ou bien, lui accorder un contrôle complet sur MongoDB
db.getSiblingDB('admin').grantRolesToUser("cinedelicesuser", [{ role: "root", db: "admin" }])

```

```bash
sudo systemctl start mongodb
docker stop mongodb
docker rm mongodb
docker compose up -d
sudo lsof -i :27017
sudo kill -9
docker exec -it mongodb mongosh

use admin
db.createUser({
   user: "root",
   pwd: "rootpassword",
   roles: [{ role: "root", db: "admin" }]
 });

docker compose down
docker compose up -d
docker exec -it mongodb mongosh

docker exec -it mongodb mongosh -u root -p rootpassword --authenticationDatabase admin

use cinedelicesdb;
db.createUser({
   user: "cinedelicesuser",
   pwd: "cinedelicespassword",
   roles: [
     { role: "readWrite", db: "cinedelicesdb" },
     { role: "dbAdmin", db: "cinedelicesdb" }
   ]
 });

docker exec -it mongodb mongosh -u cinedelicesuser -p cinedelicespassword --authenticationDatabase cinedelicesdb
docker compose up --build
```
