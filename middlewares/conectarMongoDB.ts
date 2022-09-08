import type {NextApiRequest, NextApiResponse, NextApiHandler}from 'next';
import mongoose from 'mongoose';
import type {respostaPadraoMsg} from '../types/respostaPadraoMsg'

export const conectarMongoDB = (handler : NextApiHandler) => 
    async (req: NextApiRequest, res : NextApiResponse<respostaPadraoMsg>) => {

    // Verificar se o banco esta conectado, 
    // se estier seguir para o endpoint ou para o proximo middleware
    if(mongoose.connections[0].readyState){
        return handler(req, res);
    }
    // Nao esta conectado, vamos conectar
    // Obter a variavel de ambiente preencinha do env

    const {DB_CONEXAO_STRING} = process.env;

    // Se a env estiver vazia aborto o uso do sistema e aviso o programador
    if(!DB_CONEXAO_STRING){
        return res.status(500).json({erro: 'Env de consfiguracao do banco nao informada'});
    }

    mongoose.connection.on('connected', () => console.log('Banco de Dados conectado'));
    mongoose.connection.on('error', error => console.log(`Ocorreu um erro ao conectar no Banco : ${error}`));
    await mongoose.connect(DB_CONEXAO_STRING);

    // Agora pode seguir para oendpoint pois esta conectado ao Banco de Dados

    return handler(req, res);
} 