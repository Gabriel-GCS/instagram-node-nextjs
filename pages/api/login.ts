import type {NextApiRequest, NextApiResponse} from 'next';
import {conectarMongoDB} from '../../middlewares/conectarMongoDB';
import type {respostaPadraoMsg} from '../../types/respostaPadraoMsg';
import type {loginResposta} from '../../types/LoginResposta';
import md5 from 'md5';
import { UsuarioModel } from '../../models/UsuarioModel';
import jwt from 'jsonwebtoken';

const endpointLogin = async (req : NextApiRequest, res : NextApiResponse <respostaPadraoMsg | loginResposta>) => {

    const {MINHA_CHAVE_JWT} = process.env;

    if(!MINHA_CHAVE_JWT){
        res.status(500).json({erro : 'ENV jwt nao informado'});
    }

    if(req.method === 'POST'){
        const {login, senha} = req.body;

        const usuariosEncontrados = await UsuarioModel.find({email : login, senha : md5(senha)})
        if(usuariosEncontrados && usuariosEncontrados.length > 0){
            const usuarioLogado = usuariosEncontrados[0]

            const token = jwt.sign({_id : usuarioLogado._id}, MINHA_CHAVE_JWT);

            return res.status(200).json({
                nome : usuarioLogado.nome,
                email : usuarioLogado.email,
                token
            });
        }
        return res.status(400).json({erro : 'Usuario e senha invalidos'})
    }
    return res.status(405).json({erro : 'Metodo informado nao e valido'});
}
export default conectarMongoDB (endpointLogin);