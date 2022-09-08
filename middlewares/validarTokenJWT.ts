import type { NextApiRequest, NextApiResponse, NextApiHandler} from "next";
import type { respostaPadraoMsg } from "../types/respostaPadraoMsg";
import jwt, { JwtPayload }  from "jsonwebtoken";

export const validarTokenJWT = (handler : NextApiHandler) => (
    req : NextApiRequest, res : NextApiResponse <respostaPadraoMsg>
) =>{
    try {
        const {MINHA_CHAVE_JWT} = process.env;

    if(!MINHA_CHAVE_JWT){
        res.status(500).json({erro : 'ENV jwt chave nao informado'})
    }

    if(!req || !req.headers){
        res.status(401).json({erro : 'Nao esta autenticado'})
    }

    if(req.method !== 'OPTIONS'){
        const authorization = req.headers['authorization'];
        if(!authorization){
            res.status(401).json({erro : 'Nao esta autenticado'})
        }

        const token = authorization?.substring(7);
        if(!token){
            res.status(401).json({erro : 'Nao esta autenticado'})
        }

        const decodificado = jwt.verify(token as string, MINHA_CHAVE_JWT as string) as JwtPayload;
        if(!decodificado){
            res.status(401).json({erro : 'Nao esta autenticado'})
        }

        if(!req.query){
            req.query = {};
        }

        req.query.userId = decodificado._id;

    }
    } catch (e) {
        console.log(e);
        res.status(401).json({erro : 'Nao foi possivel validar o token de acesso'});
    }

    return handler(req, res);

}
