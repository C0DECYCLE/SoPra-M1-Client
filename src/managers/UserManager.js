import { assert } from "helpers/utils";
import EventEmitter from "helpers/EventEmitter";
import { log, warn } from "helpers/logger";
import User from "models/User";
import { HttpStatusCode } from "axios";
import { api, handleError } from "helpers/api";
import { toast } from "react-toastify";
import "styles/index.scss";
import "react-toastify/dist/ReactToastify.css";
import { genericError } from "../helpers/api";

class UserManagerSingleton {
  static RateSeconds = 2;
  static FastPathUserFetching = true;

  get isLoggedIn() {
    return this.me !== null;
  }

  constructor() {
    this.me = null;
    this.list = [];
    this.onTick = new EventEmitter();
    this.#schedule();
  }

  #schedule() {
    setInterval(async () => {
      if (!this.isLoggedIn) {
        return;
      }
      await this.#updateList();
      this.#sendStatusPing();
      //await this.#updateMe();
      this.onTick.emit();
    }, UserManagerSingleton.RateSeconds * 1000);
  }

  async #updateList() {
    this.list = await this.fetchUsers();
  }

  #sendStatusPing() {
    assert(this.me && this.me.token);
    const body = JSON.stringify({ token: this.me.token });
    api.post("/userStatusPing", body);

    this.me.status = "ONLINE";
  }

  async #updateMe() {
    assert(this.me && this.me.id);
    const newMe = await this.getById(this.me.id);
    this.me.username = newMe.username;
    this.me.status = newMe.status;
    this.me.birthday = newMe.birthday;
  }

  hasId(id) {
    for (const user of this.list) {
      if (user.id === id) {
        return true;
      }
    }
    return false;
  }

  async getById(id) {
    if (UserManagerSingleton.FastPathUserFetching) {
      for (const user of this.list) {
        if (user.id === id) {
          return user;
        }
      }
      return null;
    }
    assert(this.isLoggedIn);
    try {
      const response = await api.get(`/users/${id}`);
      const user = response.data;
      return user;
    } catch (e) {
      genericError("Something went wrong while fetching the user", e);
    }
    return null;
  }

  async fetchUsers() {
    assert(this.isLoggedIn);
    try {
      const response = await api.get("/users");
      const users = response.data;
      return users;
    } catch (e) {
      genericError("Something went wrong while fetching the users", e);
    }
    return false;
  }

  async registrate(userInput) {
    assert(!this.isLoggedIn && userInput);
    try {
      const body = JSON.stringify(userInput);
      const response = await api.post("/users", body);
      this.#internalLogin(new User(response.data));
      toast.success("The new user has been successfully registered.");
      return true;
    } catch (e) {
      const failure = e.response.data;
      const backupMsg =
        "The username provided already exists. Please choose another one.";
      if (failure.status === HttpStatusCode.Conflict) {
        toast.error(failure.message || backupMsg);
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
    try {
      const body = JSON.stringify(userInput);
      const response = await api.post("/user", body);
      this.#internalLogin(new User(response.data));
      return true;
    } catch (e) {
      const failure = e.response.data;
      const backupMsg =
        "Username and/or password is not correct. Please try again.";
      if (failure.status === HttpStatusCode.Conflict) {
        toast.error(failure.message || backupMsg);
      } else {
        genericError("Something went wrong during the login", e);
      }
    }
    return false;
  }

  async #loginWithToken(token) {
    assert(!this.isLoggedIn && token);
    try {
      const body = JSON.stringify({ token });
      const response = await api.post("/userWithToken", body);
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
  }

  async update(username, birthday) {
    if (!username && !birthday) {
      return;
    }
    assert(this.isLoggedIn);
    try {
      const body = JSON.stringify({
        token: this.me.token,
        username: username || null,
        birthday: birthday || null,
      });
      await api.put(`/users/${this.me.id}`, body);

      if (username) {
        this.me.username = username;
      }
      if (birthday) {
        this.me.birthday = birthday;
      }

      toast.success("The user has been successfully updated.");
    } catch (e) {
      const failure = e.response.data;
      const backupMsg =
        "Updating the username and/or birthday failed. Please try again.";
      toast.warn(failure.message || backupMsg);
    }
  }

  async unbirthday() {
    assert(this.isLoggedIn);
    try {
      const body = JSON.stringify({ token: this.me.token });
      await api.put(`/users/unbirthday/${this.me.id}`, body);

      this.me.birthday = null;

      toast.success("The birthday has been successfully removed.");
    } catch (e) {
      const failure = e.response.data;
      const backupMsg = "Removing the birthday failed. Please try again.";
      toast.warn(failure.message || backupMsg);
    }
  }

  logout(force) {
    if (!force && !this.isLoggedIn) {
      return;
    }
    this.me = null;
    localStorage.removeItem("token");
  }
}

const UserManager = new UserManagerSingleton();

window.USERMANAGER = UserManager;

export default UserManager;
