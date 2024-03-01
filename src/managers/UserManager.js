import { assert } from "helpers/utils";
import EventEmitter from "helpers/EventEmitter";
import { log, warn } from "helpers/logger";
import User from "models/User";
import { HttpStatusCode } from "axios";
import { api, handleError } from "helpers/api";
import { toast } from "react-toastify";
import { genericError } from "../helpers/api";

class UserManagerSingleton {
  static RateSeconds = 2;

  get isLoggedIn() {
    return this.me !== null;
  }

  constructor() {
    this.me = null;
    this.list = [];
    this.onListChange = new EventEmitter();
    this.#schedule();
  }

  #schedule() {
    setInterval(async () => {
      await this.#updateList();
      //send status ping
    }, UserManagerSingleton.RateSeconds * 1000);
  }

  async #updateList() {
    if (!this.isLoggedIn) {
      return;
    }
    this.list = await this.fetchUsers();
    this.onListChange.emit();
  }

  hasId(id) {
    for (const user of this.list) {
      if (user.id === id) {
        return true;
      }
    }
    return false;
  }

  getById(id) {
    for (const user of this.list) {
      if (user.id === id) {
        return user;
      }
    }
    return null;
  }

  async fetchUsers() {
    assert(this.isLoggedIn);
    //log("try fetch users");
    try {
      const response = await api.get("/users");
      const users = response.data;
      //log(users);
      return users;
    } catch (e) {
      genericError("Something went wrong while fetching the users", e);
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
      log(e);
      const failure = e.response.data;
      if (failure.status === HttpStatusCode.Conflict) {
        toast.error(failure.message);
      } else {
        genericError("Something went wrong during the login", e);
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
      log(e);
      const failure = e.response.data;
      if (failure.status === HttpStatusCode.Conflict) {
        toast.error(failure.message);
      } else {
        genericError("Something went wrong during the login", e);
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
      const failure = e.response.data;
      if (failure.status === HttpStatusCode.Conflict) {
        this.logout(true);
      }
    }
    return false;
  }

  #internalLogin(user) {
    this.me = user;
    localStorage.setItem("token", this.me.token);
    //log("login", this.me);
  }

  logout(force) {
    if (!force && !this.isLoggedIn) {
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
