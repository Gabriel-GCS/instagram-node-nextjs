import { NextApiRequest, NextApiResponse } from "next";
import { conectarMongoDB } from "../../middlewares/conectarMongoDB";
import { validarTokenJWT } from "../../middlewares/validarTokenJWT";
import { UsuarioModel } from "../../models/UsuarioModel";
import { respostaPadraoMsg } from "../../types/respostaPadraoMsg";

const pesquisaEndPoint = async(req : NextApiRequest, res : NextApiResponse <respostaPadraoMsg | any[]>) => {
    try {
        if(req.method === 'GET'){

            if(req?.query?.id){
                const usuarioEncontrado = await UsuarioModel.findById(req.query.id);
                if(!usuarioEncontrado){
                    return res.status(400).json({erro : 'Usuario nao encontrado'});
                }
                usuarioEncontrado.senha = null;
                return res.status(200).json(usuarioEncontrado);
            }
            else{
                const {filtro} = req.query;
                if(!filtro || filtro.length < 2){
                    return res.status(400).json({erro : 'Nao foi possivel pesquisar o usuario'});
                }
                const usuariosEncontrados = await UsuarioModel.find({
                    $or : [{nome : {$regex : filtro, $options : 'i'}}, 
                    {email : {$regex : filtro, $options : 'i'}}]
                });

                usuariosEncontrados.forEach(e => e.senha = null);
                return res.status(200).json(usuariosEncontrados)
            };
        };
        return res.status(405).json({erro : 'Metodo informado invalido'});
    } catch (error) { 
        console.log(error);
       return res.status(400).json({erro : 'Nao foi possivel pesquisar o Usuario'});
    };
};

export default validarTokenJWT(conectarMongoDB(pesquisaEndPoint));