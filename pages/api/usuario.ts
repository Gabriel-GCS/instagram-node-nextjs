import type { NextApiRequest, NextApiResponse } from "next";
import { conectarMongoDB } from "../../middlewares/conectarMongoDB";
import { validarTokenJWT } from "../../middlewares/validarTokenJWT";
import { UsuarioModel } from "../../models/UsuarioModel";
import { respostaPadraoMsg } from "../../types/respostaPadraoMsg";

const usuarioEndpoint = async (req : NextApiRequest, res : NextApiResponse <respostaPadraoMsg | any>) =>{
    try {
        const {userId}= req.query;
        const usuario = await UsuarioModel.findById(userId);
        usuario.senha = null;
        return res.status(200).json(usuario);


        
    } catch (e) {
        console.log(e);
        res.status(400).json({erro : 'Nao foi possivel obter as informacoes do usuario'})
    }
    return res.status(200).json({msg : 'Usuario autenticado'});

}

export default validarTokenJWT(conectarMongoDB(usuarioEndpoint));
