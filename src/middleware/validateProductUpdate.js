export const validateProductUpdate = (req, res, next) => {
  const { nome, preco, categoria, quantidade } = req.body;

  // Verifica se pelo menos um campo foi enviado (necessário para PATCH)
  const hasAtLeastOneField = 
    nome !== undefined || 
    preco !== undefined || 
    categoria !== undefined || 
    quantidade !== undefined;

  if (!hasAtLeastOneField) {
    return res.status(400).json({ 
      error: 'Pelo menos um campo deve ser enviado para atualização' 
    });
  }

  // Validação individual dos campos (só valida se o campo foi enviado)

  if (nome !== undefined) {
    if (typeof nome !== 'string' || nome.trim().length < 2) {
      return res.status(400).json({ 
        error: 'Nome deve ser uma string com pelo menos 2 caracteres' 
      });
    }
  }

  if (preco !== undefined) {
    if (typeof preco !== 'number' || preco < 0) {
      return res.status(400).json({ 
        error: 'Preço deve ser um número maior ou igual a zero' 
      });
    }
  }

  if (categoria !== undefined) {
    if (typeof categoria !== 'string' || categoria.trim() === '') {
      return res.status(400).json({ 
        error: 'Categoria deve ser uma string não vazia' 
      });
    }
  }

  
  if (quantidade !== undefined) {
    
    if (typeof quantidade !== 'number' || quantidade < 0) {
      return res.status(400).json({ 
        error: 'Quantidade deve ser um número maior ou igual a zero' 
      });
    }
  }

  // Monta apenas os campos válidos que foram enviados
  req.validatedProductUpdate = {
    ...(nome !== undefined && { nome: nome.trim() }),
    ...(preco !== undefined && { preco }),
    ...(categoria !== undefined && { categoria: categoria.trim() }),
    ...(quantidade !== undefined && { quantidade }),
  };

  next();
};