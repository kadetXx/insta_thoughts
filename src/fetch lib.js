class fetchLib {
  
  // Get data from api
  async get(url) {
    const res = await fetch(url);
    const data = await res.json();
    return data;
  };

  // Post data to api
  async post(url, post) {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(post)
    });
    const data = await res.json();
    return data;
  }

  // delete data from api
  async put(url, newData) {
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(newData)
    });
    
    const data = await res.json();
    return data;
  }

  // Delete dat from api
  async delete(url) {
    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json'
      }
    });
    const data = await 'Post deleted ✔';
    return data;
  }

}

const api = new fetchLib();

export default api;