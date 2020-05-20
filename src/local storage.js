class local {

  // get user data from local storage
  get() {
    const localData = localStorage.getItem('userDetails');
    return localData;
  }

  // set userdata on local storage
  set(username, password) {
    const details = {
      username: username.toLowerCase(),
      password: password
    }
    const data = JSON.stringify(details)
    localStorage.setItem('userDetails', data);
  }
}

const ls = new local();

export default ls