import type {NextApiRequest, NextApiResponse} from 'next';
import type {respostaPadraoMsg} from '../../types/respostaPadraoMsg';
import type {CadastroRequisicao} from '../../types/CadastroRequisicao';
import {UsuarioModel} from '../../models/UsuarioModel';
import {conectarMongoDB} from '../../middlewares/conectarMongoDB';
import md5 from 'md5';
import {upload, uploadImagemCosmic} from '../../services/uploadCosmicjs';
import nc from 'next-connect';

const handler = nc()
    .use(upload.single('file'))
    .post(async (req : NextApiRequest, res : NextApiResponse <respostaPadraoMsg>) => {
        const usuario = req.body as CadastroRequisicao;
    
        if(!usuario.nome || usuario.nome.length < 2){
            res.status(400).json({erro : 'Nome invalido'});
        }

        if(!usuario.email 
            || usuario.email.length < 5
            || !usuario.email.includes('@')
            || !usuario.email.includes('.')){
            res.status(400).json({erro : 'Email invalido'});
        }

        if(!usuario.senha || usuario.senha.length < 4){
            res.status(400).json({erro : 'Senha invalido'});
        }

        // Verificar se existe dois usuarios iguais
        const usuariosComMesmoEmail = await UsuarioModel.find({email : usuario.email});
        if(usuariosComMesmoEmail && usuariosComMesmoEmail.length > 0){
            res.status(400).json({erro : 'Email ja cadastrado'});
        }

        // enviar a imagem do multer para o cosmic
        const image = await uploadImagemCosmic(req);

        // Salvar no banco de dados
        const UsuarioASerSalvo = {
            nome : usuario.nome,
            email : usuario.email,
            senha : md5(usuario.senha),
            avatar : image?.media?.url
        }
        await UsuarioModel.create(UsuarioASerSalvo);
        return res.status(200).json({msg: 'Usuario criado com sucesso'});
 });

export const config = {
    api : {
        bodyParse : false
    }
}

export default conectarMongoDB(handler);