import { NextApiRequest, NextApiResponse } from "next";
import { respostaPadraoMsg } from "../../types/respostaPadraoMsg";

const likesEndPoint = (req : NextApiRequest, res : NextApiResponse <respostaPadraoMsg>) => {
    try {
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({erro : 'Erro ao dar/tirar like de uma publicacao'});
    }
}