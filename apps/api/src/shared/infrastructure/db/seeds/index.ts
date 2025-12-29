import { seedAccountWelcomeTemplate } from "./accountWelcomeTemplate";

export async function runSeeds(): Promise<void> {
  console.log("Iniciando seeds...");

  await seedAccountWelcomeTemplate();

  console.log("Seeds concluídos!");
}

if (import.meta.main) {
  runSeeds()
    .then(() => {
      console.log("Seeds executados com sucesso!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Erro ao executar seeds:", error);
      process.exit(1);
    });
}
