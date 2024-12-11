# pour créer la bdd mongodb

```mongosh
use cinedelicesdb
db.createUser({
  user: "cinedelicesuser",
  pwd: "cinedelicespassword",
  roles: [{ role: "readWrite", db: "cinedelicesdb" }]
})
db.roles.dropIndexes();
db.roles.insertOne({ role_name: "admin" });
```
