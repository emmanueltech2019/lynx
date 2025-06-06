axios.defaults.baseURL='https://api.lynxinvestmentmanagement.com/api/v1/admin/';
// axios.defaults.baseURL='http://localhost:4000/api/v1/admin/';

let token = localStorage.getItem("AdminToken")

function formatMoney(number) {
  // Convert the number to a string
  const numberString = number.toString();

  // Split the number into whole and decimal parts (if any)
  const parts = numberString.split('.');
  let wholePart = parts[0];
  const decimalPart = parts[1] || '';

  // Add commas to the whole part
  let formattedNumber = '';
  while (wholePart.length > 3) {
    formattedNumber = ',' + wholePart.slice(-3) + formattedNumber;
    wholePart = wholePart.slice(0, wholePart.length - 3);
  }
  formattedNumber = wholePart + formattedNumber;

  // Combine the whole and decimal parts (if any)
  if (decimalPart) {
    formattedNumber += '.' + decimalPart;
  }

  return formattedNumber;
}

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })
const SignInForm = document.getElementById("SignInForm")

if (SignInForm) {
    SignInForm.addEventListener("submit", (e)=>{
        e.preventDefault()
        let email= SignInForm.email.value
        let password= SignInForm.password.value
       
        axios.post(`/login`,{email,password})
        .then((res)=>{
            localStorage.setItem("AdminToken", res.data.token)
           Toast.fire({
            icon: 'success',
            title: `${res.data.message}`
           })
           .then(()=>{
              window.location.replace("../admin/dashboard.html")
           })
            console.log(res)
        })
        .catch((err)=>{
            Toast.fire({
                icon: 'error',
                title:  `${err.response.data.message}`
              })
            console.log(err)
        })
    })
}

const depositsList = document.getElementById("depositsList")

if (depositsList) {
    axios({
        url:"/deposits",
        method:"get",
        headers:{
            Authorization:`Bearer ${token}`
        }
    })
    .then((res)=>{
        let items = res.data
        let htmlTemp =``
        items.map((item)=>{
            htmlTemp+=` <tr>
            <td>
              <div class="d-flex px-2 py-1">
                <div>
                  <img src="../assets/img/bitcoin.png" class="avatar avatar-sm me-3" alt="user2">
                </div>
                <div class="d-flex flex-column justify-content-center">
                  <h6 class="mb-0 text-sm">BTC</h6>
                  <p class="text-xs text-secondary mb-0">BITCOIN NETWORK</p>
                </div>
              </div>
            </td>
            <td>
              <p class="text-xs font-weight-bold mb-0">$${item.amount}</p>
              <p class="text-xs text-secondary mb-0">Deposit</p>
            </td>
            <td class="align-middle text-center text-sm">
              <span class="badge badge-sm bg-gradient-${item.status!="approved"?"secondary":"success"}">${item.status}
              </span>
            </td>
            <td class="align-middle text-center">
              <span class="text-secondary text-xs font-weight-bold">${item.date.split("T")[0]}</span>
            </td>
            <td class="align-middle text-center text-sm">
              <span class="badge badge-sm bg-gradient-success" onclick='approveDeposit(${JSON.stringify(item._id)}, ${JSON.stringify(item.userId)})'>Approve Deposit
              </span>
            </td>
          </tr>`
        })
        // console.log(htmlTemp, content)
        depositsList.innerHTML=htmlTemp
        // console.log(res)
    })
    .catch((err)=>{
        console.log(err)
    })
}

const withdrawList = document.getElementById("withdrawList")

