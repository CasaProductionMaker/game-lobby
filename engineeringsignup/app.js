const firebaseConfig = {
    apiKey: "AIzaSyAz2QqeWXlONEScx0ncVN1xbl4HHS1H8-w",
    authDomain: "open-storage-57f9a.firebaseapp.com",
    databaseURL: "https://open-storage-57f9a-default-rtdb.firebaseio.com",
    projectId: "open-storage-57f9a",
    storageBucket: "open-storage-57f9a.firebasestorage.app",
    messagingSenderId: "43784184491",
    appId: "1:43784184491:web:3c159a5cb4836673b50dee"
};

const app = firebase.initializeApp(firebaseConfig);

const successModal = document.getElementById('success-modal');
const closeSuccess = document.getElementById('close-success');

closeSuccess.addEventListener('click', () => {
    successModal.style.display = "none";
});

function submit() {
    if (document.querySelector("#fullname").value === "" || document.querySelector("#email").value === "") {
        alert("Make sure to fill in all the fields.");
        return;
    }

    firebase.database().ref(`signups/${Date.now()}${Math.round(Math.random() * 1000)}`).set({
        discord: document.querySelector("#discord").value, 
		email: document.querySelector("#email").value, 
		grade: document.querySelector("#grade").value, 
		name: document.querySelector("#fullname").value, 
		photoperm: document.querySelector("#photoperm").value
    });

    document.querySelector("#fullname").value = "";
    document.querySelector("#email").value = "";
    document.querySelector("#discord").value = "";
    successModal.style.display = "flex";
}