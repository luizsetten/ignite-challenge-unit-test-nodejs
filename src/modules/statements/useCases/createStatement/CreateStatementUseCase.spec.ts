import { OperationType, Statement } from "@modules/statements/entities/Statement";
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository"
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let statementsRepository: InMemoryStatementsRepository;
let usersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;

describe("Create statement", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
    statementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository);
  });

  it("Create a statement of deposit", async () => {
    const user = await createUserUseCase.execute({
      email: "test@test.com",
      name: "testman",
      password: "testing"
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id,
      amount: 100,
      description: "Deposit",
      type: OperationType.DEPOSIT
    });

    expect(statement).toBeInstanceOf(Statement);
  });

  it("Not create a statement without user", async () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: "",
        amount: 100,
        description: "Deposit",
        type: OperationType.DEPOSIT
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("Not create a statement with insufficient founds", async () => {
    const user = await createUserUseCase.execute({
      email: "test@test.com",
      name: "testman",
      password: "testing"
    });

    expect(async () => {
      await createStatementUseCase.execute({
        user_id: user.id,
        amount: 100,
        description: "WITHDRAW",
        type: OperationType.WITHDRAW
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
})
