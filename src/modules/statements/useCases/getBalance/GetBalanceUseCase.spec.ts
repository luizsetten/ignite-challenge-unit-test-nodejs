import { OperationType } from "@modules/statements/entities/Statement";
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let statementsRepository: InMemoryStatementsRepository;
let usersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getBalanceUseCase: GetBalanceUseCase;

describe("Get balance", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
    statementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository);
    getBalanceUseCase = new GetBalanceUseCase(statementsRepository, usersRepository)
  });

  it("Should get the balance", async () => {
    const user = await createUserUseCase.execute({
      email: "test@tes.com",
      name: "teste",
      password: "passwrod"
    });

    const balance = await getBalanceUseCase.execute({ user_id: user.id });

    expect(balance).toHaveProperty("statement");
    expect(balance).toHaveProperty("balance");
  });

  it("Should get the balance with statements", async () => {
    const user = await createUserUseCase.execute({
      email: "test@tes.com",
      name: "teste",
      password: "passwrod"
    });

    await createStatementUseCase.execute({
      user_id: user.id,
      amount: 100,
      description: "Hello",
      type: OperationType.DEPOSIT
    });

    const balance = await getBalanceUseCase.execute({ user_id: user.id });

    expect(balance).toHaveProperty("statement");
    expect(balance).toHaveProperty("balance");
  });

  it("Shouldn't get the balance of an inexisting user", async () => {
    expect(async () => {
      await getBalanceUseCase.execute({ user_id: "" });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
})
