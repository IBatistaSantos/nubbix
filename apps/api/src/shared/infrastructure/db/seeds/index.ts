import { seedAccountWelcomeTemplate } from "./accountWelcomeTemplate";

export async function runSeeds(): Promise<void> {
  // eslint-disable-next-line no-console
  console.log("Iniciando seeds...");

  await seedAccountWelcomeTemplate();

  // eslint-disable-next-line no-console
  console.log("Seeds concluídos!");
}

if (import.meta.main) {
  runSeeds()
    .then(() => {
      // eslint-disable-next-line no-console
      console.log("Seeds executados com sucesso!");
      process.exit(0);
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error("Erro ao executar seeds:", error);
      process.exit(1);
    });
}
