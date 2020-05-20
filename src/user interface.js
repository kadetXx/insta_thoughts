class UserInterface {
  constructor () {
    this.postForm = document.querySelector('.post-form');
    this.postContainer = document.querySelector('.posts-container');
    this.body = document.querySelector('.post-form .body');
    this.signInForm = document.querySelector('#sign-in .modal-body form');
    this.signUpForm = document.querySelector('#sign-up .modal-body form');
    this.newUsername = document.querySelector('#up-username');
    this.newPass = document.querySelector('#up-password');
    this.signInUsername = document.querySelector('#in-username');
    this.signInPass = document.querySelector('#in-password');
    this.postsContainer = document.querySelector('.posts-container');
    this.compose = document.querySelector('#compose-btn');
  }

  displayPosts(posts, ls) {
    let output = '';
    posts.forEach(post => {
      let hidden;
      let isLoggedIn = JSON.parse(ls.get());
      
      const timestamp = moment(post.timestamp).fromNow();

      if (isLoggedIn == null) {
        hidden = 'user-only'
      } else if (post.author === isLoggedIn.username || isLoggedIn.username == 'kadet') {
        hidden = ''
      } else {
        hidden = 'user-only'
      }

      let disableClick;
      if (JSON.parse(ls.get()) !== null) {
        
        if (post.author == JSON.parse(ls.get()).username) {
          disableClick = 'disable-click'
        } else {
          disableClick = ''
        }
      }
      

      output += `
        <div class="post">
          <h6 class="author">@${post.author}</h6>
          <p class="post-body">${post.body}</p>
          <div class="post-icons-container row">
            <div class="votes col">
              <a href='#'><i class="fas fa-thumbs-up ${disableClick}" data-id = ${post.id}><span class="likes"> ${post.upvotes}</span></i></a>
              <a href='#'><i class="fas fa-thumbs-down ${disableClick}" data-id=${post.id}><span class="dislikes"> ${post.downvotes}</span></i></a>
            </div>
            <div class="time col">
              <p>${timestamp}<p/>
            </div>
            <div class="edit-icon col">
              <a href='#' class="${hidden}"><i class="edit fas fa-pencil-alt" data-id = ${post.id}></i></a>
              <a href='#' class = "${hidden}"><i class="delete fas fa-trash-alt" data-id = ${post.id}></i></a>
            </div>
          </div>
          <div class='alert-box'></div>
          <hr>
        </div>
      `
    });
    ui.postContainer.innerHTML = output;
  };

  updatePost(data, post) {
    post.innerText = data.body
  }

  updateVotes(data, target) {
    if (target.classList.contains('fa-thumbs-up')) {
      target.firstElementChild.innerText = ` ${data.upvotes}`;
    } else if (target.classList.contains('fa-thumbs-down')) {
      target.firstElementChild.innerText = ` ${data.downvotes}`;
    }
  }

  newPost(author) {

    const date = new Date();

    const post = {
      author: author,
      body: this.body.value,
      timestamp: date,
      upvotes: 0,
      downvotes: 0
    }

    return post;
  };

  clearFields() {
    this.body.value = '';
  };

  formValidate() {
    
    this.signUpForm.addEventListener('input', function (e) {
      if (e.target.id == 'up-username') {
        const re = /^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/;
        const result = re.test(e.target.value);
        if ((!result && e.target.value !== '') || e.target.value.length < 2) {
          e.target.classList.add('is-invalid');
          document.querySelector('#sign-up .username-feedback').innerText = 'Invalid username format'
        } else {
          e.target.classList.remove('is-invalid');
        }
      }

      if (e.target.id == 'up-password') {
        if (e.target.value.length < 4) {
          e.target.classList.add('is-invalid');
          document.querySelector('#sign-up .password-feedback').innerText = 'Password must be at least four characters';
        } else {
          e.target.classList.remove('is-invalid');
        }
      }

    })
  };

  showAlert(type, message, target) { 
  
    const alertBox = document.querySelector(`i[data-id = '${target.dataset.id}']`).parentElement.parentElement.parentElement.nextElementSibling;
    

    alertBox.innerHTML = `
        <div class="alert ${type}" role='alert'>
          ${message}
        </div>  
      `
    alertBox.style.display = 'block';

    setTimeout(() => {
      alertBox.style.display = 'none';
    }, 3000);

  }

};

const ui = new UserInterface();

export default ui;