if (withdrawList) {
    axios({
        url:"/withdrawals",
        method:"get",
        headers:{
            Authorization:`Bearer ${token}`
        }
    })
    .then((res)=>{
        let items = res.data
        let htmlTemp =``
        items.map((item)=>{
            htmlTemp+=` <tr>
            <td>
              <div class="d-flex px-2 py-1">
                <div>
                  <img src="../assets/img/bitcoin.png" class="avatar avatar-sm me-3" alt="user2">
                </div>
                <div class="d-flex flex-column justify-content-center">
                  <h6 class="mb-0 text-sm">BTC</h6>
                  <p class="text-xs text-secondary mb-0">BITCOIN NETWORK</p>
                </div>
              </div>
            </td>
            <td>
              <p class="text-xs font-weight-bold mb-0">$${item.amount}</p>
              <p class="text-xs text-secondary mb-0">Withdrawal</p>
            </td>
            <td class="align-middle text-center text-sm">
              <span class="badge badge-sm bg-gradient-${item.status!="completed"?"secondary":"success"}">${item.status}
              </span>
            </td>
            <td class="align-middle text-center">
              <span class="text-secondary text-xs font-weight-bold">${item.date.split("T")[0]}</span>
            </td>
            <td class="align-middle text-center text-sm">
              <span class="badge badge-sm bg-gradient-success" onclick='approveWithdrawal(${JSON.stringify(item._id)}, ${JSON.stringify(item.userId)})'>Approve Withdrawal
              </span>
            </td>
          </tr>`
        })
        withdrawList.innerHTML=htmlTemp
    })
    .catch((err)=>{
        console.log(err)
    })
}

function approveDeposit(id, userId) {
    console.log(id, userId)
    axios({
        url:"/deposit/approve",
        method:"post",
        data:{
            userId, 
            depositId:id
        },
        headers:{
            Authorization:`Bearer ${token}`
        }
    })
    .then((res)=>{
        console.log(res)
       Toast.fire({
        icon: 'success',
        title: `${res.data.message}`
       })
       .then(()=>{
          window.location.reload()
       })
    })
    .catch((err)=>{
        Toast.fire({
            icon: 'error',
            title:  `${err.response.data.message}`
          })
        console.log(err)
    })
}

// function approveWithdrawal(id, userId) {
//   console.log(id, userId)
//   alert("Approve withdrawal")
  // axios({
  //     url:"/withdrawal/approve",
  //     method:"post",
  //     data:{
  //         userId, 
  //         withdrawalId:id
  //     },
  //     headers:{
  //         Authorization:`Bearer ${token}`
  //     }
  // })
  // .then((res)=>{
  //     console.log(res)
  //    Toast.fire({
  //     icon: 'success',
  //     title: `${res.data.message}`
  //    })
  //    .then(()=>{
  //       window.location.reload()
  //    })
  // })
  // .catch((err)=>{
  //     Toast.fire({
  //         icon: 'error',
  //         title:  `${err.response.data.message}`
  //       })
  //     console.log(err)
  // })
// }

function approveWithdrawal(id, userId) {
  console.log(id, userId);

  // Create a modal container
  const modal = document.createElement('div');
  modal.style.position = 'fixed';
  modal.style.top = '0';
  modal.style.left = '0';
  modal.style.width = '100%';
  modal.style.height = '100%';
  modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
  modal.style.display = 'flex';
  modal.style.justifyContent = 'center';
  modal.style.alignItems = 'center';
  modal.style.zIndex = '1000';

  // Create a modal content box
  const modalContent = document.createElement('div');
  modalContent.style.backgroundColor = '#fff';
  modalContent.style.padding = '20px';
  modalContent.style.borderRadius = '5px';
  modalContent.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
  modalContent.style.width = '300px';

  // Create form inside modal
  const form = document.createElement('form');
  form.innerHTML = `
      <h5>Approve Withdrawal</h5>
      <label for="status">Select Status:</label><br/>
      <select id="status" class='input'>
          <option value="" >-- Select status --</option>
          <option value="reversed">reversed</option>
          <option value="failed">failed</option>
          <option value="completed">completed</option>
          <option value="pending">pending</option>
      </select>
      <br/><br/>
      <button type="submit" class='btn'>Submit</button>
      <button type="button" id="closeBtn" class='btn'>Cancel</button>
  `;

  // Append form to modal content
  modalContent.appendChild(form);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  // Close modal function
  const closeModal = () => {
      document.body.removeChild(modal);
  };

  // Event listeners
  document.getElementById('closeBtn').addEventListener('click', closeModal);
  form.addEventListener('submit', function (e) {
      e.preventDefault();
      const status = document.getElementById('status').value;
        axios({
      url:"/withdrawal/approve",
      method:"post",
      data:{
          userId, 
          withdrawalId:id,
          status
      },
      headers:{
          Authorization:`Bearer ${token}`
      }
  })
  .then((res)=>{
      console.log(res)
     Toast.fire({
      icon: 'success',
      title: `${res.data.message}`
     })
     .then(()=>{
        window.location.reload()
     })
  })
  .catch((err)=>{
      Toast.fire({
          icon: 'error',
          title:  `${err.response.data.message}`
        })
      console.log(err)
  })
      // console.log(`Withdrawal ${id} for user ${userId} is ${status}`);
      closeModal();
  });
}

