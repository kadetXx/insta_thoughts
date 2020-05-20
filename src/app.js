import api from "./fetch lib.js";
import ui from "./user interface.js"
import ls from "./local storage.js"

// add event listener for pageload
document.addEventListener('DOMContentLoaded', getPosts);

function getPosts() {
  api.get('https://instathoughts.herokuapp.com/posts?_sort=timestamp&_order=desc')
    .then(data => {
      ui.displayPosts(data, ls);
    })
    .catch(err => console.log(err));
}

// call event listener for compose 
ui.compose.addEventListener('click', composeNew);
document.querySelector('#sidebar-compose-btn').addEventListener('click', composeNew)

function composeNew() {
  $('#compose').modal('show');
}

// call event listener for post submit
ui.postForm.addEventListener('submit', sendPost);

function sendPost(e) {

  if (ui.body.value !== '') {

    $('#compose').modal('hide');

    //get data from local storage and store as variable
    const auth = JSON.parse(ls.get());

    //check if user is logged in or not
    if (auth !== null) {

      //call new post method and pass in username/password from ls if user is logged in
      const post = ui.newPost(auth.username);

      // send post data to api
      api.post('https://instathoughts.herokuapp.com/posts', post)
        .then(data => {
          // call get data again after post has been data
          getPosts();

          // clear input fields after post has been added
          ui.clearFields()
        })
        .catch(err => console.log(err))
    } else {

      // show sign in modal if user is logged out
      $('#confirm-modal').modal('show');

      // show login or sign-up form after user input
      $('.sign-in').click(function(){
        $('#confirm-modal').modal('hide');
        $('#sign-in').modal('show');
        userCheck();
      });

      $('.sign-up').click(function(){
        $('#confirm-modal').modal('hide');
        $('#sign-up').modal('show');
         // call validate form ui method
        ui.formValidate();
        userCheck();
      });
        
    }

  } else {
    $('#compose').modal('hide');
  }

  e.preventDefault();
}

// sign in and sign up function
function userCheck() {

  //add event listener for sign up form submit
  ui.signUpForm.addEventListener('submit', (e) => {

    // set usename input as variable
    const newUser = ui.newUsername.value

    // get data from api with the new username as filter
    api.get(`https://instathoughts.herokuapp.com/thinkers?username=${newUser}`)
      .then(user => {

        // validate password, username and initiate sign up process
        if (ui.newUsername.classList.contains('is-invalid')) {
          ui.newUsername.classList.add('is-invalid');
          document.querySelector('#sign-up .username-feedback').innerText = 'Invalid username format'
        } else if (ui.newPass.classList.contains('is-invalid')) {
          ui.newPass.classList.add('is-invalid');
          document.querySelector('#sign-up .password-feedback').innerText = 'Password must be at least four characters';
        } else if (user.length == 0) {
          //set local storage user details from sign in modal submit
          const username = ui.newUsername.value
          const password = ui.newPass.value

          ls.set(username, password);

          // get data from local storage and save in a variable
          const authTwo = JSON.parse(ls.get());
          console.log(authTwo)
          // send new user to api
          api.post('https://instathoughts.herokuapp.com/thinkers', authTwo)
            .then(data => {
              console.log('worked');
            })
            .catch(err => console.log(err));

          // call new post method and pass in username/password from ls
          const post = ui.newPost(authTwo.username);
  
          // send new post to api 
          api.post('https://instathoughts.herokuapp.com/posts', post)
            .then(data => {
              //close sign up modal
              $('#sign-up').modal('hide');
              $('#compose').modal('hide');

              // call get data again after post has been data
              getPosts();

              // clear input fields after post has been added
              ui.clearFields();
            })
            .catch(err => console.log(err));

        } else {
          ui.newUsername.classList.add('is-invalid');
          document.querySelector('#sign-up .username-feedback').innerText = 'Username is already taken'
        }
      })
      .catch(err => console.log(err));

    e.preventDefault();
  });

  //add event listener for sign in form submit
  ui.signInForm.addEventListener('submit', (e) => {
    const username = ui.signInUsername.value;
    const password = ui.signInPass.value;

    api.get(`https://instathoughts.herokuapp.com/thinkers?username=${username}&password=${password}`)
      .then(user => {
        if (user.length == 0) {
          document.querySelector('#sign-in form .alert').style.display = 'block';
          setTimeout(() => {
            document.querySelector('#sign-in form .alert').style.display = 'none';
          }, 3000);
        } else {
          //set local storage data to sign in credentials
          ls.set(username, password);

          // get data from local storage and save in a variable
          const authTwo = JSON.parse(ls.get());

          // call new post method and pass in username/password from ls
          const post = ui.newPost(authTwo.username, authTwo.password);

          // send new post to api 
          api.post('https://instathoughts.herokuapp.com/posts', post)
            .then(data => {
              //close sign up modal
              $('#sign-in').modal('hide');
              $('#compose').modal('hide');

              // call get data again after post has been data
              getPosts();

              // clear input fields after post has been added
              ui.clearFields();
            })
            .catch(err => console.log(err));
        }
      })
      e.preventDefault();
  })
}
// call event listener for icon button click
ui.postsContainer.addEventListener('click', (e) => {


  if (JSON.parse(ls.get()) !== null) {

    // collect id of post from data id on icon
    const id = e.target.dataset.id;

    // delete post
    if (e.target.classList.contains('delete')) {
      if (confirm('Do you want to delete this thought')) {
        const target = e.target
        api.delete(`https://instathoughts.herokuapp.com/posts/${id}`)
        ui.showAlert('alert-danger', 'Deleting thought...', target);
        setTimeout(() => {
          getPosts();
        }, 2000);
      }
    }

    //edit post 

    // upvote post
    if (e.target.classList.contains('fa-thumbs-up')) {

      api.get(`https://instathoughts.herokuapp.com/posts/${id}`)
        .then(post => {
          const newData = {
            author: post.author,
            body: post.body,
            timestamp: post.timestamp,
            upvotes: parseInt(post.upvotes) + 1,
            downvotes: post.downvotes,
          }
          api.put(`https://instathoughts.herokuapp.com/posts/${id}`, newData)
            .then(data => {
              ui.updateVotes(data, e.target);
            })
            .catch(err => console.log(err))
        })
        .catch(err => console.log(err))

    }

    // downvote post
    if (e.target.classList.contains('fa-thumbs-down')) {
      api.get(`https://instathoughts.herokuapp.com/posts/${id}`)
        .then(post => {
          const newData = {
            author: post.author,
            body: post.body,
            timestamp: post.timestamp,
            upvotes: post.upvotes,
            downvotes: parseInt(post.downvotes) + 1
          }
          api.put(`https://instathoughts.herokuapp.com/posts/${id}`, newData)
            .then(data => {
              ui.updateVotes(data, e.target);
            })
            .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
    }

  } else if(e.target.classList.contains('fas')) {
    const target = e.target
    ui.showAlert('alert-warning', 'You must be logged in to vote on thoughts', target);
  }

  e.preventDefault();
})



