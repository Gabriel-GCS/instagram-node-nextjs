import { NextApiRequest, NextApiResponse } from "next";
import { conectarMongoDB } from "../../middlewares/conectarMongoDB";
import { validarTokenJWT } from "../../middlewares/validarTokenJWT";
import { PublicacaoModel } from "../../models/PublicacaoModel";
import { UsuarioModel } from "../../models/UsuarioModel";
import { respostaPadraoMsg } from "../../types/respostaPadraoMsg";

const likesEndPoint = async (req : NextApiRequest, res : NextApiResponse <respostaPadraoMsg>) => {
    try {
        if(req.method === 'PUT'){
            const {id} = req?.query;
            const publicacao = await PublicacaoModel.findById(id);
            if(!publicacao){
                return res.status(400).json({erro : 'Nao existe esta publicacao'});
            }
            const {userId} = req?.query;
            const usuario = await UsuarioModel.findById(userId);
            if(!usuario){
                return res.status(400).json({erro : 'Usuario invalido'});
            }

            const IndexUsuarioLike = publicacao.likes
                .findIndex((e : any) => e.toString() === usuario._id.toString());
            if(IndexUsuarioLike != -1){
                // se o index = -1 , ele nao curtiu
                publicacao.likes.splice(IndexUsuarioLike, 1);
                return res.status(200).json({msg : 'Publicacao descurtida'});

            }else{
                // se for > -1 , ele curtiu a publicacao
                publicacao.likes.push(usuario._id);
                await PublicacaoModel.findByIdAndUpdate({_id : publicacao._id}, publicacao);
                return res.status(200).json({msg : 'Publicacao curtida'});
            }
            
        }
        return res.status(405).json({erro : 'Metodo informado invalido'});
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({erro : 'Erro ao dar/tirar like de uma publicacao'});
    }
}

export default validarTokenJWT(conectarMongoDB(likesEndPoint));