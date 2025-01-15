// Middleware pour vérifier si l'utilisateur est un admin
const isAdmin = (req, res, next) => {
  const userRole = req.userRole; // Le rôle de l'utilisateur est ajouté par le middleware d'authentification

  if (userRole !== 'admin') {
    return res.status(403).json({ message: 'Accès interdit, vous devez être un administrateur.' });
  }

  next();
};

// Middleware pour vérifier si l'utilisateur est un utilisateur (user)
const isUser = (req, res, next) => {
  const userRole = req.userRole; // Le rôle de l'utilisateur est ajouté par le middleware d'authentification

  if (userRole !== 'user') {
    return res.status(403).json({ message: 'Accès interdit, vous devez être un utilisateur.' });
  }

  next();
};

// Middleware pour vérifier si l'utilisateur est soit admin, soit l'utilisateur lui-même
const isAdminOrSelf = (req, res, next) => {
  const userIdFromParam = req.params.id; // ID de l'utilisateur dans l'URL
  const loggedInUserId = req.userId; // ID de l'utilisateur connecté (extrait du JWT)
  const loggedInUserRole = req.userRole; // Rôle de l'utilisateur connecté (extrait du JWT)

  // Vérifier si l'utilisateur est admin ou si c'est lui-même (l'ID dans l'URL correspond à son ID)
  if (loggedInUserRole === 'admin' || userIdFromParam === loggedInUserId) {
    return next(); // Autoriser l'accès si admin ou si l'utilisateur accède à ses propres informations
  } else {
    return res.status(403).json({ message: 'Accès interdit. Vous devez être un administrateur ou l\'utilisateur concerné.' });
  }
};

export { isAdmin, isUser, isAdminOrSelf };
