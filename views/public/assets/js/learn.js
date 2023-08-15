function toggleSidebar() {
    const sidebar = document.querySelector(".sidebar");
    sidebar.classList.toggle("show");

    const body = document.querySelector("body");
    body.classList.toggle("show-sidebar");

    var iconElement = document.getElementById("icon");
    var toggleBtn = document.querySelector(".toggle-btn");

    toggleBtn.classList.toggle("toggle-on");

    if (toggleBtn.classList.contains("toggle-on")) {
        iconElement.innerHTML = "<i class='bi bi-x-lg'></i>"; // Change the icon when toggled on
    } else {
        iconElement.innerHTML = "&#9776;"; // Change the icon back when toggled off
    }
}

//*Fetch data:
async function fetchData() {
    try {
        const response = await fetch('http://localhost:1337/api/learns?populate=deep');

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        var data = await response.json();

    } catch (error) {
        console.error('Fetch error:', error);
    }
    return data;
}

const nav2 = document.getElementById('nav2');
const sidebarLists = document.getElementById('sidebarLists');
const displayDiv = document.getElementById('displayDiv');

fetchData().then(data => {

    data.data.forEach(mainAnchorData => {
        const mainAnchorLi = document.createElement('li');
        mainAnchorLi.classList.add('nav-item');
        const liMainAnchor = document.createElement('a');
        liMainAnchor.classList.add('nav-link', 'splendid-link');
        liMainAnchor.textContent = mainAnchorData.attributes.mainAnchor;
        liMainAnchor.href = '#';
        mainAnchorLi.appendChild(liMainAnchor);


        mainAnchorLi.addEventListener('click', () => {
            populateSidebar(mainAnchorData.attributes.subAnchor);
        });

        nav2.appendChild(mainAnchorLi);
    });

    // Populate the sidebar with subAnchor items
    function populateSidebar(subAnchors) {
        clearElement(sidebarLists);; // Clear previous content

        subAnchors.forEach(subAnchorData => {
            const li = document.createElement('li');
            const subAnchorLink = document.createElement('a');
            subAnchorLink.textContent = subAnchorData.subAnchorTitle;
            subAnchorLink.href = '#';
            li.appendChild(subAnchorLink);

            subAnchorLink.addEventListener('click', () => {
                populateDisplayDiv(subAnchorData.seoPair);
            });

            sidebarLists.appendChild(li);
        });
    }

    // Populate the displayDiv with SEO pairs
    function populateDisplayDiv(seoPairs) {
        clearElement(displayDiv);; // Clear previous content

        seoPairs.forEach(seoPairData => {
            const seoPairElement = document.createElement('div');
            seoPairElement.classList.add('learn-content');
            seoPairElement.innerHTML = `
            <h3>${seoPairData.seoTitle}</h3>
            <p>${seoPairData.seoDescription}</p>
          `;
            displayDiv.appendChild(seoPairElement);
        });
    }
})

//*Clear InnerHTML:
function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}
