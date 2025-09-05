module.exports = (requiredRole) => {
  return (req, res, next) => {
    const rolesAllowed = Array.isArray(requiredRole) ? requiredRole.map(r => r.toLowerCase()) : [requiredRole.toLowerCase()];
    const userRole = req.user?.role?.toLowerCase();

    if (!userRole || !rolesAllowed.includes(userRole)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    next();
  };
};
