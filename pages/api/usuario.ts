import type { NextApiRequest, NextApiResponse } from "next";
import { conectarMongoDB } from "../../middlewares/conectarMongoDB";
import { validarTokenJWT } from "../../middlewares/validarTokenJWT";
import { UsuarioModel } from "../../models/UsuarioModel";
import { respostaPadraoMsg } from "../../types/respostaPadraoMsg";
import dc from 'next-connect';
import { upload, uploadImagemCosmic } from "../../services/uploadCosmicjs";

const handler = dc()
    .use(upload.single('file'))
    .put(async (req : any, res: NextApiResponse <respostaPadraoMsg>) => {
        try {
            const{userId} = req?.query;
            const usuario = await UsuarioModel.findById(userId);
            if(!usuario){
                return res.status(400).json({erro : 'Usuario nao encontrado'});
            }

            const {nome} = req.body;

            if(nome && nome.length > 2){
                usuario.nome = nome
            }

            const {file} = req

            if(file && file.originalname){
                const image = await uploadImagemCosmic(req);
                if(image && image.media && image.media.url){
                    usuario.avatar = image.media.url;
                }
            }

            await UsuarioModel.findByIdAndUpdate({_id : usuario._id}, usuario);
            return res.status(200).json({msg : 'Usuario alterado com sucesso'});


        } catch (error) {
            console.log(error)
                return res.status(400).json({erro : 'Nao foi possivel alterar o usuario'});
        }
    })
    .get(async (req : NextApiRequest, res : NextApiResponse <respostaPadraoMsg | any>) =>{
        try {
            const {userId}= req.query;
            const usuario = await UsuarioModel.findById(userId);
            usuario.senha = null;
            return res.status(200).json(usuario);

        } catch (e) {
            console.log(e);
            return res.status(400).json({erro : 'Nao foi possivel obter as informacoes do usuario'})
        }
    });

export const config = {
    api : {
        bodyParser : false
    }
}

export default validarTokenJWT(conectarMongoDB(handler));
