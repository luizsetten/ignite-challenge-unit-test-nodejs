import { OperationType, Statement } from "@modules/statements/entities/Statement";
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let statementsRepository: InMemoryStatementsRepository;
let usersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("Get balance", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
    statementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository);
    getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepository, statementsRepository)
  });

  it("Should get the operation of statement", async () => {
    const user = await createUserUseCase.execute({
      email: "test@tes.com",
      name: "teste",
      password: "passwrod"
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id,
      amount: 100,
      description: "Hello",
      type: OperationType.DEPOSIT
    });

    const operation = await getStatementOperationUseCase.execute({
      user_id: user.id,
      statement_id: statement.id
    });

    expect(operation).toBeInstanceOf(Statement);
  });

  it("Shouldn't get the operation of an inexisting user", async () => {
    const user = await createUserUseCase.execute({
      email: "test@tes.com",
      name: "teste",
      password: "passwrod"
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id,
      amount: 100,
      description: "Hello",
      type: OperationType.DEPOSIT
    });

    expect(async () => {
      await getStatementOperationUseCase.execute({ user_id: "", statement_id: statement.id });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("Shouldn't get the operation of an inexisting id", async () => {
    const user = await createUserUseCase.execute({
      email: "test@tes.com",
      name: "teste",
      password: "passwrod"
    });

    expect(async () => {
      await getStatementOperationUseCase.execute({ user_id: user.id, statement_id: "" });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
})
