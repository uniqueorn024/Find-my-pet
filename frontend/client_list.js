
  function add_post_to_list(field_data){
    let table = document.getElementById("post-list");
    /*field_data={
      name: document.getElementById("addName").value,
      uid: data_auth.user_id,
      description: document.getElementById("addDescription").value,
      age: document.getElementById("addAge").value,
      phone_number: document.getElementById("addPhone").value,
      status: document.getElementById("addStatus").value,
      notes: document.getElementById("addNotes").value
    }
*/
    let row = document.createElement("tr");
    let row_inner="";
    const date = new Date();

    row.innerHTML=`
      <td class="pTitle">Post id: ${field_data.id}</td>
      <td class="pDate">${field_data.date}</td>
    `;
    table.appendChild(row);
    //row.id = `r${myObj.projectNumber}`;
    row.onclick = (ev) => {

      window.open(`post.html?id=${field_data.id}`, '_blank');
  };

  }

  async function get_posts(){
    const resp = await fetch('/get_all_posts', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data= await resp.json();
    console.log("resp: ", data.posts);
    for(post of data.posts){
      add_post_to_list(post);
    }
  }


  window.addEventListener("load", (event) => {
    document.getElementById("list").setAttribute("class","active");
    get_posts();
    var addBtn = document.getElementById("add-annousment");
    addBtn.addEventListener("click", async (event) => {
      event.preventDefault();

      const resp_auth = await fetch('/auth_user', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data_auth = await resp_auth.json();
      console.log("resp: ", data_auth.user_id);


      if (data_auth.status=="error"){
        console.log(data_auth.message);
        return;
      }
      let date = new Date();
      let today_date = date.getDate().toString() + '/' + (date.getMonth()+1).toString() + '/' + date.getFullYear().toString();
      field_data={
        name: document.getElementById("addName").value,
        uid: data_auth.user_id,
        description: document.getElementById("addDescription").value,
        age: document.getElementById("addAge").value,
        phone_number: document.getElementById("addPhone").value,
        status: document.getElementById("addStatus").value,
        notes: document.getElementById("addNotes").value,
        date: today_date
      }

      
      console.log(document.getElementById("add-annousment-m-content"));
      const resp = await fetch('/addPost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(field_data)
      });

      const data = await resp.json();
      console.log("resp: ", data);
      document.getElementById("add-annousment-m-content").setAttribute("data-dismiss","modal");
      if(data.status == "error"){
        console.log("error");
        return;
      }
      field_data.id=data.post_id
      add_post_to_list(field_data);
      


    })
  });