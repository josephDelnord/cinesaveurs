import MemJS from "memjs";

// Récupère l'URL Memcached depuis le fichier .env
const memcachedUrl = process.env.MEMCACHED_URL;

// Extraction des informations de l'URL (nom d'utilisateur, mot de passe, hôte et port)
const [auth, hostAndPort] = memcachedUrl.split("@");
const [username, password] = auth.split(":");
const [host, port] = hostAndPort.split(":");

// Connexion à Memcached via Memcachier (avec SSL activé)
const memcached = MemJS.Client.create(`${host}:${port}`, {
  username: username,
  password: password,
  failover: true,
  retries: 3,
  timeout: 5000,
  ssl: true, // Activation de la connexion SSL
});

// Fonction pour générer une clé cache basée sur la méthode HTTP et l'URL
function getCacheKey(req) {
  return `${req.method}:${req.originalUrl}`;
}

// Middleware pour vérifier le cache avant d'effectuer une requête
function cacheMiddleware(req, res, next) {
  const cacheKey = getCacheKey(req);
  console.log(`Vérification du cache pour la clé : ${cacheKey}`);

  memcached.get(cacheKey, (err, data) => {
    if (err) {
      console.error("Erreur lors de la récupération du cache:", err);
      return next();
    }

    if (data) {
      console.log("Données récupérées du cache pour :", cacheKey);
      return res.json(JSON.parse(data)); // Retourner les données mises en cache
    }

    console.log("Aucune donnée trouvée dans le cache pour :", cacheKey);
    next();
  });
}

// Middleware pour mettre en cache la réponse
function cacheResponse(req, res, next) {
  const originalSend = res.send;

  res.send = (body) => {
    const cacheKey = getCacheKey(req);
    console.log(`Mise en cache de la réponse pour la clé : ${cacheKey}`);

    memcached.set(cacheKey, body, { expires: 3600 }, (err) => {
      // Mise en cache pendant 1 heure
      if (err) {
        console.error("Erreur lors de la mise en cache:", err);
      } else {
        console.log(`Réponse mise en cache pour : ${cacheKey}`);
      }
    });

    originalSend.call(res, body); // Envoie la réponse après avoir mis en cache
  };

  next();
}

// Invalidation du cache pour une clé spécifique
function invalidateCache(req) {
  const cacheKey = getCacheKey(req);
  console.log(`Invalidation du cache pour : ${cacheKey}`);

  memcached.del(cacheKey, (err) => {
    if (err) {
      console.error("Erreur lors de l'invalidation du cache:", err);
    } else {
      console.log(`Cache invalidé pour : ${cacheKey}`);
    }
  });
}

export { memcached, cacheMiddleware, cacheResponse, invalidateCache };
