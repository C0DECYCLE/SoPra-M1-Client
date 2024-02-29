import { assert } from "helpers/assert";
import { log } from "helpers/logger";
import User from "models/User";
import { HttpStatusCode } from "axios";
import { api, handleError } from "helpers/api";
import { toast } from "react-toastify";

class UserManagerSingleton {
  get isLoggedIn() {
    return this.me !== null;
  }

  constructor() {
    this.me = null;
  }

  async fetchUsers() {
    assert(this.isLoggedIn);
    log("try fetch users");
    try {
      const response = await api.get("/users");
      const users = response.data;
      console.log(users);
      return users;
    } catch (error) {
      console.error(
        `Something went wrong while fetching the users: \n${handleError(error)}`
      );
      console.error("Details:", error);
      toast.error(
        "Something went wrong while fetching the users! See the console for details."
      );
    }
    return false;
  }

  async registrate(userInput) {
    assert(!this.isLoggedIn && userInput);
    //log("try registrate user");
    try {
      const requestBody = JSON.stringify(userInput);
      const response = await api.post("/users", requestBody);
      this.#internalLogin(new User(response.data));
      return true;
    } catch (e) {
      const failure = e.response.data;
      if (failure.status === HttpStatusCode.Conflict) {
        toast.error(failure.message);
      } else {
        toast.error(
          `Something went wrong during the login: \n${handleError(e)}`
        );
      }
    }
    return false;
  }

  async login(userInput) {
    if (this.isLoggedIn) {
      return true;
    }
    if (userInput) {
      return await this.#loginWithUser(userInput);
    }
    const token = localStorage.getItem("token");
    if (token) {
      return await this.#loginWithToken(token);
    }
    return false;
  }

  async #loginWithUser(userInput) {
    assert(!this.isLoggedIn && userInput);
    //log("try login with user");
    try {
      const requestBody = JSON.stringify(userInput);
      const response = await api.post("/user", requestBody);
      this.#internalLogin(new User(response.data));
      return true;
    } catch (e) {
      const failure = e.response.data;
      if (failure.status === HttpStatusCode.Conflict) {
        toast.error(failure.message);
      } else {
        toast.error(
          `Something went wrong during the login: \n${handleError(e)}`
        );
      }
    }
    return false;
  }

  async #loginWithToken(token) {
    assert(!this.isLoggedIn && token);
    //log("try login with token");
    try {
      const requestBody = JSON.stringify({ token });
      const response = await api.post("/userWithToken", requestBody);
      this.#internalLogin(new User(response.data));
      return true;
    } catch (e) {
      console.log(e);
      const failure = e.response.data;

      if (failure.status === HttpStatusCode.Conflict) {
        this.logout();
      }
    }
    return false;
  }

  #internalLogin(user) {
    this.me = user;
    localStorage.setItem("token", this.me.token);
    //log("login", this.me);
  }

  logout() {
    if (!this.isLoggedIn) {
      return;
    }
    this.me = null;
    localStorage.removeItem("token");
    //log("logout", this.me);
  }
}

const UserManager = new UserManagerSingleton();

window.USERMANAGER = UserManager;

export default UserManager;
