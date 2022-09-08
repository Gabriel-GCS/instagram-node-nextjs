import type { NextApiRequest, NextApiResponse } from "next";
import { validarTokenJWT } from "../../middlewares/validarTokenJWT";
import { respostaPadraoMsg } from "../../types/respostaPadraoMsg";

const usuarioEndpoint = (req : NextApiRequest, res : NextApiResponse <respostaPadraoMsg>) =>{
    return res.status(200).json({msg : 'Usuario autenticado'});
}

export default validarTokenJWT(usuarioEndpoint);