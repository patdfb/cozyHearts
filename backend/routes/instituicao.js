import express from 'express';
import { supabase, supabaseAdmin } from '../lib/supabase.js';
import upload from '../lib/storage.js';

const router = express.Router();

// Registar nova Instituicao
router.post('/register', upload.single('comprovativo'), async (req, res) => {
  console.log('POST /instituicao/register chamado');
  console.log('Body:', req.body);
  console.log('File:', req.file);
  const { nome, endereco, localidade, cidade } = req.body;
  let comprovativoUrl = null;

  // Upload do PDF para o bucket 'Comprovativos'
  if (req.file) {
    const fileName = `${Date.now()}-${req.file.originalname}`;
    const { error: uploadError } = await supabaseAdmin.storage
      .from('Comprovativos')
      .upload(fileName, req.file.buffer, { contentType: req.file.mimetype });

    if (uploadError) {
      console.error('Erro upload:', uploadError.message);
      return res.status(500).json({ error: uploadError.message });
    }

    const { data: urlData } = supabaseAdmin.storage
      .from('Comprovativos')
      .getPublicUrl(fileName);
    comprovativoUrl = urlData.publicUrl;
    console.log('Comprovativo URL:', comprovativoUrl);
  } else {
    console.warn('Nenhum ficheiro recebido');
  }

  // Procurar ou criar a localidade
  let id_localidade = null;
  const { data: localidadeData, error: localidadeError } = await supabase
    .from('Localidade')
    .select('id')
    .eq('Freguesia', localidade)
    .eq('Cidade', cidade)
    .single();

  if (localidadeError && localidadeError.code !== 'PGRST116') { // PGRST116 = no rows found
    console.error('Erro ao procurar localidade:', localidadeError.message);
    return res.status(500).json({ error: localidadeError.message });
  }

  if (localidadeData) {
    id_localidade = localidadeData.id;
  } else {
    // Criar nova localidade
    const { data: novaLoc, error: novaLocError } = await supabase
      .from('Localidade')
      .insert({ Freguesia: localidade, Cidade: cidade })
      .select('id')
      .single();
    if (novaLocError) {
      console.error('Erro ao criar localidade:', novaLocError.message);
      return res.status(500).json({ error: novaLocError.message });
    }
    id_localidade = novaLoc.id;
  }

  // Guardar na tabela Instituicao
  const { data, error } = await supabase
    .from('Instituicao')
    .insert({
      Nome: nome,
      Endereco: endereco,
      id_localidade: id_localidade,
      Verificacao: false
    })
    .select()
    .single();

  if (error) {
    console.error('Erro ao inserir na tabela:', error.message);
    return res.status(500).json({ error: error.message });
  }

  console.log('Instituição registada:', data);
  res.status(201).json({ message: 'Instituição registada com sucesso.', instituicao: data });
});

export default router;
