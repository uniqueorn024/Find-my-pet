window.addEventListener("load", async (event) => {
    document.getElementById("addAnnousment").style.display = "none"
    const post_id = new URL(location.href).searchParams.get('id');
    const resp = await fetch('/get_post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({id: post_id})
        
      });
      const data= await resp.json();
      console.log("resp: ", data);
      if (data.status == "error"){
        console.log(data.message);
        return;
      }
      
    document.getElementById("name").innerText = "name: " + data.post.pet_name;
    document.getElementById("description").innerText = "description: " + data.post.description;
    document.getElementById("status").innerText = "status: " + data.post.status;
    document.getElementById("age").innerText = "age: " + data.post.age;
    document.getElementById("phone_num").innerText = "phone_num: " + data.post.phone_num;
    document.getElementById("notes").innerText = "notes: " + data.post.notes;


});