const userList = document.getElementById("userList")

if (userList) {
    axios({
        url:"/users",
        method:"get",
        headers:{
            Authorization:`Bearer ${token}`
        }
    })
    .then((res)=>{
        let items = res.data
        let htmlTemp =``
        items.map((item)=>{
            htmlTemp+=` <tr>
            
            <td>
              <p class="text-xs font-weight-bold mb-0">${item.email}</p>
            </td>
            <td>
            <p class="text-xs font-weight-bold mb-0">${item.name}</p>
          </td>
           
            <td class="align-middle text-center">
              <span class="text-secondary text-xs font-weight-bold">${item.UserId}</span>
            </td>
            <td class="align-middle text-center">
              <span class="text-secondary text-xs font-weight-bold">${item.balance}</span>
            </td>
            <td class="align-middle text-center text-sm">
            <a href='../admin/user.html?id=${item._id}'>
            <span class="badge badge-sm bg-gradient-success">View User
            </span>
            </a>
          </td>
          </tr>`
        })
        console.log(userList)
        console.log(htmlTemp)
        userList.innerHTML=htmlTemp
    })
    .catch((err)=>{
        console.log(err)
    })
}

let updateForm = document.getElementById("updateForm")
if (updateForm) {
  axios({
    url:"/profile",
    method:"get",
    headers:{
      Authorization:`Bearer ${token}`
  }
  })
  .then((res)=>{
    let data = res.data
    updateForm.name.value=data.name
    updateForm.email.value=data.email
    updateForm.password.value=data.password
  })
  .catch((err)=>{
    console.log(err)
  })
  updateForm.addEventListener("submit",(e)=>{
    e.preventDefault()
    let name = updateForm.name.value
    let email = updateForm.email.value
    let password = updateForm.password.value
    // document.getElementById("profit").innerHTML="$" + formatMoney(data.profit)
    //    alert("kk")
        axios({
          url:"/update",
          method:"post",
          data:{name,email, password},
          headers:{
            Authorization:`Bearer ${token}`
        }
        })
        .then((res)=>{
           Toast.fire({
            icon: 'success',
            title: `${res.data.message}`
           })
           .then(()=>{
            window.location.reload()
           })
        })
        .catch((err)=>{
            Toast.fire({
                icon: 'error',
                title:  `${err.response.data.message}`
              })
            console.log(err)
        })
  })
}

let sumAll = document.getElementById("sumAll")
if (sumAll) {
  axios({
    url:"/sum",
    method:"get",
    headers:{
      Authorization:`Bearer ${token}`
  }
  })
  .then((res)=>{
    let {totalDeposit, totalWithdrawal, users, transactionHistory} = res.data
    document.getElementById("allUser").innerHTML=users
    document.getElementById("totalWithdrawal").innerHTML="$" + formatMoney(totalWithdrawal)
    document.getElementById("totalDepost").innerHTML="$" + formatMoney(totalDeposit)
    let items=transactionHistory
    let htmlTemp =``
    items.map((item)=>{
        htmlTemp+=`<tr>
        <td>
          <div class="d-flex px-2 py-1">
            <div>
              <img src="../assets/img/bitcoin.png" class="avatar avatar-sm me-3" alt="user2">
            </div>
            <div class="d-flex flex-column justify-content-center">
              <h6 class="mb-0 text-sm capitalize">${item.transactionType}</h6>
            </div>
          </div>
        </td>
        <td>
          <p class="text-xs font-weight-bold mb-0">$${item.amount}</p>
        </td>
        <td class="align-middle text-center text-sm">
          <span class="badge badge-sm bg-gradient-${item.status!="approved"?"secondary":"success"}">${item.status}
          </span>
        </td>
        <td class="align-middle text-center">
          <span class="text-secondary text-xs font-weight-bold">${item.date.split("T")[0]}</span>
        </td>
      </tr>`
    })
    const transactions = document.getElementById("transactions")

    transactions.innerHTML=htmlTemp

    console.log(res.data)
  })
  .catch((err)=>{
    console.log(err)
  })

}

