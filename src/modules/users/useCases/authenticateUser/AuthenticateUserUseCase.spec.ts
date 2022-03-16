import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
describe("Authenticate user", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);
  })
  it("Should authenticate user", async () => {
    const user = {
      email: "test@test.com",
      name: "testman",
      password: "Testing"
    };

    await createUserUseCase.execute(user);

    const response = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password
    });

    expect(response.token).toBeTruthy();
  });

  it("Should not authenticate wrong user password", async () => {
    const user = {
      email: "test@test.com",
      name: "testman",
      password: "Testing"
    };

    await createUserUseCase.execute(user);

    expect(
      async () => {
        await authenticateUserUseCase.execute({
          email: user.email,
          password: "wrong"
        });
      }
    ).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("Should not authenticate wrong user email", async () => {
    const user = {
      email: "test@test.com",
      name: "testman",
      password: "Testing"
    };

    await createUserUseCase.execute(user);

    expect(
      async () => {
        await authenticateUserUseCase.execute({
          email: "wrong",
          password: user.password
        });
      }
    ).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
})
