// Select the userCards container
const userCards = document.getElementById("userCards");

// Function to create a user card dynamically
const createUserCard = ({ firstName, lastName, companyName, yearsEmployed }) => {
    const card = document.createElement("div");
    card.className = "user-card";
    card.innerHTML = `
        <h3>${firstName} ${lastName}</h3>
        <p>Company: ${companyName}</p>
        <p>Years: ${yearsEmployed}</p>
    `;
    return card;
};

// Function to fetch data from GitHub API
const fetchData = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};

function displayUsers(users) {
    userCards.innerHTML = ""; // Clear previous content
    console.log("Displaying users:", users); // Debugging line

    users.forEach(user => {
        if (!user.firstName || !user.lastName || !user.companyName || !user.yearsEmployed) {
            console.error("Invalid user object:", user);
            return;
        }

        
        const yearsEmployed = typeof user.yearsEmployed === "number" ? user.yearsEmployed : "Not Available";
        userCards.appendChild(createUserCard({ ...user, yearsEmployed }));
    });

    console.log("UserCards container updated:", userCards.innerHTML);
}


// Function to fetch all users
const fetchUsers = async () => {
    const url = "https://api.github.com/repos/dan-collins-dev/dummy-data-fetching-repo/contents/data/users.json";
    
    const data = await fetchData(url);
    if (!data?.content) {
        console.error("Invalid response structure: JSON content missing");
        return;
    }
    
    // Decode Base64 content
    const usersJSON = atob(data.content);
    console.log("Decoded JSON:", usersJSON);

    try {
        const users = JSON.parse(usersJSON);
        console.log("Parsed Users:", users);
        displayUsers(users); 
    } catch (error) {
        console.error("Error parsing JSON:", error);
    }
};

const fetchFilteredUsers = async () => {
    const url = "https://api.github.com/repos/dan-collins-dev/dummy-data-fetching-repo/contents/data/users.json";

    const data = await fetchData(url);
    if (!data?.content) {
        console.error("Invalid response structure: JSON content missing");
        return;
    }

    try {
        const usersJSON = atob(data.content);
        console.log("Decoded JSON:", usersJSON);

        const users = JSON.parse(usersJSON);
        console.log("Parsed Users:", users);

        if (!Array.isArray(users)) {
            throw new Error("Users data is not an array.");
        }

        
        const filteredUsers = users.filter(user => typeof user.yearsEmployed === "number" && user.yearsEmployed < 10);
        console.log("Filtered Users:", filteredUsers);

        displayUsers(filteredUsers);
    } catch (error) {
        console.error("Error parsing JSON:", error);
    }
};


// Function to clear user cards
const clearCards = () => {
    userCards.innerHTML = "";
};

// Event listener for buttons
document.addEventListener("click", (event) => {
    const { id } = event.target;
    if (id === "fetchAll") fetchUsers();
    if (id === "filterUsers") fetchFilteredUsers();
    if (id === "clearCards") clearCards();
});
