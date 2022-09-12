import type { NextApiRequest, NextApiResponse } from "next";
import type { respostaPadraoMsg } from "../../types/respostaPadraoMsg";
import { upload, uploadImagemCosmic } from "../../services/uploadCosmicjs";
import { conectarMongoDB } from "../../middlewares/conectarMongoDB";
import { validarTokenJWT } from "../../middlewares/validarTokenJWT";
import nc from 'next-connect';
import { PublicacaoModel } from "../../models/PublicacaoModel";
import { UsuarioModel } from "../../models/UsuarioModel";

const handler = nc()
    .use(upload.single('file'))
    .post(async (req : any, res : NextApiResponse <respostaPadraoMsg>) =>{
        try {

            const {userId} = req.query;
            const usuario = await UsuarioModel.findById(userId);

            if(!usuario){
                return res.status(400).json({erro : 'Usuario nao encontrado'})
            }
            if(!req || !req.body){
                return res.status(400).json({erro : 'Parametros invalidos'})
            }
            const {descricao} = req.body

            if(!descricao || descricao.length < 1){
                return res.status(400).json({erro : 'Descricao invalida'})
            }; 
            if(!req.file || !req.file.originalname){
                return res.status(400).json({erro : 'foto invalida'})
            };

            const image = await uploadImagemCosmic(req);

            const publicacao = {
                idUsuario : usuario._id,
                descricao,
                foto : image.media.url,
                data : new Date()
            };

            await PublicacaoModel.create(publicacao);
    
            return res.status(200).json({msg : 'Publicacao criada'})
    
        } catch (e) {
            console.log(e);
            res.status(400).json({erro : 'Nao foi possivel publicar'})
        }

});

export const config = {
    api : {
        bodyParser : false
    }
}

export default validarTokenJWT(conectarMongoDB(handler));