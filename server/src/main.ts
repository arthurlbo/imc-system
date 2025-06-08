import "reflect-metadata";

import * as dotenv from "dotenv";
dotenv.config();

import { app } from "./app";
import { dataSource } from "../typeorm/data-source";

const PORT = process.env.PORT || 3333;

dataSource
    .initialize()
    .then(() => {
        console.log("📦 Banco de dados conectado com sucesso");

        app.listen(PORT, () => {
            console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("❌ Erro ao conectar no banco de dados:", error);
    });
