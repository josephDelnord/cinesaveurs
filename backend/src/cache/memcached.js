import Memcached from "memcached";

// Connexion à Memcached (sur localhost et port 11211 par défaut)
const memcached = new Memcached("localhost:11211");

// stockage de données dans Memcached
function cacheData(key, value) {
  // Stocker les données dans Memcached pendant 1 heure (3600 secondes)
  memcached.set(key, value, 3600, (err) => {
    if (err) {
      console.error("Erreur lors de la mise en cache:", err);
    } else {
      console.log("Données mises en cache avec succès!");
    }
  });
}

// récupération des données depuis Memcached
function getData(key, callback) {
  memcached.get(key, (err, data) => {
    if (err) {
      // console.error("Erreur lors de la récupération:", err);
      callback(err, null);
    } else {
      if (data) {
        // console.log("Données récupérées du cache:", data);
        callback(null, data);
      } else {
        console.log("Aucune donnée trouvée dans le cache.");
        callback(null, null);
      }
    }
  });
}

// Invalider le cache pen cas de mise à jour des données
function invalidateCache(cacheKey) {
  memcached.del(cacheKey, (err) => {
    if (err) {
      console.error("Erreur lors de l'invalidation du cache:", err);
    } else {
      console.log(`Cache invalidé pour la clé ${cacheKey}`);
    }
  });
}

export { cacheData, getData, invalidateCache };
