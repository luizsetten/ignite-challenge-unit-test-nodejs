import { User } from "@modules/users/entities/User";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let usersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show user profile", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository);
  });

  it("Show user profile correctly", async () => {
    const user = await createUserUseCase.execute({
      email: "user@test.com",
      name: "test",
      password: "just testing"
    });

    const profile = await showUserProfileUseCase.execute(user.id);

    expect(profile).toBeInstanceOf(User);
  });

  it("Not show user profile that doens exists", async () => {
    const user = await createUserUseCase.execute({
      email: "user@test.com",
      name: "test",
      password: "just testing"
    });

    expect(async () => {
      await showUserProfileUseCase.execute("123");
    }).rejects.toBeInstanceOf(ShowUserProfileError);

  });
})