let updateBalanceForm = document.getElementById("updateBalanceForm")

if(updateBalanceForm){
  // Get the URL parameters
  const urlParams = new URLSearchParams(window.location.search);

  // Get a specific parameter value
  const id = urlParams.get('id')
  if(id){
    axios({
      url:`/profile/${id}`,
      method:"get",
      headers:{
        Authorization:`Bearer ${token}`
      }
    })
    .then((res)=>{
      console.log(res)
      let infoB = document.getElementById("infoB")
      updateBalanceForm.balance.value=res.data.balance
      infoB.innerHTML=`
      <ul class="list-group">
        <li class="list-group-item border-0 ps-0 pt-0 text-sm"><strong class="text-dark">Full Name:</strong> &nbsp; ${res.data.name}</li>
        <li class="list-group-item border-0 ps-0 text-sm"><strong class="text-dark">Email:</strong> &nbsp; ${res.data.email}</li>
        <li class="list-group-item border-0 ps-0 text-sm"><strong class="text-dark">Password:</strong> &nbsp; ${res.data.password}</li>
        <li class="list-group-item border-0 ps-0 text-sm"><strong class="text-dark">Balance:</strong> &nbsp; ${res.data.balance}</li>
       
      </ul>`
    })
    updateBalanceForm.addEventListener("submit",(e)=>{
      e.preventDefault()
      let balance=updateBalanceForm.balance.value
      axios({
        url:`/balance`,
        method:"post",
        data:{balance, id},
        headers:{
          Authorization:`Bearer ${token}`
        }
      })
      .then(()=>{
        Toast.fire({
          title:"Updates sucessfully",
          icon:"success"
        })
        .then(()=>{window.location.reload()})
      })
    })
  }else{
    window.location.replace("../admin/users.html")
  }
}

// const transactions = document.getElementById("transactions")



// if (transactions) {
//   let token = localStorage.getItem("token")
//   axios({
//       url:"/transactions",
//       method:"get",
//       headers:{
//           Authorization:`Bearer ${token}`
//       }
//   })
//   .then((res)=>{
//     console.log(res)
//       let items = res.data.transactionHistory
//       let htmlTemp =``
//       items.map((item)=>{
//           htmlTemp+=`<tr>
//           <td>
//             <div class="d-flex px-2 py-1">
//               <div>
//                 <img src="../assets/img/bitcoin.png" class="avatar avatar-sm me-3" alt="user2">
//               </div>
//               <div class="d-flex flex-column justify-content-center">
//                 <h6 class="mb-0 text-sm capitalize">${item.transactionType}</h6>
//               </div>
//             </div>
//           </td>
//           <td>
//             <p class="text-xs font-weight-bold mb-0">$${item.amount}</p>
//           </td>
//           <td class="align-middle text-center text-sm">
//             <span class="badge badge-sm bg-gradient-${item.status!="approved"?"secondary":"success"}">${item.status}
//             </span>
//           </td>
//           <td class="align-middle text-center">
//             <span class="text-secondary text-xs font-weight-bold">${item.date.split("T")[0]}</span>
//           </td>
//         </tr>`
//       })
//       document.getElementById("balance").innerHTML="$" + formatMoney(res.data.balance)
//       document.getElementById("deposits").innerHTML="$" + formatMoney(res.data.totalDeposit)
//       document.getElementById("withdraws").innerHTML="$" + formatMoney(res.data.totalWithdrawal)
//       transactions.innerHTML=htmlTemp
//   })
//   .catch((err)=>{
//       console.log(err)
//   })
// }