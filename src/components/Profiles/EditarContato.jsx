// EditarContato.js
import React from 'react';
import FormularioContato from './FormularioContato';

const EditarContato = ({ contatoEmEdicao, setContatos, setMostrarLista, setContatoEmEdicao }) => {
  return (
    <FormularioContato
      contatoEmEdicao={contatoEmEdicao}
      setContatos={setContatos}
      setMostrarLista={setMostrarLista}
      setContatoEmEdicao={setContatoEmEdicao}
    />
  );
};

export default EditarContato;
