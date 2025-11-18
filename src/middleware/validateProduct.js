export const validateProduct = (req, res, next) => {
  const { name, price, category, stock } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return res.status(400).json({ error: 'Nome é obrigatório e deve ter pelo menos 2 caracteres' });
  }

  if (!price || typeof price !== 'number' || price < 0) {
    return res.status(400).json({ error: 'Preço deve ser um número positivo' });
  }

  if (!category || typeof category !== 'string') {
    return res.status(400).json({ error: 'Categoria é obrigatória' });
  }

  if (stock !== undefined && (typeof stock !== 'number' || stock < 0)) {
    return res.status(400).json({ error: 'Estoque deve ser um número não negativo' });
  }

  req.validatedProduct = { name: name.trim(), price, category, stock };
  next();
};