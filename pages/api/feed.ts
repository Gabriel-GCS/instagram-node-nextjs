import type { NextApiRequest, NextApiResponse } from "next";
import { conectarMongoDB } from "../../middlewares/conectarMongoDB";
import { validarTokenJWT } from "../../middlewares/validarTokenJWT";
import { PublicacaoModel } from "../../models/PublicacaoModel";
import { UsuarioModel } from "../../models/UsuarioModel";
import { respostaPadraoMsg } from "../../types/respostaPadraoMsg";

const feedEndPoint = async (req : NextApiRequest, res: NextApiResponse <respostaPadraoMsg | any>) => {
    try {
        if(req.method === 'GET'){
            if(req?.query?.id){
                const usuario = await UsuarioModel.findById(req?.query?.id);

                if(!usuario){
                    return res.status(400).json({erro : 'Usuario invalido'});
                }

                const publicacoes = await PublicacaoModel.find({idUsuario : usuario._id}).sort({data : -1});

                return res.status(200).json(publicacoes);
            }

        }

        return res.status(405).json({erro : 'Metodo informado invalido'});
        
    } catch (e) {
        console.log(e)
        return res.status(400).json({erro : 'Nao foi possivel obte ro feed'});
    }
}

export default validarTokenJWT(conectarMongoDB(feedEndPoint));