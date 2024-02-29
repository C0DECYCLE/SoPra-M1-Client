class User {
  constructor(data = {}) {
    this.id = null;
    this.username = null;
    //dont save password locally! massive security leak
    this.token = null; //only my
    this.status = null;
    this.creation_date = null;
    this.birthday = null;
    Object.assign(this, data);
  }
}

export default User;
