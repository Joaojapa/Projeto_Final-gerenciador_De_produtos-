export const validateProduct = (req, res, next) => {
  const { nome, preco, categoria, quantidade } = req.body;

  if (!nome || typeof nome !== 'string' || nome.trim().length < 2) {
    return res.status(400).json({ error: 'Nome é obrigatório e deve ter pelo menos 2 caracteres' });
  }

  if (!preco || typeof preco !== 'number' || preco < 0) {
    return res.status(400).json({ error: 'Preço deve ser um número positivo' });
  }

  if (!categoria || typeof categoria !== 'string') {
    return res.status(400).json({ error: 'Categoria é obrigatória' });
  }

  if (quantidade !== undefined && (typeof quantidade !== 'number' || quantidade < 0)) {
    return res.status(400).json({ error: 'Estoque deve ser um número não negativo' });
  }

  req.validatedProduct = { nome: nome.trim(), preco, categoria, quantidade };
  next();
};