//this will be THE list
let MasterList = []

//guest rooms
let rooms = {
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: []
}
//remember the light switch html
// false = unlocked
// true  = locked
let lockedRooms = {
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false
}

///////////////////////////////////MASTRE GUEST LIST FUNCTION
function updateMasterList(){
    //const allows the properties or elmeents to be hanged, but cannot change the value. this is important as this is the MGL and only the inside of it should be changed.
    const masterListEl = document.getElementById("masterguestlist")
    //this is needed or else everytime you duplicate it, it will re-add everything again
    masterListEl.innerHTML = ""
//i made it like this because it will go in order =>
    MasterList.forEach(guest => {
        //li basicaly creates another area for a new uest to be made
        const li = document.createElement("li")
        //a template when a guest is added
        li.textContent = `${guest.name} - Room ${guest.room} - Checked in at ${guest.time}`
        //adding the thing
        masterListEl.appendChild(li)
    })

}

///////////////////////////////////// LOAD DATA FROM LOCLA STORAGE
//used ai
function loadData() {
    // Get saved room data 
    //hotleRooms is basically the BIG storage. everything goes inside here, and youre basically getting the data from here
    const savedRooms = localStorage.getItem("hotelRooms")
    const savedLocks = localStorage.getItem("hotelLocks")
    const savedMaster = localStorage.getItem("masterGuestList")
    // JSON.parse basiclaly turns the string back into a data allowing you to show the thing
    if (savedRooms) {
        rooms = JSON.parse(savedRooms)
    }
    // if it existschange it back into an objec
    if (savedLocks) {
        lockedRooms = JSON.parse(savedLocks)
    }
    //if i were to use something else, it wouldnt wokr because local storage only accepts strings
    //didnt use tostring() because it doesnt look pretty
    if (savedMaster) {
        MasterList = JSON.parse(savedMaster)
    }
}
// SAVE DATA TO LOCAL STORAGE
//converting the objects into a string
function saveData() {
    localStorage.setItem("hotelRooms", JSON.stringify(rooms))
    localStorage.setItem("hotelLocks", JSON.stringify(lockedRooms))
    localStorage.setItem("masterGuestList", JSON.stringify(MasterList))
}
///////////////////////////////////////////////// LOCK / UNLOCK ROOM
//roomnum represents the room nmubers 123456. I made this so that i dont have to keep calling ou indivisual room numbers
function toggleLock(roomNum) {
    lockedRooms[roomNum] = !lockedRooms[roomNum]
    // Get the lock button for that room
    const btn = document.getElementById(`lockBtn-${roomNum}`)
    //btn.closest basically searches upwards to find the first element that matches the selector, ".room"
    //roomDiv is basically an easier way to type all the .room stuff, same with roomNum, i dont have to indivisually write each and every single one of them
    const roomDiv = btn.closest(".room")
    // If room is now locked
    if (lockedRooms[roomNum]) {
        btn.textContent = "Room Locked"  
        roomDiv.classList.add("locked")
    } else {
        btn.textContent = "Lock Room"
        roomDiv.classList.remove("locked")
    }
    saveData()
}
//////////////////////////////////////////////////////////add
function addItem(roomNum) {
    // If the room is locked, stop immediately
    if (lockedRooms[roomNum]) {
        document.getElementById(`output-${roomNum}`).innerHTML = "Room is locked!"
        return
    }
    const input = document.getElementById(`user-${roomNum}`)
    const output = document.getElementById(`output-${roomNum}`)
    // Remove extra spaces from input
    const name = input.value.trim()
    output.innerHTML = ""
    if (name === "") {
        output.innerHTML = "Enter a guest name"
        return
    }
    if (rooms[roomNum].length >= 5) {
        output.innerHTML = "Room is full"
        return
    }
    const now = new Date()
    const timestamp =
        now.getFullYear() + "-" +
        //the 2 is how much zeros youre adding
        String(now.getMonth() + 1).padStart(2, "0") + "-" +
        String(now.getDate()).padStart(2, "0") + " " +
        now.toLocaleTimeString()
    // Add guest object into the room array
    rooms[roomNum].push({
        name: name,
        time: timestamp
    })
    MasterList.push({
        name: name,
        room: roomNum,
        time: timestamp
    })
    input.value = ""
    updateList(roomNum)
    updateMasterList()
    saveData()
}
//////////////////////////////////////////////////////////remove
//usd the groccery thing (shopping list)
function removeItem(roomNum) {
    if (lockedRooms[roomNum]) {
        document.getElementById(`output-${roomNum}`).innerHTML = "Room is locked!"
        return
    }
    // Get delete number input
    const numInput = document.getElementById(`deleteNum-${roomNum}`)
    // Get output message area
    const output = document.getElementById(`output-${roomNum}`)
    // Convert typed value into a number
    const index = parseInt(numInput.value)
    output.innerHTML = ""
    // if it is a number or not
    if (index > 0 && index <= rooms[roomNum].length) {
        // Remove guest from array
        //-1 because it starts at 0
        rooms[roomNum].splice(index - 1, 1)
        updateList(roomNum)
        saveData()
    } else {
        output.innerHTML = "Invalid guest number"
    }
    numInput.value = ""
}
//////////////////////////////////////////////////////////remove all
//Clear All
function clearAll(ca){
    //clear ALL localstorage keys
    rooms[ca] = []
    updateList(ca)
    saveData()


}
function clearingMGL(camgl){
    MasterList[camgl] = []
    updateList(camgl)
    saveData()
}
//////////////////////////////////////////////////////////update
//using the local storage 1 or 2, p1 p2 and script.js function thing to help
function updateList(roomNum) {
    //get the list
    const listEl = document.getElementById(`guestlist-${roomNum}`)
    listEl.innerHTML = ""
    rooms[roomNum].forEach(guest => {
        // Create new <li>
        const li = document.createElement("li")
        // Show guest name + check-in time
        li.textContent = `${guest.name} — Checked in at ${guest.time}`
        // Add list item to page
        listEl.appendChild(li)
    })
}
//when it loads in, you update it
document.addEventListener("DOMContentLoaded", () => {
    loadData()
    //youre going through all of the list rooms and updating it
    for (let i = 1; i <= 6; i++) {
        updateList(i)
        const btn = document.getElementById(`lockBtn-${i}`)
        const roomDiv = btn.closest(".room")
        if (lockedRooms[i]) {
            btn.textContent = "Room Locked"
            roomDiv.classList.add("locked")
        }
        // enter key function
        const addInput = document.getElementById(`user-${i}`)
        addInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                addItem(i)
            }
        })
        // enter key function but for removing
        const removeInput = document.getElementById(`deleteNum-${i}`)
        removeInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                removeItem(i)
            }
        })
    }
    updateMasterList()
})
