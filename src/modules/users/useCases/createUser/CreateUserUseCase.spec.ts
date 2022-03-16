import { User } from "@modules/users/entities/User";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let usersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
describe("Create user", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
  });

  it("Should create a new user", async () => {
    const user = {
      name: "username",
      email: "email@test.com",
      password: "passwordsupersecret"
    }

    const userCreated = await createUserUseCase.execute(user);

    expect(userCreated).toBeInstanceOf(User);
  });

  it("Should not create a new user with an existing email", async () => {
    const user = {
      name: "username",
      email: "email@test.com",
      password: "passwordsupersecret"
    }

    await createUserUseCase.execute(user);

    expect(async () => {
      await createUserUseCase.execute(user);
    }).rejects.toBeInstanceOf(CreateUserError);
  });
})
